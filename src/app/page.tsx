import { CodeWindow } from "@/components/CodeWindow/CodeWindow";
import { InstallTabs } from "@/components/InstallTabs/InstallTabs";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[oklch(0.98_0.01_250)] font-sans text-[oklch(0.15_0.01_250)] selection:bg-[oklch(0.6_0.2_40)] selection:text-[oklch(0.98_0.01_250)]">
      {/* Top Nav/Border */}
      <header className="fixed top-0 z-50 flex w-full items-end justify-between border-b border-[oklch(0.85_0.01_250)] bg-[oklch(0.98_0.01_250)] px-6 py-5 md:px-12">
        <div className="font-mono text-sm font-bold tracking-widest text-[oklch(0.6_0.2_40)] uppercase">
          next-zero-rpc // v0.1.2
        </div>
        <a
          href="https://github.com/caocchinh/next-zero-rpc"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm tracking-widest uppercase transition-colors hover:text-[oklch(0.6_0.2_40)]"
        >
          GitHub ↗
        </a>
      </header>

      <main className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col">
        {/* Hero Section */}
        <section className="grid flex-1 grid-cols-1 border-b border-[oklch(0.85_0.01_250)] lg:grid-cols-12">
          {/* Left Column (Text) */}
          <div className="flex flex-col justify-center border-[oklch(0.85_0.01_250)] p-6 md:p-12 lg:col-span-8 lg:border-r lg:p-20 xl:p-24">
            <div className="mb-12 inline-flex lg:mb-20">
              <span className="bg-[oklch(0.15_0.01_250)] px-3 py-1 font-mono text-xs font-bold tracking-widest text-[oklch(0.98_0.01_250)] uppercase">
                System Active
              </span>
            </div>

            <h1 className="mb-10 text-[clamp(3.5rem,8vw,9rem)] leading-[0.85] font-black tracking-tighter uppercase">
              <span className="block transition-transform duration-500 hover:translate-x-4">
                Type-Safe
              </span>
              <span className="block transition-transform delay-75 duration-500 hover:translate-x-4">
                Fetch.
              </span>
              <span className="block text-[oklch(0.6_0.2_40)] transition-transform delay-150 duration-500 hover:translate-x-4">
                Zero
              </span>
              <span className="block text-[oklch(0.6_0.2_40)] transition-transform delay-200 duration-500 hover:translate-x-4">
                Overhead.
              </span>
            </h1>

            <p className="mb-16 max-w-2xl text-[clamp(1.1rem,2vw,1.5rem)] leading-snug font-medium text-[oklch(0.4_0.01_250)]">
              Four files. Full type safety. Error type narrowing.{" "}
              <span className="text-[oklch(0.15_0.01_250)]">1.8 KB runtime.</span> Stop wrestling
              with complex RPC setups—just use standard Next.js route handlers.
            </p>

            <div className="flex flex-col items-start gap-6 font-mono text-sm font-bold tracking-wider uppercase sm:flex-row">
              <a
                href="#installation"
                className="inline-block bg-[oklch(0.6_0.2_40)] px-10 py-5 text-[oklch(0.98_0.01_250)] transition-colors hover:bg-[oklch(0.15_0.01_250)]"
              >
                [ Initialize ]
              </a>
              <a
                href="https://github.com/caocchinh/next-zero-rpc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-[oklch(0.85_0.01_250)] px-10 py-5 transition-colors hover:bg-[oklch(0.9_0.01_250)]"
              >
                Read Source
              </a>
            </div>
          </div>

          {/* Right Column (Metrics/Stats) */}
          <div className="flex flex-col lg:col-span-4">
            <div className="group flex min-h-[300px] flex-1 flex-col justify-end border-b border-[oklch(0.85_0.01_250)] bg-[oklch(0.95_0.01_250)] p-8 md:p-12 lg:min-h-0 lg:p-16">
              <div className="mb-4 font-mono text-sm tracking-widest text-[oklch(0.6_0.2_40)] uppercase">
                / Runtime Cost
              </div>
              <div className="origin-left text-[clamp(4rem,6vw,7rem)] leading-none font-black tracking-tighter transition-transform group-hover:scale-105">
                1.8 KB
              </div>
            </div>
            <div className="group flex min-h-[300px] flex-1 flex-col justify-end border-b border-[oklch(0.85_0.01_250)] p-8 md:p-12 lg:min-h-0 lg:border-b-0 lg:p-16">
              <div className="mb-4 font-mono text-sm tracking-widest text-[oklch(0.6_0.2_40)] uppercase">
                / Abstractions
              </div>
              <div className="origin-left text-[clamp(4rem,6vw,7rem)] leading-none font-black tracking-tighter transition-transform group-hover:scale-105">
                0.0
              </div>
            </div>
          </div>
        </section>

        {/* Simulator & Code Section */}
        <section className="flex flex-col border-b border-[oklch(0.85_0.01_250)]">
          <div className="flex flex-col border-b border-[oklch(0.85_0.01_250)] p-8 md:p-12 lg:p-16 xl:p-20">
            <div className="mb-8 inline-block">
              <span className="border border-[oklch(0.6_0.2_40)] px-3 py-1 font-mono text-sm font-bold tracking-widest text-[oklch(0.6_0.2_40)] uppercase">
                Simulation
              </span>
            </div>
            <h2 className="mb-8 text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] font-black tracking-tighter uppercase">
              Witness The Magic
            </h2>
            <p className="max-w-2xl text-xl leading-relaxed text-[oklch(0.4_0.01_250)]">
              Hover over the variables in{" "}
              <span className="mx-1 bg-[oklch(0.85_0.01_250)] px-2 py-1 font-mono text-sm text-[oklch(0.15_0.01_250)]">
                client.tsx
              </span>{" "}
              to observe absolute type inference across the network boundary.
            </p>
          </div>

          <div className="relative flex w-full items-center justify-center overflow-hidden bg-[oklch(0.95_0.01_250)] p-4 md:p-12 lg:p-20 xl:p-24">
            {/* Abstract geometric background elements for brutalist feel */}
            <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 border-b border-l border-[oklch(0.85_0.01_250)] opacity-50"></div>
            <div className="pointer-events-none absolute bottom-10 left-10 font-mono text-[10rem] leading-none font-black text-[oklch(0.85_0.01_250)] select-none">
              {"//"}
            </div>

            <div className="relative z-10 w-full border-2 border-[#0a0a0a] bg-[#0a0a0a] shadow-[16px_16px_0_0_oklch(0.6_0.2_40)] transition-transform">
              <CodeWindow />
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="grid grid-cols-1 border-b border-[oklch(0.85_0.01_250)] bg-[oklch(0.95_0.01_250)] md:grid-cols-3">
          <div className="border-b border-[oklch(0.85_0.01_250)] p-8 transition-colors hover:bg-[oklch(0.98_0.01_250)] md:border-r md:border-b-0 md:p-12 lg:p-16">
            <div className="mb-8 font-mono text-6xl font-black tracking-tighter text-[oklch(0.6_0.2_40)] opacity-80 lg:text-8xl">
              01
            </div>
            <h3 className="mb-6 text-2xl leading-tight font-black tracking-tight uppercase lg:text-3xl">
              Error Type
              <br />
              Narrowing
            </h3>
            <p className="text-lg leading-relaxed text-[oklch(0.4_0.01_250)]">
              TypeScript narrows the error union to only the specific error codes your route handler
              can return. Total precision.
            </p>
          </div>

          <div className="border-b border-[oklch(0.85_0.01_250)] p-8 transition-colors hover:bg-[oklch(0.98_0.01_250)] md:border-r md:border-b-0 md:p-12 lg:p-16">
            <div className="mb-8 font-mono text-6xl font-black tracking-tighter text-[oklch(0.6_0.2_40)] opacity-80 lg:text-8xl">
              02
            </div>
            <h3 className="mb-6 text-2xl leading-tight font-black tracking-tight uppercase lg:text-3xl">
              Zero
              <br />
              Boilerplate
            </h3>
            <p className="text-lg leading-relaxed text-[oklch(0.4_0.01_250)]">
              Write standard Next.js API routes using simple response helpers. No decorators, no
              schema registrations, no complex abstractions.
            </p>
          </div>

          <div className="p-8 transition-colors hover:bg-[oklch(0.98_0.01_250)] md:p-12 lg:p-16">
            <div className="mb-8 font-mono text-6xl font-black tracking-tighter text-[oklch(0.6_0.2_40)] opacity-80 lg:text-8xl">
              03
            </div>
            <h3 className="mb-6 text-2xl leading-tight font-black tracking-tight uppercase lg:text-3xl">
              You Own
              <br />
              The Code
            </h3>
            <p className="text-lg leading-relaxed text-[oklch(0.4_0.01_250)]">
              Not a locked-in framework. It&apos;s a philosophy and a paradigm. We give you four
              files, you own them completely. No vendor lock-in.
            </p>
          </div>
        </section>

        {/* Installation */}
        <section id="installation" className="grid grid-cols-1 xl:grid-cols-12">
          <div className="flex flex-col justify-start border-b border-[oklch(0.85_0.01_250)] p-8 md:p-12 lg:p-16 xl:col-span-4 xl:border-r xl:border-b-0 xl:p-20">
            <h2 className="mb-8 text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] font-black tracking-tighter text-[oklch(0.6_0.2_40)] uppercase">
              System
              <br />
              Install
            </h2>
            <p className="text-xl leading-relaxed text-[oklch(0.4_0.01_250)]">
              Execute the deployment sequence. Use the CLI tool or inject manually into your Next.js
              architecture.
            </p>
          </div>

          <div className="flex items-center justify-center p-4 md:p-12 lg:p-20 xl:col-span-8">
            <div className="w-full max-w-6xl">
              <InstallTabs />
            </div>
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
