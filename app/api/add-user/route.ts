import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/index";
import User from "@/lib/database/models/user";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { publicAddress } = await req.json();
    if (!publicAddress) {
      return NextResponse.json({ error: "Missing publicAddress" }, { status: 400 });
    }
    let user = await User.findOne({ publicAddress });
    if (!user) {
      user = await User.create({ publicAddress, likes: [] });
    }
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}
