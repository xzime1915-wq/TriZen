import { Suspense } from "react";

export default function TrackOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div className="container-trizen py-20 text-center">Loading...</div>}>{children}</Suspense>;
}
