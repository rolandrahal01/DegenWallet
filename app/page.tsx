// app/page.tsx
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-fuchsia-900">
      <h1 className="text-5xl font-bold mb-6 text-white text-center drop-shadow-xl">
        DegenWallet AI
      </h1>
      <p className="text-xl text-gray-200 mb-8 max-w-xl text-center">
        Real-time memecoin wallet tracking, alpha signal detection, and instant degen trading tips. Learn from the best—copy, snipe, win!
      </p>
      <button
        className="px-8 py-4 text-lg rounded-2xl shadow-lg bg-gradient-to-r from-pink-600 to-purple-700 text-white transition hover:scale-105 hover:bg-pink-700"
        disabled
      >
        Connect Wallet (soon)
      </button>
    </main>
  );
}
