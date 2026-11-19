import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

// The password-reset email, visible at /email as required by the spec.
// This page lives outside [lang] since it simulates an email client.

async function EmailContent() {
  await connection();

  // Get the latest password reset link
  const latestReset = await prisma.devMail.findFirst({
    where: { kind: "PASSWORD_RESET" },
    orderBy: { createdAt: "desc" },
  });

  const resetUrl = latestReset?.content ?? "#";
  const recipientEmail = latestReset?.to ?? "user@example.com";

  return (
    <div className="mx-auto flex min-h-screen items-center justify-center p-8">
      <div
        className="w-full max-w-[32rem] overflow-hidden rounded-l"
        style={{ background: "linear-gradient(180deg, #1e1a3a 0%, #2d2654 100%)" }}
      >
        {/* Header with logo */}
        <div className="flex flex-col items-center gap-4 px-8 pt-10 pb-6">
          <div className="flex items-center gap-2">
            <svg
              className="h-8 w-8"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32 24c-5.523 0-10 4.477-10 10s4.477 10 10 10"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="32" cy="34" r="3" fill="white" />
            </svg>
            <span className="text-sm font-semibold text-white">Stolos</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-6 px-8 pb-10">
          <h1 className="text-center text-m font-semibold text-white">
            Réinitialisez votre mot de passe
          </h1>

          {/* CTA Button */}
          <a
            href={resetUrl}
            className="inline-block w-full rounded-md bg-primary-400 px-8 py-3 text-center text-s font-medium text-white transition-colors hover:bg-primary-300"
          >
            Choisir un nouveau mot de passe
          </a>

          {/* Body text */}
          <div className="flex flex-col gap-4 text-sx leading-relaxed text-white/70">
            <p>
              Nous avons reçu une demande de réinitialisation du mot de passe de
              votre compte Stolos. Ce lien expire dans une heure.
            </p>
            <p>
              Si vous n&apos;êtes pas à l&apos;origine de cette demande, vous
              pouvez ignorer ce message : votre mot de passe reste inchangé.
            </p>
          </div>

          {/* Raw URL */}
          <div className="w-full rounded-sm bg-black/20 px-4 py-3">
            <p className="text-xs text-white/40">
              Ou copiez ce lien dans votre navigateur :
            </p>
            <p className="mt-1 break-all text-xs text-primary">
              {resetUrl}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-8 py-4">
          <p className="text-center text-xs text-white/40">
            Ceci est un message automatique de{" "}
            <span className="text-primary">Histia</span>. Merci de ne pas y
            répondre.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-white/60">Chargement…</p>
        </div>
      }
    >
      <EmailContent />
    </Suspense>
  );
}
