import { getAppUrl } from "@/lib/env";

type BkashConfig = {
  username: string;
  password: string;
  appKey: string;
  appSecret: string;
  baseUrl: string;
  callbackUrl: string;
};

type GrantTokenResponse = {
  id_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  statusMessage?: string;
};

type CreatePaymentResponse = {
  paymentID?: string;
  bkashURL?: string;
  statusMessage?: string;
  statusCode?: string;
};

type ExecutePaymentResponse = {
  paymentID?: string;
  trxID?: string;
  transactionStatus?: string;
  merchantInvoiceNumber?: string;
  statusMessage?: string;
  statusCode?: string;
};

let cachedToken: { token: string; expiresAt: number } | null = null;

export function getBkashConfig(): BkashConfig | null {
  const username = process.env.BKASH_USERNAME?.trim();
  const password = process.env.BKASH_PASSWORD?.trim();
  const appKey = process.env.BKASH_APP_KEY?.trim();
  const appSecret = process.env.BKASH_APP_SECRET?.trim();

  if (!username || !password || !appKey || !appSecret) return null;

  const baseUrl = (
    process.env.BKASH_BASE_URL?.trim() ||
    "https://tokenized.pay.bka.sh/v1.2.0-beta"
  ).replace(/\/$/, "");

  const callbackUrl =
    process.env.BKASH_CALLBACK_URL?.trim() ||
    `${getAppUrl()}/api/payments/bkash/callback`;

  return { username, password, appKey, appSecret, baseUrl, callbackUrl };
}

export function isBkashConfigured() {
  return getBkashConfig() !== null;
}

async function grantToken(config: BkashConfig): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.token;
  }

  const res = await fetch(`${config.baseUrl}/tokenized/checkout/token/grant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      username: config.username,
      password: config.password,
    },
    body: JSON.stringify({
      app_key: config.appKey,
      app_secret: config.appSecret,
    }),
    cache: "no-store",
  });

  const data = (await res.json()) as GrantTokenResponse;
  if (!res.ok || !data.id_token) {
    throw new Error(data.statusMessage || "bKash token grant failed");
  }

  cachedToken = {
    token: data.id_token,
    expiresAt: now + (data.expires_in ?? 3600) * 1000,
  };

  return data.id_token;
}

async function bkashRequest<T>(
  config: BkashConfig,
  path: string,
  body: Record<string, unknown>
): Promise<T> {
  const token = await grantToken(config);
  const res = await fetch(`${config.baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      authorization: token,
      "x app key": config.appKey,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = (await res.json()) as T & { statusMessage?: string };
  if (!res.ok) {
    throw new Error(data.statusMessage || "bKash request failed");
  }
  return data;
}

export function formatBkashAmount(amount: number) {
  return amount.toFixed(2);
}

export async function createBkashPayment(input: {
  amount: number;
  orderNumber: string;
  payerReference?: string;
}) {
  const config = getBkashConfig();
  if (!config) {
    throw new Error("bKash is not configured on the server.");
  }

  const data = await bkashRequest<CreatePaymentResponse>(
    config,
    "/tokenized/checkout/create",
    {
      mode: "0011",
      payerReference: input.payerReference?.trim() || input.orderNumber,
      callbackURL: config.callbackUrl,
      amount: formatBkashAmount(input.amount),
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: input.orderNumber,
    }
  );

  if (!data.paymentID || !data.bkashURL) {
    throw new Error(data.statusMessage || "bKash payment creation failed");
  }

  return { paymentID: data.paymentID, bkashURL: data.bkashURL };
}

export async function executeBkashPayment(paymentID: string) {
  const config = getBkashConfig();
  if (!config) {
    throw new Error("bKash is not configured on the server.");
  }

  return bkashRequest<ExecutePaymentResponse>(
    config,
    "/tokenized/checkout/execute",
    { paymentID }
  );
}
