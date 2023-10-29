"use client";
import { useRouter } from "next/router";

import { PageWrapper } from "@/components/styles/page-wrapper";
import PoolHeader from "@/components/views/pools/pool-header";
import PoolLayout from "@/components/views/pools/pool-layout";

export default async function PoolsPage() {
  const router = useRouter();
  const slug = router.query.slug;
  return (
    <PageWrapper className={"w-full block justify-center px-8 py-16"}>
      <PoolHeader />
      <PoolLayout />
    </PageWrapper>
  );
}
