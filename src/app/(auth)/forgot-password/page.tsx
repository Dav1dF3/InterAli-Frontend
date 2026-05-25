"use client";

import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GuestGuard } from "@/guards/guest-guard";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      setMessage(
        "Por ahora esta función no está disponible en la plataforma. Usa el acceso habitual o contacta soporte para ayudarte con tu cuenta."
      );
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo completar la solicitud");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <GuestGuard>
      <Card className="w-full max-w-xl border-border/70 bg-card/95 shadow-2xl">
        <CardContent className="p-8 sm:p-10">
          <CardHeader className="px-0 pt-0">
            <Badge variant="secondary" className="mb-3 w-fit rounded-full px-3 py-1">
              Acceso a tu cuenta
            </Badge>
            <CardDescription>Recuperación de acceso</CardDescription>
            <CardTitle className="text-3xl">No recuerdo mi contraseña</CardTitle>
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

            {message ? <p className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm">{message}</p> : null}
            {error ? <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={isSubmitting || !email.trim()}>
              {isSubmitting ? "Procesando..." : "Enviar solicitud"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Volver a <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">iniciar sesión</Link>
          </p>
        </CardContent>
      </Card>
    </GuestGuard>
  );
}
