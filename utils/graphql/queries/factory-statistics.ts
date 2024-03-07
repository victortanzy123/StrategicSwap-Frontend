import gql from "graphql-tag";
import { FACTORY_ADDRESS } from "@/utils/constants";
import { FACTORY_STATISTICS_FIELD } from "../fragments";

export function factoryStatisticsQuery() {
  //   return gql`
  //     ${FACTORY_STATISTICS_FIELD}
  //     query StrategicSwapFactory($id: String!) {
  //       data: strategicSwapFactory(id: $id) {
  //         ...FactoryStatisticsFields
  //       }
  //     }
  //   `;
  return gql`
    ${FACTORY_STATISTICS_FIELD}
    query GetFactoryStatistics($id: String) {
      data: strategicSwapFactory(id: $id) {
        ...FactoryStatisticsFields
      }
    }
  `;
}
