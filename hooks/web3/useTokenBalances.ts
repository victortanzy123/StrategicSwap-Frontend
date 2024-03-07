import React, { useEffect, useState } from "react";

type UseTokenBalancesProps = {
  tokenAddresses: string[];
  user: string;
};

type TokenBalancesState = {
  tokenBalances: number[];
  loading: boolean;
};

function useTokenBalances({ tokenAddresses, user }: UseTokenBalancesProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [tokenBalances, setTokenBalances] = useState<number[]>([]);

  useEffect(() => {}, [tokenAddresses, user]);

  return {
    tokenBalances: [],
    loading,
  };
}

export default useTokenBalances;
