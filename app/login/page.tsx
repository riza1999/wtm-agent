import { Footer } from "@/components/footer/footer";
import { LoginForm } from "@/components/login/login-form";

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center p-6">
        <LoginForm callbackUrl={callbackUrl} />
      </main>
      <Footer />
    </div>
  );
}
