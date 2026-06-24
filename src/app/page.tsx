import TestApi from "@/components/TestApi";
import { TestApiExtreme } from "@/components/TestApiExtreme";

export default function Home() {
  return (
    <div className="flex h-max flex-1 flex-col items-center justify-center bg-zinc-50 p-8 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col gap-8 rounded-xl bg-white p-8 shadow-xl dark:border dark:border-white/10 dark:bg-black">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50">
            Next Zero RPC Extreme Mode
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Witness the true power of recursive TS inference
          </p>
        </div>
        <TestApi />
        <TestApiExtreme />
      </main>
    </div>
  );
}
