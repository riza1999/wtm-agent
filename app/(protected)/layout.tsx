import { Footer } from "@/components/footer/footer";
import { Header } from "@/components/header/header";
import React from "react";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="@container/main mx-auto mb-4 w-full max-w-7xl flex-1 overflow-x-hidden px-6 pt-30 transition-all duration-300">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
