import { Footer } from "@/components/footer/footer";
import { LoginForm } from "@/components/login/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center p-6">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
}
