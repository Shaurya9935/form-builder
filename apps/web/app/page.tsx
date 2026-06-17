"use client"

import { trpc } from "~/trpc/client";

export default function Home() {
 const { data } = trpc.chaicode.useQuery({email: 'p@e.com', name: 'Shaurya', age: 20})
  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <h2>Server Message: {data?.message}</h2>
      </div>
    </main>
  );
}
