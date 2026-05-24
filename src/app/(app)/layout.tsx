"use client";

import type { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";
import { PrivateHeader } from "@/components/site/private-header";
import { AuthGuard } from "@/guards/auth-guard";

export default function AppLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <PrivateHeader />

        <Separator />

        <main>{children}</main>
      </div>
    </AuthGuard>
  );
}