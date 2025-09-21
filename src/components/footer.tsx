import { footer_text } from "@/lib/constants";
import React from "react";

export default function Footer() {
  return (
    <footer className="flex items-center justify-center p-4">
      {footer_text}
    </footer>
  );
}
