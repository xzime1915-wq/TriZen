"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Printer, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

type InvoiceActionsProps = {
  invoiceNumber: string;
};

export function InvoiceActions({ invoiceNumber }: InvoiceActionsProps) {
  const params = useParams();
  const orderId = params.id as string;
  const [downloading, setDownloading] = useState(false);

  async function downloadPdf() {
    setDownloading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/invoice/pdf`);
      if (!res.ok) throw new Error("PDF generation failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoiceNumber.replace(/[^a-zA-Z0-9-]/g, "")}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Could not download PDF. Please try again or use Print.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="no-print fixed top-4 right-4 flex gap-2 z-50">
      <Link href={`/admin/orders/${orderId}`}>
        <Button variant="secondary" size="sm">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </Link>
      <Button size="sm" variant="secondary" onClick={downloadPdf} disabled={downloading}>
        <Download className="h-4 w-4 mr-1" />
        {downloading ? "Generating..." : "Download PDF"}
      </Button>
      <Button size="sm" onClick={() => window.print()}>
        <Printer className="h-4 w-4 mr-1" /> Print
      </Button>
    </div>
  );
}
