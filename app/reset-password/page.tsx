import { ResetPasswordForm } from "@/components/login/reset-password-form";
import { Suspense } from "react";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div>Loading reset password form...</div>}>
          <ResetPasswordForm searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
