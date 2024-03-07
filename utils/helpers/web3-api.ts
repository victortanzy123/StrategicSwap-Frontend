import { Contract, ethers, formatEther } from "ethers";
import { PairReserves, TransactionCall } from "./types";
import { WalletState } from "@web3-onboard/core";
import POOL from "@/contracts/StrategicPoolPairERC4626.json";
import ERC20 from "@/contracts/ERC20Mintable.json";
import {
  DEFAULT_CHAIN_DETAILS,
  DEFAULT_DECIMALS,
  formatValue,
  unformatValue,
} from "./web3";

// Multicall
import { Multicall2Helper } from "./multicall2";
import { safeDiv } from "./math";
import { DEFAULT_DECIMALS_PRECISION } from "./misc";

const POOL_ABI = POOL.abi;

async function getTokenBalance(
  contract: ethers.Contract,
  owner: string
): Promise<number> {
  try {
    const balance = await contract["balanceOf(address)"](owner);
    return balance as number;
  } catch (error) {
    console.log("ERROR FETCHING TOKEN BALANCE:", error);
    return 0;
  }
}

export async function getUpdatedReserves(
  poolPair: string
): Promise<PairReserves> {
  try {
    const contract = await getPoolContract(poolPair);
    const reserves = await contract["getReserves()"]();
    console.log("SEE RESERVES:", formatEther(reserves[0].toString()), reserves);
    const [reserves0, reserves1, _] = reserves;
    return {
      reserves0: formatEther(reserves0.toString()),
      reserves1: formatEther(reserves1.toString()),
    };
  } catch (error) {
    console.log("ERROR UPDATING RESERVES:", error);
    return {
      reserves0: "0",
      reserves1: "0",
    };
  }
}

export async function previewSwapAmountOut(
  poolPair: string,
  tokenIn: string,
  amountIn: string
): Promise<string> {
  // Need to format amount
  try {
    const contract = await getPoolContract(poolPair);
    const formattedAmountIn = amountIn;
    const previewAmountOut = await contract[
      "previewAmountOut(address,uint256)"
    ](tokenIn, formattedAmountIn);
    console.log(
      "SEE PREVIEW AMOUNT OUT:",
      previewAmountOut.toString(),
      formattedAmountIn
    );
    return previewAmountOut.toString();
  } catch (error) {
    console.log("ERROR PREVIEW SWAP", error);
    return "0";
  }
}

export function previewLpTokenAmountUponLP(
  token0Amount: number,
  token1Amount: number,
  reserve0: number,
  reserve1: number,
  totalSupply: number // LP Token supply
) {
  // console.log("SEE INSIDE", poolPair, user, token0Amount, token1Amount);
  // const contract = getPoolContract(poolPair);

  // // Simulate the call without actually executing it
  // const result = await contract.deposit.staticCall(
  //   user,
  //   unformatValue(token0Amount, DEFAULT_DECIMALS),
  //   unformatValue(token1Amount, DEFAULT_DECIMALS)
  // );
  const ratio0 = safeDiv(token0Amount * totalSupply, reserve0);
  const ratio1 = safeDiv(token1Amount * totalSupply, reserve1);

  return Math.min(ratio0, ratio1);
}

export async function checkSufficientTokenApproval(
  token: string,
  user: string,
  operator: string,
  amount: string // Unformatted to decimals precision
): Promise<boolean> {
  const contract = await getContract(token, ERC20.abi);

  try {
    const approvedAmount = await contract.allowance(user, operator);
    console.log("SEE RAW APPROVED AMOUNT:", approvedAmount);
    const formattedApprovedAmount = formatValue(
      approvedAmount,
      DEFAULT_DECIMALS
    ) as string;
    console.log(
      "SEE APPROVED AMOUNT:",
      formattedApprovedAmount,
      approvedAmount,
      amount,
      BigInt(approvedAmount) >= BigInt(amount)
    );
    return BigInt(approvedAmount) >= BigInt(amount);
  } catch (error) {
    console.log("ERROR VIEWING ALLOWANCE:", error);
    return false;
  }
}

export async function approveERC20Token(
  wallet: WalletState,
  tokenAddress: string,
  pairAddress: string,
  amount: string
): Promise<string> {
  console.log("SEE WALLET INSIDE APPROVE", wallet);
  const contract = await getContract(tokenAddress, ERC20.abi, wallet);
  console.log("SEE TOKEN CONTRACT", contract);
  try {
    const tx = await contract.approve(pairAddress, amount);
    const txReceipt = await tx.wait();

    return txReceipt.blockHash;
  } catch (error) {
    console.log("ERROR SETTING APPROVAL", error);
    return "";
  }
}

export async function depositLiquidity(
  wallet: WalletState,
  user: string,
  pairAddress: string,
  token0Address: string,
  token0Amount: number,
  token1Address: string,
  token1Amount: number
): Promise<string> {
  const contract = await getPoolContract(pairAddress, wallet!);
  const formattedToken0Amount = unformatValue(token0Amount, 18);
  const formattedToken1Amount = unformatValue(token1Amount, 18);

  try {
    if (
      !(await checkSufficientTokenApproval(
        token0Address,
        user,
        pairAddress,
        formattedToken0Amount
      ))
    ) {
      const approveToken0Res = await approveERC20Token(
        wallet,
        token0Address,
        pairAddress,
        formattedToken0Amount
      );
      if (!approveToken0Res) throw new Error();
    }

    if (
      !(await checkSufficientTokenApproval(
        token1Address,
        user,
        pairAddress,
        formattedToken1Amount
      ))
    ) {
      const approveToken1Res = await approveERC20Token(
        wallet,
        token1Address,
        pairAddress,
        formattedToken1Amount
      );
      if (!approveToken1Res) throw new Error();
    }

    console.log(
      "SEE DEPOSIT PARAMS",
      user,
      formattedToken0Amount,
      formattedToken1Amount
    );
    // Simulate the call without actually executing it
    const depositTx = await contract.deposit(
      user,
      formattedToken0Amount,
      formattedToken1Amount
    );
    const depositTxReceipt = await depositTx.wait();
    console.log("DEPOSIT TX", depositTxReceipt.blockHash);
    return depositTxReceipt.blockHash;
  } catch (error) {
    console.log("ERROR DEPOSITING LIQUIDITY:", error);
    return "";
  }
}

