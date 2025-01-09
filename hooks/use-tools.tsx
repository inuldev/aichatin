import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { AIMessage, SystemMessage } from "@langchain/core/messages";
import { RunnableLambda } from "@langchain/core/runnables";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

const calculatorTool = () => {
  const calculatorSchema = z.object({
    operation: z
      .enum(["add", "subtract", "multiply", "divide"])
      .describe("The type of operation to execute."),
    number1: z.number().describe("The first number to operate on."),
    number2: z.number().describe("The second number to operate on."),
  });

  return new DynamicStructuredTool({
    name: "calculator",
    description: "Can perform mathematical operations.",
    schema: calculatorSchema,
    func: async ({ operation, number1, number2 }) => {
      if (operation === "add") {
        return `${number1 + number2}`;
      } else if (operation === "subtract") {
        return `${number1 - number2}`;
      } else if (operation === "multiply") {
        return `${number1 * number2}`;
      } else if (operation === "divide") {
        return `${number1 / number2}`;
      } else {
        throw new Error(`Unknown operation: ${operation}`);
      }
    },
  });
};

export const useTools = () => {
  const calTool = calculatorTool();
  const searchTool = new TavilySearchResults({
    maxResults: 5,
    apiKey: "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",
  });

  const toolCalling = (selectedModel: ChatOpenAI | ChatAnthropic) =>
    new RunnableLambda({
      func: async (output: AIMessage) => {
        console.log("output", output);

        const tool = output?.tool_calls?.[0];
        console.log(tool);

        if (tool?.name === "calculator") {
          const result = await calTool.invoke(tool.args.input);
          return new AIMessage(result);
        }

        if (tool?.name === "tavily_search_results_json") {
          const result = await searchTool.invoke(tool.args.input);
          const parsedResult = JSON.parse(result);
          console.log(parsedResult);

          const searchPrompt = [
            new SystemMessage(
              `Based on past conversation here are result from the internet. ${parsedResult?.map(
                (r: any, index: number) =>
                  `${index + 1}. Title: """${r.title}""" \n URL: """${
                    r.url
                  }"""\n description: """${r.description}"""`
              )}. Please summarize this findings with citation link to their source.`
            ),
          ];

          return selectedModel.stream(searchPrompt);
        }

        return output;
      },
    });

  return {
    calTool,
    searchTool,
    toolCalling,
  };
};
