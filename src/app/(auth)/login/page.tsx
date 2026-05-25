import { LoginForm } from "@/components/auth/login-form";

type LoginPageProps = {
  searchParams?: {
    next?: string | string[];
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const nextPath = Array.isArray(searchParams?.next) ? searchParams?.next[0] : searchParams?.next;
  const redirectTarget = nextPath && nextPath.startsWith("/") ? nextPath : "/dashboard";

  return <LoginForm redirectTarget={redirectTarget} />;
}