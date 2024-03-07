import Image from "next/image";
import styles from "./page.module.css";
import { SWITCH_THEME_DURATION } from "@/utils/constants/switch-theme-duration";

import { PageWrapper } from "@/components/styles/page-wrapper";
import OverallMarketStatsView from "@/components/views/protocol/OverallMarketStatsView";

export default async function Home() {
  return (
    <>
      <PageWrapper>
        <div className={styles.container}>
          <main className={styles.main}>
            <div className="flex flex-col items-center justify-center gap-5">
              <h1
                className={`font-extrabold text-8xl text-slate-900 dark:text-slate-50 ${SWITCH_THEME_DURATION}`}
              >
                StrategicSwap
              </h1>
              <p
                className={`p-2 tracking-wide text-2xl rounded-sm text-slate-900 dark:text-slate-50 ${SWITCH_THEME_DURATION}`}
              >
                The Optimised AMM for Liquidity~
              </p>
            </div>

            <OverallMarketStatsView />
          </main>

          <footer className={styles.footer}>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by{" "}
              <span className={styles.logo}>
                <Image
                  src="/vercel.svg"
                  alt="Vercel Logo"
                  width={72}
                  height={16}
                />
              </span>
            </a>
          </footer>
        </div>
      </PageWrapper>
    </>
  );
}
