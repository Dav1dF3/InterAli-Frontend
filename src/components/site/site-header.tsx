"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Leaf } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const navigation = [
  { href: "/", label: "Inicio" },
  { href: "/food-listings", label: "Comidas" },
];

export function SiteHeader() {
  const router = useRouter();
  const { isAuthenticated, logoutAction } = useAuth();

  function handleLogout() {
    logoutAction();
    router.replace("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
            <Leaf className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight text-foreground">InterAli</p>
            <p className="text-xs text-muted-foreground">Donación de alimentos con flujo claro</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm" className="rounded-full">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="hidden rounded-full px-3 py-1 sm:inline-flex">
            Información actualizada
          </Badge>
          {isAuthenticated ? (
            <>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link href="/dashboard">
                  Ir al panel
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="sm" className="rounded-full" onClick={handleLogout}>
                Salir
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full">
                <Link href="/register">Crear cuenta</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}