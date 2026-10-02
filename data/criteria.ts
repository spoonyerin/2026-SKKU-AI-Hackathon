export type Category = "privacy" | "accessibility" | "advertising";
export type Criterion = { id: string; title: string; description: string; evaluationPoint: string };
export type Standard = { id: string; category: Category; title: string; description: string; authority: string; sourceUrl: string; criteria: Criterion[] };

export const standards: Standard[] = [
  {
    id: "privacy-pipa-collection", category: "privacy", title: "개인정보 수집·이용 동의 기준",
    description: "개인정보 수집·이용 시 정보주체에게 알려야 할 사항과 동의 원칙을 확인합니다.", authority: "국가법령정보센터 · 개인정보 보호법",
    sourceUrl: "https://www.law.go.kr/법령/개인정보보호법",
    criteria: [
      { id: "privacy-purpose", title: "수집 목적 고지", description: "수집·이용 목적을 정보주체에게 알려야 합니다.", evaluationPoint: "이름·전화번호를 왜 수집하는지 구체적으로 안내하는지 확인" },
      { id: "privacy-items", title: "수집 항목과 보유 기간 고지", description: "수집 항목, 보유·이용 기간 등 필요한 사항을 알려야 합니다.", evaluationPoint: "수집 항목과 보유 기간이 명확한지 확인" },
      { id: "privacy-choice", title: "동의와 선택권", description: "필요한 경우 동의를 받고, 선택 항목은 구분하여 안내합니다.", evaluationPoint: "동의 방식과 필수·선택 항목 구분이 있는지 확인" }
    ]
  },
  {
    id: "accessibility-wcag-nontext", category: "accessibility", title: "WCAG 2.2 비텍스트 콘텐츠",
    description: "텍스트가 아닌 콘텐츠에는 동등한 목적을 제공하는 텍스트 대체 수단이 필요합니다.", authority: "W3C · Web Content Accessibility Guidelines (WCAG) 2.2",
    sourceUrl: "https://www.w3.org/TR/WCAG22/#non-text-content",
    criteria: [
      { id: "a11y-alt", title: "대체 텍스트 제공", description: "의미가 있는 이미지에는 목적을 설명하는 텍스트 대체 수단을 제공합니다.", evaluationPoint: "이미지의 정보·기능을 전달하는 alt 텍스트가 있는지 확인" },
      { id: "a11y-decorative", title: "장식 이미지 처리", description: "순수 장식용 비텍스트 콘텐츠는 보조기술이 무시할 수 있도록 처리합니다.", evaluationPoint: "장식 이미지와 정보성 이미지를 구분했는지 확인" }
    ]
  },
  {
    id: "advertising-food-labeling", category: "advertising", title: "식품 등의 표시·광고 기준",
    description: "식품 등의 표시·광고에서 질병 예방·치료 효능을 표방하거나 소비자를 기만하는 표현을 피해야 합니다.", authority: "국가법령정보센터 · 식품 등의 표시·광고에 관한 법률",
    sourceUrl: "https://www.law.go.kr/법령/식품등의표시ㆍ광고에관한법률",
    criteria: [
      { id: "ad-deceptive", title: "거짓·과장 또는 기만 표현 금지", description: "소비자를 속이거나 오인하게 할 우려가 있는 표시·광고를 하지 않습니다.", evaluationPoint: "절대적·보장성 표현이 근거 없이 사용됐는지 확인" },
      { id: "ad-medical", title: "질병 예방·치료 효능 표방 금지", description: "일반 식품 광고에서 질병의 예방·치료에 효능이 있는 것으로 인식할 우려가 있는 표현을 피합니다.", evaluationPoint: "의학적 효능 또는 확정적 건강 결과를 암시하는지 확인" }
    ]
  }
];
export const categoryLabel: Record<Category, string> = { privacy: "개인정보 보호", accessibility: "웹 접근성", advertising: "광고·홍보 문구" };