export async function withdrawLiquidity(
  wallet: WalletState,
  pairAddress: string,
  user: string,
  amount: number
): Promise<string> {
  const contract = await getPoolContract(pairAddress, wallet!);

  const formattedAmount = unformatValue(amount, 18);
  try {
    if (
      !(await checkSufficientTokenApproval(
        pairAddress,
        user,
        pairAddress,
        formattedAmount
      ))
    ) {
      const approveTx = await approveERC20Token(
        wallet,
        pairAddress,
        pairAddress,
        formattedAmount
      );
      if (!approveTx) throw new Error();
    }

    console.log("SEE WITHDRWAL PARAMS:", user, formattedAmount);
    const withdrawTx = await contract.withdraw(user, formattedAmount);
    const withdrawTxReceipt = await withdrawTx.wait();

    return withdrawTxReceipt.blockHash;
  } catch (error) {
    console.log("ERROR WITHDRAWING LIQUIDITY", error);
    return "";
  }
}

export async function swap(
  wallet: WalletState,
  pairAddress: string,
  user: string,
  tokenInAddress: string,
  tokenInAmount: number
): Promise<string> {
  console.log("SEE WALLET INPUT", wallet);
  const contract = await getPoolContract(pairAddress, wallet!);
  console.log("SEE CONTRACT", contract);
  const formattedTokenInAmount = unformatValue(tokenInAmount, 18);

  try {
    if (
      !(await checkSufficientTokenApproval(
        pairAddress,
        user,
        pairAddress,
        formattedTokenInAmount
      ))
    ) {
      console.log("APPROVING TOKEN");
      const approveTx = await approveERC20Token(
        wallet,
        tokenInAddress,
        pairAddress,
        formattedTokenInAmount
      );
      if (!approveTx) throw new Error();
    }

    console.log(
      "TRYING TO SWAP",
      user,
      tokenInAmount,
      formattedTokenInAmount,
      tokenInAddress
    );
    const swapTx = await contract.swap(
      formattedTokenInAmount,
      tokenInAddress,
      user,
      "0x"
    );
    const swapTxReceipt = await swapTx.wait();
    console.log("See swap TX RECEIPT", swapTxReceipt);

    return swapTxReceipt.blockHash;
  } catch (error) {
    console.log("ERROR SWAPPING TOKENS", error);
    return "";
  }
}

export async function getContract(
  address: string,
  abi: any,
  wallet?: WalletState | null
): Promise<Contract> {
  console.log("SEE WALLET BOOLEAN IN TOKEN CONTRACT", !!wallet);
  if (!!wallet) {
    const web3Provider = new ethers.BrowserProvider(wallet.provider, "any");
    const signer = await web3Provider.getSigner();

    return new ethers.Contract(address, POOL_ABI, signer);
  } else {
    const provider = new ethers.JsonRpcProvider(DEFAULT_CHAIN_DETAILS.rpcNode);
    return new ethers.Contract(address, abi, provider);
  }
}

export async function getPoolContract(
  address: string,
  wallet?: WalletState | null
): Promise<Contract> {
  console.log("SEE BOOLEAN:", !!wallet);

  if (!!wallet) {
    const web3Provider = new ethers.BrowserProvider(wallet.provider, "any");
    const signer = await web3Provider.getSigner();

    return new ethers.Contract(address, POOL_ABI, signer);
  } else {
    const web3Provider = new ethers.JsonRpcProvider(
      DEFAULT_CHAIN_DETAILS.rpcNode
    );
    return new ethers.Contract(address, POOL_ABI, web3Provider);
  }
}

export async function retrieveWalletOwnership(
  message: string,
  signer: ethers.Signer
): Promise<string> {
  try {
    const signature = await signer.signMessage(message);
    const addressRetrieved = ethers.verifyMessage(message, signature);
    return addressRetrieved;
  } catch (error) {
    console.log("[ERROR Retrieving Wallet Ownership]", error);
    return "";
  }
}

export async function submitTransaction(
  contract: Contract,
  functionCall: TransactionCall
) {
  try {
    const transaction = await functionCall(contract);
    return await transaction.wait();
  } catch (error) {
    console.error("Error executing transaction: \n" + error);
    return null;
  }
}

// Multicall Related Functions
export async function getUserTokenBalances(
  tokens: string[],
  user: string
): Promise<{ balances: string[]; tokens: string[] }> {
  const multicall = new Multicall2Helper(DEFAULT_CHAIN_DETAILS);
  try {
    const tokenBalancesPromises = tokens.map((address: string) =>
      multicall.balanceOf(address, user)
    );
    const balances = await Promise.all(tokenBalancesPromises);

    const formattedBalances = balances.map((rawBalance: any) =>
      parseFloat(ethers.formatUnits(rawBalance.toString(), "ether")).toFixed(
        DEFAULT_DECIMALS_PRECISION
      )
    );

    return {
      balances: formattedBalances,
      tokens,
    };
  } catch (error) {
    console.log("ERROR TOKEN BALANCE:", error);
    return { balances: [], tokens: [] };
  }
}
