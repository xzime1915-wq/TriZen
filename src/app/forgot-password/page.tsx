import { Suspense } from "react";
import { AuthLoginVisual } from "@/components/auth/AuthLoginVisual";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="auth-wallhack-page">
      <div className="auth-wallhack-visual" aria-hidden>
        <AuthLoginVisual />
      </div>

      <div className="auth-wallhack-panel">
        <Suspense
          fallback={
            <div className="auth-wallhack-form">
              <p className="auth-wallhack-intro">Loading...</p>
            </div>
          }
        >
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
