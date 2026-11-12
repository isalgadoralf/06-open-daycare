import { LoginBrandPanel } from "@/components/auth/login-brand-panel";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen min-w-[960px] grid-cols-[1.05fr_1fr] bg-auth-bg">
      <LoginBrandPanel />

      <div className="flex items-center justify-center p-10">
        <LoginForm />
      </div>
    </div>
  );
}
