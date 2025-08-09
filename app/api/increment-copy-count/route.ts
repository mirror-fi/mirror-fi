import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/index";
import Strategy from "@/lib/database/models/strategy";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const strategy = await Strategy.findByIdAndUpdate(
      id,
      { $inc: { copyCount: 1 } },
      { new: true }
    );
    if (!strategy) {
      return NextResponse.json({ error: "Strategy not found" }, { status: 404 });
    }
    return NextResponse.json({ copyCount: strategy.copyCount });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update copyCount" }, { status: 500 });
  }
}
