"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTrackOrderUi } from "@/lib/track-order-ui-store";

export default function TrackOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const openTrackOrder = useTrackOrderUi((s) => s.openTrackOrder);
  const opened = useRef(false);

  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    openTrackOrder({
      orderNumber: searchParams.get("orderNumber") || undefined,
      email: searchParams.get("email") || undefined,
    });
    router.replace("/");
  }, [openTrackOrder, router, searchParams]);

  return null;
}
