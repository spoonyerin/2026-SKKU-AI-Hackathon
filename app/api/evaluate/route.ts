import { evaluateWithAi } from "@/lib/ai";
export async function POST(request: Request) {
  try { const { input } = await request.json(); if (typeof input !== "string" || input.trim().length < 5) return Response.json({ error: "평가할 내용을 5자 이상 입력해주세요." }, { status: 400 }); return Response.json(await evaluateWithAi(input.trim())); }
  catch { return Response.json({ error: "평가를 준비하는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." }, { status: 500 }); }
}
