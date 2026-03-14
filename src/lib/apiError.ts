import { NextResponse } from "next/server";

const USER_FACING_PATTERNS = [
  "not found",
  "no google listing",
  "check the spelling",
  "required",
  "missing fields",
  "invalid input",
  "too many requests",
];

export function isUserFacingError(message: string): boolean {
  const lower = message.toLowerCase();
  return USER_FACING_PATTERNS.some((p) => lower.includes(p));
}

export function apiErrorResponse(
  error: unknown,
  context: string,
  status = 500,
): NextResponse {
  const raw = error instanceof Error ? error.message : String(error);
  console.error(`[${context}]`, raw);

  if (isUserFacingError(raw)) {
    return NextResponse.json({ error: raw }, { status: status >= 400 && status < 500 ? status : 400 });
  }

  return NextResponse.json(
    { error: "Something went wrong on our end. Please try again shortly." },
    { status: 500 },
  );
}
