import { FunctionFragment, Interface } from "ethers";
import { ChainDetails } from "./types";
import { Contract } from "ethers";
import { getContract } from "./web3-api";

//  ABIs
import ERC20 from "../../contracts/ERC20Mintable.json";
import MULTICALL2 from "../../contracts/Multicall2.json";
import STRATEGIC_POOL from "../../contracts/StrategicPoolPairERC4626.json";

// type ERC721

type Call = {
  target: string;
  fragment: FunctionFragment;
  params: any[];
};

type CallData = {
  target: string;
  callData: string;
};

const MULTICALL2_ADDRESS: string = "0x25Eef291876194AeFAd0D60Dff89e268b90754Bb"; // SEPOLIA

export class Multicall2Helper {
  multicall!: Contract;
  ethersInterface: Interface = new Interface([]);
  poolInterface: Interface = new Interface(STRATEGIC_POOL.abi);
  erc20Interface: Interface = new Interface(ERC20.abi);
  batch: Call[] = [];
  executionPromise: Promise<any> | null = null;

  constructor(networkConfig: ChainDetails) {
    this.initialiseMulticall(networkConfig);
  }

  private async initialiseMulticall(
    networkConfig: ChainDetails
  ): Promise<void> {
    this.multicall = await getContract(MULTICALL2_ADDRESS, MULTICALL2.abi);
  }

  async balanceOf(address: string, user: string): Promise<number> {
    const nameFxFragment =
      this.erc20Interface.getFunction("balanceOf(address)");
    return this.addCallData(address, nameFxFragment!, [user]);
  }

  async getReserves(poolAddress: string): Promise<any> {
    const reservesFxFragment = this.poolInterface.getFunction("getReserves()");
    return this.addCallData(poolAddress, reservesFxFragment!, []);
  }

  addCallData<T>(
    address: string,
    fragment: FunctionFragment,
    params: any[]
  ): Promise<T> {
    let id = this.batch.push({ target: address, fragment, params }) - 1;
    if (!this.executionPromise) {
      this.executionPromise = this.execute();
    }
    return this.executionPromise?.then((results) => results[id] as T);
  }

  async execute(): Promise<any[]> {
    const resolver = Promise.resolve().then(async () => {
      const callDatas: CallData[] = this.batch.map((call) => {
        return {
          target: call.target,
          callData: this.ethersInterface.encodeFunctionData(
            call.fragment,
            call.params
          ),
        };
      });
      const currentBatch = this.batch;
      this.batch = [];
      this.executionPromise = null;
      let result = [];
      try {
        const res = await this.multicall.aggregate.staticCall(callDatas); // ethers V6
        const [blockNumber, returnDatas, _] = res;
        result = returnDatas;
      } catch (error) {
        console.log("[CALL STATIC AGGREGATE ERROR]", error);
      }
      const decoded = result.map((data: any, i: number) => {
        const call = currentBatch[i];
        const output = this.ethersInterface.decodeFunctionResult(
          call.fragment,
          data
        );
        if (call.fragment.outputs!.length === 1) {
          return output[0];
        } else {
          return output;
        }
      });
      return decoded;
    });

    return resolver;
  }
}
