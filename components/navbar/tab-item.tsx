"use client";
import Link from "next/link";

export const TabItem = ({ path, text }: { path: string; text: string }) => {
  return (
    <li
      className={`relative font-semibold inline-block mx-2 my-2 text-md uppercase no-underline group tracking-wider`}
    >
      <Link
        className={
          "block py-3 px-5 relative transition-all duration-300 group-hover:border-transparent text-white"
        }
        href={path}
      >
        {text}
        <span className="absolute inset-x-1/2 -bottom-1 w-0 h-1 bg-white transition-all duration-300 rounded-md group-hover:left-0 group-hover:w-full"></span>
      </Link>
    </li>
  );
};
