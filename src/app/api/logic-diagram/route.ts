import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const MMD_PATH = path.join(process.cwd(), "miro-logic-flow.mmd");

export async function GET() {
  try {
    const content = await fs.readFile(MMD_PATH, "utf-8");
    return new NextResponse(content, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err) {
    console.error("[logic-diagram] GET error:", err);
    return NextResponse.json({ error: "Diagram not found" }, { status: 404 });
  }
}
