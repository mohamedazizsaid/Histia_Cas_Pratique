import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { StolosIconMinimal } from "@/components/layout/StolosLogo";

// The password-reset email, visible at /email as required by the spec.
// Matches Figma Image 1 exactly.

async function EmailContent() {
  await connection();

  let resetUrl = "https://app.example.com/reset-password?token=preview";
  try {
    const latestReset = await prisma.devMail.findFirst({
      where: { kind: "PASSWORD_RESET" },
      orderBy: { createdAt: "desc" },
    });
    if (latestReset?.content) {
      resetUrl = latestReset.content;
    }
  } catch {
    // Fallback if DB is offline
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Header with Stolos logo and text matching Image 1 */}
      <div className="mb-6 flex items-center gap-2">
        <StolosIconMinimal className="size-6 text-white" />
        <span className="text-base font-semibold tracking-tight text-white">
          Stolos
        </span>
      </div>

      {/* Main Email Card */}
      <div className="relative w-full max-w-[460px] overflow-hidden rounded-2xl border border-white/10 bg-[#161327] p-8 shadow-2xl">
        {/* Background watermark Stolos mark */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center opacity-[0.04]"
          aria-hidden="true"
        >
          <StolosIconMinimal className="size-64" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <h1 className="mb-6 text-center text-[19px] font-semibold text-white">
            Réinitialisez votre mot de passe
          </h1>

          {/* Centered CTA button matching Image 1 */}
          <a
            href={resetUrl}
            className="mb-8 inline-flex items-center justify-center rounded-lg bg-[#5e4fb0] px-6 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#6c5dbf]"
          >
            Choisir un nouveau mot de passe
          </a>

          {/* Body text paragraphs */}
          <div className="mb-6 w-full max-w-[360px] space-y-3 text-center text-xs leading-relaxed text-white/60">
            <p>
              Nous avons reçu une demande de réinitialisation du mot de passe de
              votre compte Stolos. Ce lien expire dans une heure.
            </p>
            <p>
              Si vous n&apos;êtes pas à l&apos;origine de cette demande, vous
              pouvez ignorer ce message : votre mot de passe reste inchangé.
            </p>
          </div>

          {/* Direct link instructions */}
          <div className="w-full max-w-[360px] text-center">
            <p className="text-xs text-white/40">
              Ou copiez ce lien dans votre navigateur :
            </p>
            <a
              href={resetUrl}
              className="mt-1 block break-all text-xs text-white/50 underline transition-colors hover:text-white/70"
            >
              {resetUrl}
            </a>
          </div>
        </div>
      </div>

      {/* Automated message footer outside card matching Image 1 */}
      <p className="mt-6 text-center text-xs text-white/40">
        Ceci est un message automatique de{" "}
        <span className="underline">Histia</span>. Merci de ne pas y répondre.
      </p>
    </div>
  );
}

export default function EmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-white/40">
          Chargement...
        </div>
      }
    >
      <EmailContent />
    </Suspense>
  );
}
