import { truncateAddress } from "@/utils/helpers/misc";
import { ReactNode } from "react";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="p-8 w-full flex flex-col items-center">{children}</div>
  );
}
