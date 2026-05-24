"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GuestGuard } from "@/guards/guest-guard";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const { loginAction } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await loginAction({ email, password });
      router.push("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo iniciar sesión");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <GuestGuard>
      <Card className="grid w-full max-w-5xl overflow-hidden border-border/70 bg-card/95 shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
      <div className="hidden flex-col justify-between gap-8 bg-primary p-10 text-primary-foreground lg:flex">
        <div className="space-y-4">
          <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-secondary-foreground">
            Acceso privado
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight">Entra al panel para ofrecer o reclamar comida.</h1>
          <p className="max-w-md text-base leading-7 text-primary-foreground/80">
            El acceso con JWT te permitirá mantener separada la experiencia pública de la operación privada.
          </p>
        </div>
        <div className="rounded-3xl border border-white/15 bg-white/10 p-5 text-sm leading-7 text-primary-foreground/90 backdrop-blur">
          Diseñado para donors que publican listings y receivers que reclaman con rapidez.
        </div>
      </div>

      <CardContent className="flex flex-col justify-center p-8 sm:p-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Button type="button" variant="ghost" className="rounded-full px-0 text-muted-foreground hover:text-foreground" onClick={() => router.back()}>
            Volver atrás
          </Button>
          <Button asChild type="button" variant="outline" className="rounded-full">
            <Link href="/">Ir al inicio</Link>
          </Button>
        </div>

        <CardHeader className="px-0 pt-0">
          <CardDescription>Bienvenido de vuelta</CardDescription>
          <CardTitle className="text-3xl">Inicia sesión en InterAli</CardTitle>
        </CardHeader>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nombre@correo.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Tu contraseña"
              autoComplete="current-password"
              required
            />
          </div>

          {error ? (
            <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando..." : "Entrar"}
          </Button>
        </form>

        <div className="mt-6 space-y-1 text-sm text-muted-foreground">
          ¿Todavía no tienes cuenta?{" "}
          <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
            Crear cuenta
          </Link>
          <p>
            <Link href="/forgot-password" className="font-medium text-foreground underline-offset-4 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
        </div>
      </CardContent>
      </Card>
    </GuestGuard>
  );
}