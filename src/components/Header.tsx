"use client";

import { LoginDialog } from "@/components/LoginDialog";
import { UserPen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-end gap-5">
        <Link href="/" className="text-2xl font-bold hover:opacity-80">
          Factions Manager
        </Link>

        <Link
          href="/nomes"
          className={`flex items-center gap-2 cursor-pointer hover:opacity-80 pb-1 ${
            pathname === "/nomes"
              ? "border-b border-foreground border-black"
              : ""
          }`}
        >
          <UserPen className="w-4 h-4" />
          <span>Nomes</span>
        </Link>
      </div>

      <LoginDialog />
    </div>
  );
}
