import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "기준찾기 | 근거 기반 AI 평가", description: "공신력 있는 기준을 찾아 근거와 함께 평가합니다." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ko"><body>{children}</body></html>; }
