import type { Category, Standard } from "@/data/criteria";
export type Status = "pass" | "needs_improvement" | "fail" | "uncertain";
export type Evaluation = { criterionId: string; status: Status; finding: string; evidence: string; recommendation: string };
export type Result = { category: Category; categoryReason: string; selectedStandards: { standard: Standard; reason: string }[]; overallStatus: Status; summary: string; evaluations: Evaluation[]; mode: "ai" | "demo" };
