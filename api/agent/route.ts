import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY is not configured on Netlify.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();

    const message = body?.message;

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return NextResponse.json(
        {
          error: "Message is required.",
        },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey,
    });

    const response = await openai.responses.create({
      model:
        process.env.OPENAI_MODEL ||
        "gpt-5.6-luna",

      instructions:
        "You are the AI assistant inside an Agentic UI. Help the user build websites, write code, debug projects, explain programming, and work with files. Give clear and useful answers.",

      input: message,
    });

    return NextResponse.json({
      response: response.output_text,
    });
  } catch (error) {
    console.error("OPENAI ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error.",
      },
      { status: 500 }
    );
  }
}
