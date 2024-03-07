import { PageWrapper } from "@/components/styles/page-wrapper";
import PoolMainView from "@/components/views/pools/pool-main-view";

export default async function PoolsPage() {
  return (
    <PageWrapper className={"w-full block justify-center px-8 py-16"}>
      <PoolMainView />
    </PageWrapper>
  );
}
