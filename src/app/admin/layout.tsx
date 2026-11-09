import type { Metadata } from "next";
import { AdminToaster } from "@/components/admin/admin-toaster";

export const instant = false;

export const metadata: Metadata = {
  title: "Admin — EL PASEO",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <AdminToaster />
    </>
  );
}
