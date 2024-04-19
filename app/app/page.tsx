import Main from "@/components/Main";
import Image from "next/image";
import { Suspense } from "react";
import Head from "next/head";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="font-mono text-sm">
        <Suspense>
          <Main />
        </Suspense>
      </div>
    </main>
  );
}
