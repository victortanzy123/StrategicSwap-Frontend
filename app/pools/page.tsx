import { PageWrapper } from "@/components/styles/page-wrapper";
import PoolHeader from "@/components/views/pools/pool-header";
import PoolLayout from "@/components/views/pools/pool-layout";

export default async function PoolsPage() {
  return (
    <PageWrapper className={"w-full block justify-center px-8 py-16"}>
      <PoolHeader />
      <PoolLayout />
    </PageWrapper>
  );
}
