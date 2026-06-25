import { CodeWindow } from "@/components/CodeWindow";
import { InstallTabs } from "@/components/InstallTabs";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-black text-white selection:bg-zinc-800 font-sans overflow-x-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 z-[-1] h-screen w-screen bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <main className="flex-1 flex flex-col items-center pt-24 pb-16 px-6 sm:px-12 z-10 w-full max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center mb-24 max-w-4xl">
          <a
            href="https://github.com/caocchinh/next-zero-rpc"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-8 inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-300 backdrop-blur-md transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            v0.1.0 is now available
          </a>

          <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 sm:text-7xl mb-6 leading-tight">
            Type-safe fetch for Next.js
            <br />
            with <span className="text-white">Zero Overhead</span>
          </h1>
          
          <p className="text-lg text-zinc-400 sm:text-xl max-w-2xl mb-10 leading-relaxed">
            Four files. Full type safety. Error type narrowing. 1.8 KB runtime.
            Stop wrestling with complex RPC setups—just use standard Next.js route handlers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto justify-center">
            <a
              href="#installation"
              className="px-8 py-3 rounded-md bg-white text-black font-medium hover:bg-zinc-200 transition-colors w-full sm:w-auto"
            >
              Get Started
            </a>
            <a
              href="https://github.com/caocchinh/next-zero-rpc"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-md border border-zinc-700 bg-zinc-900/50 text-white font-medium hover:bg-zinc-800 transition-colors w-full sm:w-auto backdrop-blur-md"
            >
              GitHub
            </a>
          </div>
        </section>

        {/* VSCode Simulator / Core Hook */}
        <section className="w-full max-w-5xl mb-32 relative">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 blur-2xl opacity-50"></div>
          <div className="relative">
             <CodeWindow />
          </div>
          <p className="text-center mt-6 text-sm text-zinc-500 font-medium tracking-wide uppercase">
            Hover over the variables in client.tsx to see the magic
          </p>
        </section>

        {/* Feature Highlights */}
        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          <div className="flex flex-col gap-3 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Error Type Narrowing</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
              TypeScript narrows the error union to only the specific error codes your route handler can return.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Zero Code Changes</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
              Write standard Next.js API routes—no decorators, no schema registrations, no new abstractions.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">1.8 KB Runtime</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
              Extremely lightweight. Only a small fetch wrapper ships to the browser. Zero runtime validation cost.
            </p>
          </div>
        </section>

        {/* Installation */}
        <section id="installation" className="w-full flex flex-col items-center mb-24">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">Installation</h2>
          <p className="text-zinc-400 text-center max-w-xl mb-10">
            Get type-safe fetches in your Next.js project in seconds. Use the CLI tool or install it manually.
          </p>
          <div className="w-full">
            <InstallTabs />
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-zinc-900 py-8 flex flex-col items-center">
        <p className="text-zinc-500 text-sm">
          Built with precision for Next.js App Router.
        </p>
      </footer>
    </div>
  );
}
