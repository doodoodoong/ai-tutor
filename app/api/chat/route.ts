import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    console.log("API 요청 받음");
    const { messages } = await req.json();
    console.log("받은 메시지:", messages);

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY가 설정되지 않았습니다.");
    }

    console.log("OpenAI API 호출 시작");
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "당신은 초등학교 6학년 학생을 돕는 친절한 AI 튜터입니다.",
        },
        ...messages,
      ],
    });
    console.log("OpenAI API 호출 완료");

    const reply = chatCompletion.choices[0].message.content;
    console.log("AI 응답:", reply);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("OpenAI API 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다: " + (error as Error).message },
      { status: 500 }
    );
  }
}
