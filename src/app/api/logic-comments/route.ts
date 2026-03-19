import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const COMMENTS_PATH = path.join(process.cwd(), "logic-comments.json");

type CommentsMap = Record<string, string[]>;

async function readComments(): Promise<CommentsMap> {
  try {
    const data = await fs.readFile(COMMENTS_PATH, "utf-8");
    return JSON.parse(data) as CommentsMap;
  } catch {
    return {};
  }
}

async function writeComments(comments: CommentsMap): Promise<void> {
  await fs.writeFile(COMMENTS_PATH, JSON.stringify(comments, null, 2), "utf-8");
}

export async function GET() {
  try {
    const comments = await readComments();
    return NextResponse.json(comments);
  } catch (err) {
    console.error("[logic-comments] GET error:", err);
    return NextResponse.json({ error: "Failed to read comments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, comment } = body as { code?: string; comment?: string };

    if (!code || typeof code !== "string" || !comment || typeof comment !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid code/comment. Expected { code: string, comment: string }" },
        { status: 400 }
      );
    }

    const codeUpper = code.trim().toUpperCase();
    if (!/^[A-Z][0-9]+$/.test(codeUpper)) {
      return NextResponse.json(
        { error: "Invalid code format. Use 2-char codes like R3, K1, D5" },
        { status: 400 }
      );
    }

    const comments = await readComments();
    const existing = comments[codeUpper] ?? [];
    comments[codeUpper] = [...existing, comment.trim()];
    await writeComments(comments);

    return NextResponse.json(comments);
  } catch (err) {
    console.error("[logic-comments] POST error:", err);
    return NextResponse.json({ error: "Failed to save comment" }, { status: 500 });
  }
}
