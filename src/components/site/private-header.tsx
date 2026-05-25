"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, LogOut, Menu, Plus, ShieldCheck } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";

const navigation = [
  { href: "/dashboard", label: "Resumen" },
  { href: "/dashboard/food-listings", label: "Mis publicaciones" },
  { href: "/dashboard/claims", label: "Solicitudes" },
];

export function PrivateHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { user, logoutAction } = useAuth();
  const isDonor = user?.role === "donor";
  const isReceiver = user?.role === "receiver";
  const isAdmin = user?.role === "admin";

  function handleLogout() {
    logoutAction();
    router.replace("/");
  }

  return (
    <header className="border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{user?.full_name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "IA"}</AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight text-foreground">Tu espacio</p>
            <p className="text-xs text-muted-foreground">{isAdmin ? "Vista general" : isDonor ? "Publicaciones" : "Explorar comida"}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navigation.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm" className="rounded-full">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden rounded-full px-3 py-1 sm:inline-flex">
            <ShieldCheck className="mr-2 size-3.5" />
            {isAdmin ? "Coordinación" : isDonor ? "Publica" : isReceiver ? "Solicita" : "Tu espacio"}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden rounded-full lg:inline-flex">
                Acciones
                <ChevronRight className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Accesos rápidos</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/food-listings">
                  <Plus className="mr-2 size-4" />
                  {isDonor ? "Nueva publicación" : isAdmin ? "Ver publicaciones" : "Ver publicaciones"}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/claims">{isReceiver ? "Ver solicitudes" : "Revisar solicitudes"}</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleLogout()}>
                <LogOut className="mr-2 size-4" />
                Salir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" className="rounded-full" onClick={() => handleLogout()}>
            Salir
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon-sm" className="rounded-full lg:hidden">
                <Menu className="size-4" />
                <span className="sr-only">Abrir navegación</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] sm:w-[24rem]">
              <SheetHeader className="space-y-2 pr-8">
                <SheetTitle>Área privada</SheetTitle>
                <SheetDescription>Accesos rápidos para publicaciones y reclamos.</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-2 px-4 pb-4">
                {navigation.map((item) => (
                  <Button key={item.href} asChild variant="ghost" className="justify-start rounded-2xl" onClick={() => setMobileOpen(false)}>
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                ))}
                <Button asChild className="justify-start rounded-2xl" onClick={() => setMobileOpen(false)}>
                  <Link href="/dashboard/food-listings">{isDonor ? "Nueva publicación" : isAdmin ? "Ver publicaciones" : "Ver publicaciones"}</Link>
                </Button>
                <Button variant="outline" className="justify-start rounded-2xl" onClick={() => { setMobileOpen(false); handleLogout(); }}>
                  Salir
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}