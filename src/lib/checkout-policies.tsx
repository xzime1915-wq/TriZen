import type { ReactNode } from "react";

export type CheckoutPolicyId =
  | "refund"
  | "shipping"
  | "privacy"
  | "terms"
  | "contact";

type CheckoutPolicy = {
  label: string;
  title: string;
  content: ReactNode;
};

export const CHECKOUT_POLICIES: Record<CheckoutPolicyId, CheckoutPolicy> = {
  refund: {
    label: "Refund policy",
    title: "Refund Policy",
    content: (
      <>
        <p>
          We want you to be happy with your TRIZEN order. If something is wrong
          with your product, contact us within 7 days of delivery with your order
          number and photos of the issue.
        </p>
        <p>
          Approved refunds are processed to your original payment method or via
          bKash where applicable. Refunds may take 3 to 7 business days after approval.
        </p>
        <p>
          Items must be unused and in original packaging unless the product arrived
          damaged or defective. Custom or opened hygiene-sensitive items may not
          qualify for return.
        </p>
        <p>
          For refund requests, email{" "}
          <a href="mailto:support@trizenstore.com">support@trizenstore.com</a> with
          your order details.
        </p>
      </>
    ),
  },
  shipping: {
    label: "Shipping",
    title: "Shipping",
    content: (
      <>
        <p>
          TRIZEN Store ships nationwide across Bangladesh. Orders are packed within
          1 to 2 business days after payment confirmation.
        </p>
        <p>
          Standard delivery typically takes 2 to 5 business days inside Dhaka and 3 to 7
          business days outside Dhaka, depending on your area and courier
          availability.
        </p>
        <p>
          You will receive order updates by email and SMS where available. Delivery
          charges are shown at checkout before you place your order.
        </p>
        <p>
          For shipping questions, contact{" "}
          <a href="mailto:support@trizenstore.com">support@trizenstore.com</a> or
          call 01778741431.
        </p>
      </>
    ),
  },
  privacy: {
    label: "Privacy policy",
    title: "Privacy Policy",
    content: (
      <>
        <p>
          TRIZEN Store respects your privacy. We collect only the information
          needed to process orders, provide support, and improve our services.
        </p>
        <p>
          Order details, contact information, and payment references are used
          solely for fulfillment and customer service. We do not sell your personal
          data to third parties.
        </p>
        <p>
          We may use cookies and similar technologies to keep your cart and session
          working. Analytics data, if used, is aggregated and does not identify you
          personally.
        </p>
        <p>
          For questions about this policy, contact{" "}
          <a href="mailto:support@trizenstore.com">support@trizenstore.com</a>.
        </p>
      </>
    ),
  },
  terms: {
    label: "Terms of service",
    title: "Terms of Service",
    content: (
      <>
        <p>
          By placing an order on TRIZEN Store, you agree to these terms. Prices and
          availability are subject to change. We reserve the right to cancel orders
          in case of errors or stock issues.
        </p>
        <p>
          Payment must be completed as instructed at checkout. Cash on delivery and
          bKash options are subject to verification. You are responsible for
          providing accurate delivery and contact information.
        </p>
        <p>
          Delivery times vary by location within Bangladesh. Returns and refunds are
          handled according to our refund policy. Contact us before sending items
          back.
        </p>
        <p>
          TRIZEN Store is not liable for delays caused by couriers, weather, or events
          outside our control. Product images are for reference; minor color
          variation may occur.
        </p>
        <p>
          For order or product questions, email{" "}
          <a href="mailto:support@trizenstore.com">support@trizenstore.com</a> or
          call 01778741431.
        </p>
      </>
    ),
  },
  contact: {
    label: "Contact",
    title: "Contact",
    content: (
      <>
        <p>Questions about TRIPAD, orders, or shipping? We are here to help.</p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:support@trizenstore.com">support@trizenstore.com</a>
        </p>
        <p>
          <strong>Phone:</strong>{" "}
          <a href="tel:+8801778741431">01778741431</a>
        </p>
        <p>
          <strong>Location:</strong> Bangladesh, nationwide shipping
        </p>
        <p>
          Support hours: Sunday to Thursday, 10:00 AM to 6:00 PM (BST). We aim to
          reply to emails within 1 to 2 business days.
        </p>
      </>
    ),
  },
};

export const CHECKOUT_POLICY_ORDER: CheckoutPolicyId[] = [
  "refund",
  "shipping",
  "privacy",
  "terms",
  "contact",
];
