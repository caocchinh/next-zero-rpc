import { CodeWindow } from "@/components/CodeWindow/CodeWindow";
import { Logo } from "@/components/Logo";
import { QuickStartCommand } from "@/components/QuickStartCommand";
import Link from "next/link";
import { InstallSteps } from "./docs/InstallSteps";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[oklch(0.98_0.01_250)] font-sans text-[oklch(0.15_0.01_250)] selection:bg-[oklch(0.6_0.2_40)] selection:text-[oklch(0.98_0.01_250)]">
      {/* Top Nav/Border */}
      <header className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-[oklch(0.85_0.01_250)] bg-[oklch(0.98_0.01_250)] px-6 py-5 md:px-12">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-auto text-[oklch(0.6_0.2_40)]" />
          <div className="font-mono text-sm font-bold tracking-widest text-[oklch(0.6_0.2_40)] uppercase">
            next-zero-rpc // v0.2.1
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/docs"
            className="font-mono text-sm tracking-widest uppercase transition-colors hover:text-[oklch(0.6_0.2_40)]"
          >
            Docs
          </Link>
          <a
            href="https://www.npmjs.com/package/next-zero-rpc"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm tracking-widest uppercase transition-colors hover:text-[oklch(0.5_0.22_25)]"
          >
            npm ↗
          </a>
          <a
            href="https://github.com/caocchinh/next-zero-rpc"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm tracking-widest uppercase transition-colors hover:text-[oklch(0.6_0.2_40)]"
          >
            GitHub ↗
          </a>
        </div>
      </header>

      <main className="mx-auto mt-5 flex w-full max-w-[1800px] flex-1 flex-col">
        {/* Simulator & Code Section */}
        <section className="flex flex-col border-b border-[oklch(0.85_0.01_250)]">
          <div className="flex flex-col border-b border-[oklch(0.85_0.01_250)] p-8 md:p-12 lg:p-16 xl:p-20">
            <h2 className="mb-8 text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] font-black tracking-tighter uppercase">
              Witness The Magic
            </h2>
            <p className="mb-8 max-w-2xl text-xl leading-relaxed text-[oklch(0.4_0.01_250)]">
              Hover over the variables in{" "}
              <span className="mx-1 bg-[oklch(0.85_0.01_250)] px-2 py-1 font-mono text-sm text-[oklch(0.15_0.01_250)]">
                client.ts
              </span>{" "}
              to observe absolute type inference across the network boundary.
            </p>
            <div className="w-full max-w-xl">
              <QuickStartCommand />
            </div>
          </div>

          <div className="relative flex w-full items-center justify-center overflow-hidden bg-[oklch(0.95_0.01_250)] p-4 md:p-12 lg:p-20 xl:p-24">
            {/* Abstract geometric background elements for brutalist feel */}
            <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 border-b border-l border-[oklch(0.85_0.01_250)] opacity-50"></div>
            <div className="pointer-events-none absolute bottom-10 left-10 font-mono text-[10rem] leading-none font-black text-[oklch(0.85_0.01_250)] select-none">
              {"//"}
            </div>

            <div className="relative z-10 w-full rounded-xl bg-transparent shadow-[16px_16px_0_0_oklch(0.6_0.2_40)]">
              <CodeWindow />
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="border-b border-[oklch(0.85_0.01_250)] bg-[oklch(0.6_0.2_40)] p-8 text-[oklch(0.98_0.01_250)] md:p-12 lg:p-16 xl:p-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] font-black tracking-tighter uppercase">
              The Philosophy
            </h2>
            <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
              <div>
                <h3 className="mb-4 font-mono text-xl font-bold tracking-widest text-[oklch(0.9_0.1_40)] uppercase">
                  You Own The Code
                </h3>
                <p className="text-lg leading-relaxed opacity-90">
                  next-zero-rpc is not a black-box framework—it&apos;s a paradigm. When you run
                  init, we drop four files into your project. From that moment on, they are yours to
                  modify, extend, or delete. Zero vendor lock-in.
                </p>
              </div>
              <div>
                <h3 className="mb-4 font-mono text-xl font-bold tracking-widest text-[oklch(0.9_0.1_40)] uppercase">
                  Architectural Freedom
                </h3>
                <p className="text-lg leading-relaxed opacity-90">
                  Because we don&apos;t take over your Next.js server, you are free to mix and match
                  architectures. Need Server-Sent Events (SSE), WebSockets, or GraphQL alongside it?
                  Go ahead. Study our generated files to verify this—there is no hidden framework
                  magic.
                </p>
              </div>
              <div>
                <h3 className="mb-4 font-mono text-xl font-bold tracking-widest text-[oklch(0.9_0.1_40)] uppercase">
                  Zero Boilerplate
                </h3>
                <p className="text-lg leading-relaxed opacity-90">
                  You write standard Next.js API route handlers. No decorators, no schema
                  registrations, no complex abstractions. The codegen reads what already exists and
                  builds the type bridge automatically.
                </p>
              </div>
              <div>
                <h3 className="mb-4 font-mono text-xl font-bold tracking-widest text-[oklch(0.9_0.1_40)] uppercase">
                  Validation Is Yours
                </h3>
                <p className="text-lg leading-relaxed opacity-90">
                  Input validation stays inside your route handler where it belongs. This library
                  doesn&apos;t impose a validation layer—that&apos;s a deliberate design choice to
                  keep things non-invasive.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Installation */}
        <section
          id="installation"
          className="border-b border-[oklch(0.85_0.01_250)] p-8 md:p-12 lg:p-16 xl:p-20"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
            <div className="border-b border-[oklch(0.85_0.01_250)] pb-6">
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] font-black tracking-tighter text-[oklch(0.6_0.2_40)] uppercase">
                Installation
              </h2>
              <p className="mt-4 text-xl text-[oklch(0.4_0.01_250)]">
                Deploy the type-safe bridge into your architecture.
              </p>
            </div>
            <InstallSteps />
          </div>
        </section>
      </main>

      <footer className="flex flex-col items-center justify-between gap-4 border-t border-[oklch(0.85_0.01_250)] p-6 font-mono text-sm tracking-widest text-[oklch(0.55_0.01_250)] uppercase md:flex-row md:p-12">
        <p>Built with precision for the Next.js App Router.</p>
        <p>MIT License &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
