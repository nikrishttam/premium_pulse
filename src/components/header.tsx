import React from "react";
import { github_link, site_name } from "@/lib/constants";
import Image from "next/image";

export default function Header() {
  return (
    <header className="relative w-full p-4 flex justify-center items-center border-b border-b-gray-300">
      {/* GitHub link (top-right) */}
      <a
        href={github_link}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-80"
        aria-label="View source on GitHub"
      >
        <Image
          src="/github.svg"
          alt="GitHub"
          width={28}
          height={28}
        />
      </a>

      {/* Center title & logo */}
      <h1 className="inline-flex gap-2 items-center text-center">
        <span className="italic text-red-500 font-extrabold">All Free</span>
        {site_name}
        <span>
          <Image
            src="/logo.svg"
            alt="TOI+ Logo"
            width={50}
            height={20}
            sizes="50px"
          />
        </span>
      </h1>
    </header>
  );
}
