import React from "react";
import { site_name } from "@/lib/constants";
import Image from "next/image";
export default function Header() {
  return (
    <header className="w-full p-4 justify-center items-center flex border-b border-b-gray-300">
      <h1 className="inline-flex gap-2 items-center">
       <span className="italic text-red-500 font-extrabold">All Free</span> {site_name}{" "}
        <span>
          <Image src="logo.svg" alt="TOI+ Logo" width={50} height={20} sizes="50px" />{" "}
        </span>
      </h1>
    </header>
  );
}
