import { ReactNode } from "react";

interface AccountLayoutProps {
  children: ReactNode;
}

export default function AccountLayout({
  children,
}: AccountLayoutProps) {
  return <>{children}</>;
}