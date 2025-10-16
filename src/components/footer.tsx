import { footer_text } from "@/lib/constants";
import React from "react";

export default function Footer() {
  return (
    <footer className="flex items-center justify-center p-2 border-t border-t-gray-300">
      {footer_text}
    </footer>
  );
}
