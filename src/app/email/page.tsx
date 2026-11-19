import { Suspense } from "react";
import Image from "next/image";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { StolosLogo } from "@/components/layout/StolosLogo";

// The password-reset email, visible at /email as required by the spec.
// Matches Figma screen 1:2123 — 720 × 616 email frame.

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
    <div className="flex w-full max-w-[720px] flex-col items-center gap-6 px-4 py-12 sm:px-[100px]">
      {/* Brand */}
      <div className="flex flex items-center gap-2">
        <StolosLogo className="h-6 w-5" />
        <span className="text-[20px] leading-[24px] font-semibold text-white/90">
          Stolos
        </span>
      </div>

      {/* Card */}
      <div className="relative w-full overflow-hidden rounded-[12px] border border-white/[0.08] bg-black/30 px-6 py-12 shadow-[0_1px_5px_rgba(0,0,0,0.2),0_6px_16px_rgba(0,0,0,0.16)]">
        {/* Watermark */}
        <div
          className="pointer-events-none absolute left-1/2 top-[299px] h-[204px] w-[167px] -translate-x-1/2 opacity-10"
          aria-hidden="true"
        >
          <Image
            src="/assets/stolos-logo-tight.png"
            alt=""
            width={167}
            height={189}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-12">
          <h1 className="text-center text-[24px] leading-[30px] font-semibold text-white">
            Réinitialisez votre mot de passe
          </h1>

          {/* CTA */}
          <a
            href={resetUrl}
            className="inline-flex items-center justify-center rounded-[4px] bg-[#5e4fb0] px-4 py-3 text-center text-[16px] leading-[20px] font-normal text-white/90 transition-colors hover:bg-[#6c5dbf]"
          >
            Choisir un nouveau mot de passe
          </a>

          {/* Body */}
          <div className="flex w-full max-w-[470px] flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-center text-[16px] leading-[24px] font-normal text-white/60">
                Nous avons reçu une demande de réinitialisation du mot de passe
                de votre compte Stolos. Ce lien expire dans une heure.
              </p>
              <p className="text-center text-[14px] leading-[20px] font-normal text-white/40">
                Si vous n&apos;êtes pas à l&apos;origine de cette demande, vous
                pouvez ignorer ce message : votre mot de passe reste inchangé.
              </p>
            </div>

            <div className="text-center text-[12px] leading-[18px] font-normal">
              <p className="text-white/30">
                Ou copiez ce lien dans votre navigateur :
              </p>
              <a
                href={resetUrl}
                className="break-all text-white/50 underline transition-colors hover:text-white/70"
              >
                {resetUrl}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Automated message footer */}
      <p className="text-center text-[14px] leading-[20px] font-normal text-white/40">
        Ceci est un message automatique de{" "}
        <span className="underline">Histia</span>. Merci de ne pas y répondre.
      </p>
    </div>
  );
}

export default function EmailPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[linear-gradient(180deg,#4b408c_0%,#272149_50%,#17132a_100%)]">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center text-white/40">
            Chargement...
          </div>
        }
      >
        <EmailContent />
      </Suspense>
    </main>
  );
}