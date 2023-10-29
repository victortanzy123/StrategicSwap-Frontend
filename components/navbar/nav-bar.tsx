"use client";
import { useState, useEffect } from "react";
import { TabItem } from "./tab-item";
import classes from "./navbar.module.css";
import WalletButton from "./wallet-button";

const NAV_TABS: { path: string; text: string }[] = [
  {
    path: "/",
    text: "home",
  },
  {
    path: "pools",
    text: "pools",
  },
  {
    path: "swap",
    text: "swap",
  },
];

export const NavBar = () => {
  const [isSticky, setIsSticky] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(() => (window.scrollY > 0 ? true : false));
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.navTabsWrapper}>
        <ul className={classes.navTabsList}>
          {NAV_TABS.map(({ path, text }) => (
            <TabItem key={path} path={path} text={text} />
          ))}
        </ul>
        <WalletButton />
      </div>
      {/* <ThemeSwitcher /> */}
    </div>
  );
};
