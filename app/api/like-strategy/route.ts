import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/index";
import Strategy from "@/lib/database/models/strategy";
import User from "@/lib/database/models/user";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { id, increment, publicAddress } = await req.json();
    if (!id || typeof increment !== "number" || !publicAddress) {
      return NextResponse.json({ error: "Missing id, increment, or publicAddress" }, { status: 400 });
    }
    // Find or create user
    let user = await User.findOne({ publicAddress });
    if (!user) {
      user = await User.create({ publicAddress, likes: [] });
    }
    // Like
    if (increment === 1) {
      if (user.likes.includes(id)) {
        return NextResponse.json({ error: "Already liked" }, { status: 400 });
      }
      user.likes.push(id);
      await user.save();
      const strategy = await Strategy.findByIdAndUpdate(
        id,
        { $inc: { likeCount: 1 } },
        { new: true }
      );
      return NextResponse.json({ likeCount: strategy?.likeCount ?? 0 });
    }
    // Unlike
    if (increment === -1) {
      if (!user.likes.includes(id)) {
        return NextResponse.json({ error: "Not liked yet" }, { status: 400 });
      }
      user.likes = user.likes.filter((sid: string) => sid !== id);
      await user.save();
      const strategy = await Strategy.findByIdAndUpdate(
        id,
        { $inc: { likeCount: -1 } },
        { new: true }
      );
      return NextResponse.json({ likeCount: strategy?.likeCount ?? 0 });
    }
    return NextResponse.json({ error: "Invalid increment value" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update likeCount" }, { status: 500 });
  }
}
