import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const MAIN_SUBGRAPH_URL =
  process.env.NEXT_PUBLIC_STRATEGIC_SWAP_SUBGRAPH_URL!;

const httpLink = new HttpLink({
  uri: MAIN_SUBGRAPH_URL,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({}),
});

export default client;
