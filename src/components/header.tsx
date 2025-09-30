"use client";
import React from "react";
import { github_link, site_name } from "@/lib/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
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
        <Image src="/github.svg" alt="GitHub" width={28} height={28} />
      </a>

      <h1
        className="inline-flex gap-2 items-center text-center mx-auto cursor-pointer underline decoration-dotted decoration-4 decoration-gray-400 hover:opacity-80 text-4xl font-bold"
        onClick={() => router.push("/")}
      >
        {site_name}
      </h1>
    </header>
  );
}
