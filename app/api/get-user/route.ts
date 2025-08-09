import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/index";
import User from "@/lib/database/models/user";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url!);
    const publicAddress = searchParams.get("publicAddress");
    if (!publicAddress) {
      return NextResponse.json({ error: "Missing publicAddress" }, { status: 400 });
    }
    const user = await User.findOne({ publicAddress });
    if (!user) {
      return NextResponse.json({ likes: [] });
    }
    return NextResponse.json({ likes: user.likes });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
