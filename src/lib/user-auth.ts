import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { getOAuthOrigin } from "./env";
import { useSecureCookies } from "./auth";

const COOKIE = "trizen_user_session";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function createUserSession(userId: string) {
  const token = await new SignJWT({ sub: userId, role: "user" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(getSecret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: useSecureCookies(),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroyUserSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getUserSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "user") return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.sub as string },
      select: { id: true, email: true, name: true, image: true, provider: true },
    });
    return user;
  } catch {
    return null;
  }
}

export async function registerUser(data: {
  email: string;
  password: string;
  name: string;
}) {
  const email = data.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "An account with this email already exists" };

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      name: data.name.trim(),
      passwordHash,
      provider: "credentials",
    },
    select: { id: true, email: true, name: true },
  });

  await createUserSession(user.id);
  return { user };
}

export async function verifyUserLogin(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user?.passwordHash) {
    return {
      error:
        user?.provider === "google"
          ? "This account uses Google sign-in. Please continue with Google."
          : "Invalid email or password",
    };
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { error: "Invalid email or password" };

  await createUserSession(user.id);
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}

export async function findOrCreateGoogleUser(profile: {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}) {
  const email = profile.email.trim().toLowerCase();
  let user = await prisma.user.findFirst({
    where: { OR: [{ googleId: profile.sub }, { email }] },
  });

  if (user) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        googleId: profile.sub,
        provider: "google",
        name: user.name || profile.name || null,
        image: profile.picture || user.image,
      },
    });
  } else {
    user = await prisma.user.create({
      data: {
        email,
        googleId: profile.sub,
        name: profile.name || null,
        image: profile.picture || null,
        provider: "google",
      },
    });
  }

  await createUserSession(user.id);
  return user;
}

export function createGoogleOAuthState() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function getGoogleAuthUrl(origin: string, state: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error("GOOGLE_CLIENT_ID is not set");

  const base = getOAuthOrigin(origin);
  const redirectUri = `${base}/api/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}
