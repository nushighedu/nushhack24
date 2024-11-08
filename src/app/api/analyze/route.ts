import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { Contract } from '@/lib/types';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // Use server-side env variable
});

export async function POST(request: Request) {
    try {
        const contract: Contract = await request.json();

        // System prompt
        const systemPrompt = `You are the assistant for the Modernisation game...`; // Your existing system prompt

        const response = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                {
                    role: 'user',
                    content: `Analyze this contract:\n${JSON.stringify(contract, null, 2)}`
                }
            ],
            model: 'gpt-4-turbo-preview',
            response_format: { type: "json_object" }
        });

        return NextResponse.json({
            success: true,
            data: response.choices[0].message.content
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to analyze contract' },
            { status: 500 }
        );
    }
}