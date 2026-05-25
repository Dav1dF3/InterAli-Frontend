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
import type { UserRole } from "@/lib/types";

const roles: Exclude<UserRole, "admin">[] = ["receiver", "donor", "volunteer"];

export default function RegisterPage() {
  const router = useRouter();
  const { registerAction } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Exclude<UserRole, "admin">>("receiver");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await registerAction({
        email,
        full_name: fullName || null,
        password,
        confirm_password: confirmPassword,
        role,
      });
      router.push("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo crear la cuenta");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <GuestGuard>
      <Card className="grid w-full max-w-5xl overflow-hidden border-border/70 bg-card/95 shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
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
          <CardDescription>Nuevo usuario</CardDescription>
          <CardTitle className="text-3xl">Crea tu cuenta en InterAli</CardTitle>
        </CardHeader>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="full_name">Nombre completo</Label>
            <Input
              id="full_name"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Tu nombre"
              autoComplete="name"
            />
          </div>

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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirmar contraseña</Label>
              <Input
                id="confirm_password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Tipo de cuenta</Label>
            <div className="flex flex-wrap gap-3">
              {roles.map((item) => (
                <Button
                  key={item}
                  type="button"
                  variant={role === item ? "default" : "outline"}
                  onClick={() => setRole(item)}
                  className="rounded-full"
                >
                  {item === "donor" ? "Donante" : item === "volunteer" ? "Voluntario" : "Receptor"}
                </Button>
              ))}
            </div>
          </div>

          {error ? (
            <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </CardContent>

      <div className="hidden flex-col justify-between gap-8 bg-foreground p-10 text-background lg:flex">
        <div className="space-y-4">
          <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-secondary-foreground">
            Registro flexible
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight">Crea tu perfil para publicar o pedir comida.</h1>
          <p className="max-w-md text-base leading-7 text-background/75">
            Elige cómo quieres participar y completa tus datos para empezar.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-background/90 backdrop-blur">
          Todo está pensado para que el proceso sea simple, claro y sin pasos de más.
        </div>
      </div>
      </Card>
    </GuestGuard>
  );
}