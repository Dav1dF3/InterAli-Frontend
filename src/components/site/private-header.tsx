"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu, MoreHorizontal, Plus, ShieldCheck } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

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
import { clearSession } from "@/lib/auth-storage";

const navigation = [
  { href: "/dashboard", label: "Resumen" },
  { href: "/dashboard/food-listings", label: "Mis listings" },
  { href: "/dashboard/claims", label: "Claims" },
];

export function PrivateHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  function handleLogout() {
    clearSession();
    router.replace("/");
  }
  return (
    <header className="border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>IA</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight text-foreground">InterAli privado</p>
              <p className="text-xs text-muted-foreground">Operación de listings y claims</p>
            </div>
          </Link>

          <div className="hidden sm:block">
            <Breadcrumb aria-label="breadcrumbs" className="ml-2">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard">Inicio</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbPage>Panel privado</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

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
            Panel privado
          </Badge>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden rounded-full lg:inline-flex">
                    <MoreHorizontal className="size-4" />
                    Acciones
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Acciones rápidas</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Accesos rápidos</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/food-listings">
                  <Plus className="mr-2 size-4" />
                  Nuevo listing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/claims">Revisar claims</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleLogout()}>
                <LogOut className="mr-2 size-4" />
                Salir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => handleLogout()}>
                Salir
              </Button>
            </TooltipTrigger>
            <TooltipContent>Cerrar sesión</TooltipContent>
          </Tooltip>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon-sm" className="rounded-full lg:hidden">
                    <Menu className="size-4" />
                    <span className="sr-only">Abrir navegación</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Abrir navegación</TooltipContent>
              </Tooltip>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] sm:w-[24rem]">
              <SheetHeader className="space-y-2 pr-8">
                <SheetTitle>Panel privado</SheetTitle>
                <SheetDescription>Accesos rápidos para operar listings y claims.</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-2 px-4 pb-4">
                {navigation.map((item) => (
                  <Button key={item.href} asChild variant="ghost" className="justify-start rounded-2xl" onClick={() => setMobileOpen(false)}>
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                ))}
                <Button asChild className="justify-start rounded-2xl" onClick={() => setMobileOpen(false)}>
                  <Link href="/dashboard/food-listings">Nuevo listing</Link>
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