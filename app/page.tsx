import Image from "next/image";
import styles from "./page.module.css";
import { SWITCH_THEME_DURATION } from "@/utils/constants/switch-theme-duration";

import { PageWrapper } from "@/components/styles/page-wrapper";

async function getData() {
  const productsResponse = await fetch(
    "https://jsonplaceholder.typicode.com/posts"
  );
  const products = await productsResponse.json();

  console.log("Here: ", products);

  return products;
}

export default async function Home() {
  const products = await getData();
  console.log("Products: ", products);

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
            <h1 className={styles.title}>
              Welcome to <a href="https://nextjs.org">Next.js 13!</a>
            </h1>

            <p className={styles.description}>
              Get started by editing
              <code className={styles.code}>app/page.tsx</code>
            </p>

            <div className={styles.grid}>
              <a href="https://beta.nextjs.org/docs" className={styles.card}>
                <h2>Documentation &rarr;</h2>
                <p>Find in-depth information about Next.js 13</p>
              </a>

              <a
                href="https://github.com/vercel/next.js/tree/canary/examples"
                className={styles.card}
              >
                <h2>Examples &rarr;</h2>
                <p>Explore the Next.js 13 playground.</p>
              </a>

              <a
                href="https://vercel.com/templates/next.js/app-directory?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.card}
              >
                <h2>Deploy &rarr;</h2>
                <p>Deploy your Next.js site to a public URL with Vercel.</p>
              </a>
            </div>
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
