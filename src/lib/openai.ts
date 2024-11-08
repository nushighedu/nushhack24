import OpenAI from 'openai';
import { Contract, OpenAIResponsePartial, OpenAIResponse, Message, Messages, Role } from "@/lib/types";

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

if (!apiKey) {
    console.warn('OpenAI API key is missing. AI analysis features will be unavailable.');
}

const openai = new OpenAI({
    apiKey: apiKey || 'dummy-key',
    dangerouslyAllowBrowser: true // Required for client-side usage
});

export const getSystemPrompt = async () => {
    return `You are the assistant for the Modernisation game. Your task involves analysing contracts, which are created by players. These contracts are created by companies and are bid upon by the government agencies of Singapore.
    The theme of this game is "Modernise an existing system/process, making it secure and future-ready". The contracts and your analysis should be strongly related to this theme.
    `
}

export const getValuePrompt = async (contract: Contract) => {
    const prompt = `A contract has been created with the following details:
    Title: ${contract.title}
    Government Agencies: ${contract?.agencies || 'None'}
    Description: ${contract.description}
    Requirements: ${contract.requirements.join(', ')}
    Expected Duration: ${contract.expectedDuration} months
    Sustainability Score: ${contract.sustainability}
   
    Based on the information provided, suggest the true value of this contract. The value reflects the benefits that the project brings to the government.
    Follow the guidelines below:
    - Feasibility: The project should be realistic and achievable. The requirements, if any, should be clear.
    - Usefulness: The submission addresses a pertinent problem faced by society. Their submission identifies key problems that have not been previously resolved and seeks to resolve them.  
    - Sustainability: The project should be sustainable in the long term; it should not be a one-time solution.
    - Creativity (bonus): The submission is innovative and creative. It offers a unique solution to the problem.
    
    The value must be a number in the range 0 to 10000 credits.
    You should first output detailed reasoning, before deciding on the final value.
    `;
    return prompt;
}

// A mock response function for when API key is missing
const getMockResponse = (contract: Partial<Contract>): OpenAIResponse => ({
    value: Math.floor(Math.random() * 10000),
    reasoning: "This is a mock analysis because the OpenAI API key is not configured.",
    analysis: `Mock analysis for contract: ${contract.title}\n\n` +
        "Due to API configuration issues, this is a simulated response.\n\n" +
        "Key points to consider:\n" +
        "- Project scope and requirements\n" +
        "- Timeline feasibility\n" +
        "- Budget considerations\n" +
        "- Technical implementation challenges"
});

export async function getValue(contract: Partial<Contract>): Promise<OpenAIResponsePartial> {
    if (!apiKey) {
        const mockResponse = getMockResponse(contract);
        return {
            value: mockResponse.value,
            reasoning: mockResponse.reasoning
        };
    }

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
                    reasoning: {
                        type: "string"
                    },
                    value: {
                        type: "number"
                    }
                },
                required: ["reasoning", "value"],
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
                value: Math.floor(Math.random() * 10000),
                reasoning: "No reasoning provided / Refused by model"
            }
        }
    }
    catch (error) {
        console.error(error);
        return {
            value: Math.floor(Math.random() * 10000),
            reasoning: "No reasoning provided / Error: " + error
        }
    }
}

export const getAnalysisPrompt = async (contract: Contract) => {
    const prompt = `A contract has been created with the following details:
    Title: ${contract.title}
    Government Agencies: ${contract?.agencies || 'None'}
    Description: ${contract.description}
    Requirements: ${contract.requirements.join(', ')}
    Expected Duration: ${contract.expectedDuration} months
    Sustainability Score: ${contract.sustainability}
   
    The user is considering whether to bid on this contract. Provide an analysis of the contract, including the risks and benefits of bidding on this contract.
    However, the analysis should be balanced and not biased towards either choice. The analysis should be easily understandable by the user. You should explain
    key terms and concepts where necessary. You may also consider the stakeholders involved in the contract.
    
    You will now provide the analysis.`;
    return prompt;
}

export async function getAnalysis(contract: Partial<Contract>): Promise<string> {
    if (!apiKey) {
        return getMockResponse(contract).analysis;
    }

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

export async function getOpenAIResponse(contract: Partial<Contract>): Promise<OpenAIResponse> {
    if (!apiKey) {
        return getMockResponse(contract);
    }

    const value = await getValue(contract);
    const analysis = await getAnalysis(contract);

    const response = {
        value: value.value,
        reasoning: value.reasoning,
        analysis: analysis
    };

    console.log("OpenAI Response: ", response);
    return response;
}


// chatbot class
const getChatSystemPrompt = () => {
    return `${getSystemPrompt()}
    
    You are now in a chat session with the user. You will act as a helpful assistant. The user may ask questions or provide information about the contracts. You will provide responses based on the information provided.
    Remember that the context of the conversation is the Modernisation game, and the location is Singapore. You should provide relevant and accurate information based on this context.
    You may also ask questions to clarify the user's input or to provide more accurate responses. The goal is to assist the user in analysing the contracts and making informed.
    
    The following is part of the format of a contract:
    Title; Description; Government Agencies; Requirements; Expected Duration; Minimum Bid.
    
    REMEMBER: Your responses must ALWAYS be related to the game context only. You should not provide any irrelevant information or break character. If irrelevant or inappropriate prompts are given, you should decline to respond
    by stating "I'm sorry, I cannot respond to that prompt. Is there anything else I can help you with?".
    `
};

export class ChatSession {
    public messages: Messages;

    constructor(messages: Messages = [], systemPrompt: string = getChatSystemPrompt()) {
        this.messages = messages;
        this.messages.push({ role: 'system', content: systemPrompt });
    }

    async addMessage(role: Role, content: string) {
        this.messages.push({ role, content });
    }

    // get response and add to messages
    async getResponse() {
        let message;
        try {
            const response = await openai.chat.completions.create({
                messages: this.messages,
                model: 'gpt-4o-mini-2024-07-18',
                stream: false
            });
            message = response.choices[0].message.content || "No response provided";
        }
        catch (error) {
            console.error(error);
            message = "No response provided / Error: " + error;
        }
        this.messages.push({ role: 'assistant', content: message });
        return message;
    }
}

// example usage
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function exampleChatSessionUsage() {
    // initialize chat session
    const chat = new ChatSession();

    // interactively take input
    while (true) {
        const input = prompt("Enter your message: ");
        if (!input) break;

        await chat.addMessage('user', input); // add user message
        const response = await chat.getResponse(); // get response
        console.log(response);
        // console.log("Messages so far: ", chat.messages);
    }
}