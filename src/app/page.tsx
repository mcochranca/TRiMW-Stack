'use client';

import DitherCanvas from '@/components/DitherDemo/DitherCanvas';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-4">TRiMW Stack</h1>
        <p className="text-lg mb-8">Three.js + React + MongoDB + Wasm</p>
      </div>

      <div className="w-full max-w-5xl">
        <DitherCanvas />
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Collaborative 3D Scene</h2>
        <p className="text-gray-600">
          Real-time collaboration powered by Yjs and WebRTC
        </p>
      </div>
    </main>
  );
}