import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getUsage } from "@/lib/usageLimit";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.email;

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const usage = await getUsage(userId);
  return NextResponse.json(usage);
}
