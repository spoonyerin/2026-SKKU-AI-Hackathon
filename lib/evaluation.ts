import { categoryLabel, standards, type Category, type Standard } from "@/data/criteria";
import type { Evaluation, Result, Status } from "@/lib/types";

function classify(input: string): Category {
  const value = input.toLowerCase();
  if (/대체.?텍스트|alt|접근성|스크린.?리더|키보드|웹페이지|이미지/.test(value)) return "accessibility";
  if (/개인정보|이름|전화번호|회원가입|수집|동의|보유/.test(value)) return "privacy";
  return "advertising";
}
function statusSummary(evaluations: Evaluation[]): Status {
  if (evaluations.some((item) => item.status === "fail")) return "fail";
  if (evaluations.some((item) => item.status === "needs_improvement")) return "needs_improvement";
  if (evaluations.some((item) => item.status === "uncertain")) return "uncertain";
  return "pass";
}
function deterministic(input: string, category: Category, standard: Standard): Evaluation[] {
  const value = input.toLowerCase();
  if (category === "privacy") return [
    { criterionId: "privacy-purpose", status: /목적|서비스|가입|배송/.test(value) ? "pass" : "needs_improvement", finding: /목적|서비스|가입|배송/.test(value) ? "수집 목적이 일부 언급되어 있습니다." : "수집 목적이 구체적으로 제시되지 않았습니다.", evidence: "입력 문구에 이름과 전화번호 수집은 있으나, 이용 목적의 구체적 설명은 확인하기 어렵습니다.", recommendation: "‘회원 식별 및 가입 절차 진행을 위해’처럼 수집 목적을 명확히 작성하세요." },
    { criterionId: "privacy-items", status: /보유|기간|파기/.test(value) ? "pass" : "fail", finding: /보유|기간|파기/.test(value) ? "보유 기간 관련 표현이 확인됩니다." : "보유·이용 기간 안내가 없습니다.", evidence: "입력 문구에서 보유 기간 또는 파기 시점을 찾기 어렵습니다.", recommendation: "수집 항목(이름, 전화번호)과 ‘가입 완료 후 즉시 파기’ 등 보유·이용 기간을 함께 안내하세요." },
    { criterionId: "privacy-choice", status: /동의|필수|선택/.test(value) ? "pass" : "needs_improvement", finding: /동의|필수|선택/.test(value) ? "동의 또는 항목 구분 표현이 확인됩니다." : "동의 방식과 필수·선택 항목 구분이 확인되지 않습니다.", evidence: "입력 문구만으로 정보주체의 선택권 보장 여부를 판단하기 어렵습니다.", recommendation: "필수·선택 항목을 구분하고, 수집·이용 동의 절차를 명확히 표시하세요." }
  ];
  if (category === "accessibility") return [
    { criterionId: "a11y-alt", status: /없|제공하지|미제공/.test(value) ? "fail" : "uncertain", finding: /없|제공하지|미제공/.test(value) ? "의미 있는 이미지의 대체 텍스트 미제공이 언급되었습니다." : "대체 텍스트 제공 여부를 입력만으로 확인하기 어렵습니다.", evidence: "입력 내용에서 이미지에 대한 대체 텍스트가 제공되지 않았다고 설명합니다.", recommendation: "각 정보성 이미지에 목적을 설명하는 alt 텍스트를 제공하세요. 예: alt=\"월별 이용자 수 그래프\"" },
    { criterionId: "a11y-decorative", status: "needs_improvement", finding: "이미지의 정보성·장식성 구분 여부가 확인되지 않습니다.", evidence: "이미지가 많다는 설명만 있어 이미지별 역할을 판단하기 어렵습니다.", recommendation: "장식 이미지는 빈 alt 또는 적절한 방식으로 보조기술에서 제외하고, 정보성 이미지는 설명을 제공하세요." }
  ];
  return [
    { criterionId: "ad-deceptive", status: /완전히|100%|반드시|확실히/.test(value) ? "fail" : "uncertain", finding: /완전히|100%|반드시|확실히/.test(value) ? "‘완전히 사라진다’는 절대적 보장 표현이 확인됩니다." : "표현의 객관적 근거를 입력만으로 확인하기 어렵습니다.", evidence: "입력 문구가 모든 소비자에게 동일한 결과를 보장하는 것처럼 읽힐 수 있습니다.", recommendation: "절대적 결과 보장을 삭제하고, 확인 가능한 사실 범위의 표현으로 바꾸세요." },
    { criterionId: "ad-medical", status: /피로.*사라|치료|예방|효능/.test(value) ? "needs_improvement" : "uncertain", finding: /피로.*사라|치료|예방|효능/.test(value) ? "건강 상태 개선을 확정적으로 암시할 소지가 있습니다." : "질병 예방·치료 효능 표방 여부를 판단하기 어렵습니다.", evidence: "‘피로가 사라진다’는 문구는 제품 특성과 근거에 따라 소비자의 오인을 유발할 수 있습니다.", recommendation: "‘일상 컨디션 관리를 위한 제품’처럼 의학적 효능이나 확정적 결과를 암시하지 않는 문구를 검토하세요." }
  ];
}
export function evaluateFallback(input: string): Result {
  const category = classify(input); const standard = standards.find((item) => item.category === category)!;
  const evaluations = deterministic(input, category, standard); const overallStatus = statusSummary(evaluations);
  const counts = { pass: evaluations.filter((e) => e.status === "pass").length, needs: evaluations.filter((e) => e.status === "needs_improvement").length, fail: evaluations.filter((e) => e.status === "fail").length };
  return { category, categoryReason: `입력에서 ${category === "privacy" ? "개인정보 수집·동의" : category === "accessibility" ? "이미지와 대체 텍스트" : "제품 광고 표현"}에 관한 평가 요청을 확인하여 ${categoryLabel[category]} 분야로 분류했습니다.`, selectedStandards: [{ standard, reason: `입력 주제를 평가할 수 있는 ${standard.authority}의 공개 기준을 적용했습니다.` }], overallStatus, summary: `${evaluations.length}개 항목 중 ${counts.pass}개 충족 / ${counts.needs}개 일부 수정 필요 / ${counts.fail}개 미충족입니다. 제공된 문구만을 기준으로 한 참고용 평가입니다.`, evaluations, mode: "demo" };
}
