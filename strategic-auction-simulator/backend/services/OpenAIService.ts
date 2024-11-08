import OpenAI from 'openai';
import { IContract } from '../models/Game';
import dotenv from "dotenv";

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async assessContractValue(contract: IContract): Promise<{
    actualValue: number;
    sustainability: number;
    completionProbability: number;
  }> {
    try {
      const prompt = this.constructEvaluationPrompt(contract);

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert contract evaluator analyzing infrastructure project proposals."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        functions: [
          {
            name: "contract_evaluation",
            parameters: {
              type: "object",
              properties: {
                actualValue: {
                  type: "number",
                  description: "Estimated true value of the contract"
                },
                sustainability: {
                  type: "number",
                  description: "Sustainability score (0-100)"
                },
                completionProbability: {
                  type: "number",
                  description: "Probability of successful completion (0-1)"
                }
              },
              required: ["actualValue", "sustainability", "completionProbability"]
            }
          }
        ]
      });

      const evaluation = JSON.parse(
        response.choices[0].message?.function_call?.arguments || '{}'
      );

      return {
        actualValue: evaluation.actualValue || contract.baseValue,
        sustainability: evaluation.sustainability || 50,
        completionProbability: evaluation.completionProbability || 0.5
      };
    } catch (error) {
      console.error('OpenAI Evaluation Error:', error);

      // Fallback values
      return {
        actualValue: contract.baseValue,
        sustainability: 50,
        completionProbability: 0.5
      };
    }
  }

  private constructEvaluationPrompt(contract: IContract): string {
    return `
      Evaluate the following infrastructure contract:
      Title: ${contract.title}
      Description: ${contract.description}
      Base Value: $${contract.baseValue}
      Initial Risks: ${contract.risks.join(', ')}

      Please provide a detailed assessment considering:
      1. Actual market value
      2. Sustainability potential
      3. Likelihood of successful completion
    `;
  }
}

export default new OpenAIService();