import { NextResponse } from "next/server";
import { fetchTopWallets } from "@/lib/walletScanner";

export async function GET() {
  try {
    const data = await fetchTopWallets("sol");
    return NextResponse.json(data);
  } catch (error) {
    console.error("API /wallets error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
