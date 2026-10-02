import { standards, type Category } from "@/data/criteria";
import { evaluateFallback } from "@/lib/evaluation";
import type { Evaluation, Result, Status } from "@/lib/types";

const validStatuses: Status[] = ["pass", "needs_improvement", "fail", "uncertain"];
async function ask(messages: { role: "system" | "user"; content: string }[]) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4.1-mini", messages, response_format: { type: "json_object" }, temperature: 0.2 }) });
  if (!response.ok) throw new Error("AI 요청에 실패했습니다.");
  const data = await response.json(); return JSON.parse(data.choices[0].message.content);
}
export async function evaluateWithAi(input: string): Promise<Result> {
  if (!process.env.OPENAI_API_KEY) return evaluateFallback(input);
  try {
    const catalog = standards.map(({ id, category, title, description }) => ({ id, category, title, description }));
    const analysis = await ask([{ role: "system", content: "You classify Korean evaluation requests. Return JSON only: {category: privacy|accessibility|advertising, category_reason: Korean string, standard_id: one supplied ID, reason: Korean string}. Select exactly one supplied standard. Never invent a source or rule." }, { role: "user", content: `User input:\n${input}\n\nStandards:\n${JSON.stringify(catalog)}` }]);
    const standard = standards.find((item) => item.id === analysis.standard_id && item.category === analysis.category);
    if (!standard) return evaluateFallback(input);
    const assessment = await ask([{ role: "system", content: "Evaluate only against provided criteria. Return JSON only: {overall_status: pass|needs_improvement|fail|uncertain, summary: Korean string, evaluations: [{criterion_id,status,finding,evidence,recommendation}]}. One evaluation per supplied criterion. Do not state unsupported legal facts. If evidence is insufficient use uncertain." }, { role: "user", content: `User input:\n${input}\n\nCategory: ${analysis.category}\nOfficial standard data:\n${JSON.stringify(standard)}` }]);
    const evaluations: Evaluation[] = standard.criteria.map((criterion) => {
      const item = assessment.evaluations?.find((value: { criterion_id: string }) => value.criterion_id === criterion.id);
      return { criterionId: criterion.id, status: validStatuses.includes(item?.status) ? item.status : "uncertain", finding: item?.finding || "판단하기 어려움", evidence: item?.evidence || "제공된 입력만으로 확인하기 어렵습니다.", recommendation: item?.recommendation || "관련 내용을 구체적으로 확인하세요." };
    });
    return { category: analysis.category as Category, categoryReason: analysis.category_reason || "입력 주제에 따라 분류했습니다.", selectedStandards: [{ standard, reason: analysis.reason || "입력 주제와 직접 관련된 공식 기준입니다." }], overallStatus: validStatuses.includes(assessment.overall_status) ? assessment.overall_status : "uncertain", summary: assessment.summary || "제공된 기준에 따른 참고용 평가입니다.", evaluations, mode: "ai" };
  } catch { return evaluateFallback(input); }
}
