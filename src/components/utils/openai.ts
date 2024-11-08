import OpenAI from 'openai';
import { Contract, OpenAIResponse1 } from "@/lib/types";

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

export const getSystemPrompt = async () => {
    return `You are the assistant for the Modernisation game. Your task involves analysing contracts. These contracts are created by companies and are bid upon by the government agencies of Singapore.
    The theme of this game is "Modernise an existing system/process, making it secure and future-ready". The contracts and your analysis should be strongly related to this theme.
    `
}

export const getValuePrompt = async (contract: Contract) => {
    const prompt = `A contract has been created with the following details:
    Title: ${contract.title}
    Description: ${contract.description}
    Requirements: ${contract.requirements.join(', ')}
    Sustainability Score: ${contract.sustainability}/10
    Expected Duration: ${contract.expectedDuration} months
   
    Based on the information provided, suggest the true value of this contract. 
    The value must be in the range 0 to 10000 credits.
    You should output detailed reasoning for the value you suggest, before deciding on the final value.
    `;
    return prompt;
}

export async function getValue(contract: Contract): Promise<OpenAIResponse1> {
    const prompt = await getValuePrompt(contract);
    const systemPrompt = await getSystemPrompt();

    const messages = [
        {
            role: 'system',
            content: systemPrompt
        },
        {
            role: 'user',
            content: prompt
        }
    ];

    const responseFormat = {
        type: "json_schema",
        json_schema: {
            name: "contract_value",
            "strict": true,
            schema: {
                type: "object",
                properties: {
                    value: {
                        type: "number"
                    },
                    reasoning: {
                        type: "string"
                    }
                },
                required: ["value", "reasoning"],
                additionalProperties: false
            }
        }
    };

    try {
        const response = await openai.chat.completions.create({
            messages: messages,
            model: 'gpt-4o-mini-2024-07-18',
            response_format: responseFormat,
            stream: false
        });

        const message = response.choices[0].message;
        if (message?.content) {
            return JSON.parse(message.content);
        } else {
            return {
                value: 1000,
                reasoning: "No reasoning provided / Refused by model"
            }
        }
    }
    catch (error) {
        console.error(error);
        return {
            value: 1000,
            reasoning: "No reasoning provided / Error: " + error
        }
    }
}

export const getAnalysisPrompt = async (contract: Contract) => {
    const prompt = `A contract has been created with the following details:
    Title: ${contract.title}
    Description: ${contract.description}
    Requirements: ${contract.requirements.join(', ')}
    Sustainability Score: ${contract.sustainability}/10
    Expected Duration: ${contract.expectedDuration} months
   
    The user is considering whether to bid on this contract. Provide an analysis of the contract, including the risks and benefits of bidding on this contract.
    However, the analysis should be balanced and not biased towards either choice. The analysis should be easily understandable by the user. You should explain
    key terms and concepts where necessary. You may also consider the stakeholders involved in the contract.
    
    You will now provide the analysis.`;
    return prompt;
}

export async function getAnalysis(contract: Contract): Promise<string> {
    const prompt = await getAnalysisPrompt(contract);
    const systemPrompt = await getSystemPrompt();

    const messages = [
        {
            role: 'system',
            content: systemPrompt
        },
        {
            role: 'user',
            content: prompt
        }
    ];

    try {
        const response = await openai.chat.completions.create({
            messages: messages,
            model: 'gpt-4o-mini-2024-07-18',
            stream: false
        });

        const message = response.choices[0].message.content;
        if (message) {
            return message;
        } else {
            return "No analysis provided / Error";
        }
    }
    catch (error) {
        console.error(error);
        return "No analysis provided / Error: " + error;
    }
}