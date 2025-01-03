import { PromptType, RoleType } from "@/hooks/use-chat-session";

export const getRole = (type: RoleType) => {
  switch (type) {
    case RoleType.assistant:
      return "assistant";
    case RoleType.writing_expert:
      return "expert in writing and coding";
    case RoleType.social_media_expert:
      return "expert in twitter (x), social media in general";
  }
};

export const getInstruction = (type: PromptType) => {
  switch (type) {
    case PromptType.ask:
      return "based on {userQuery}";
    case PromptType.answer:
      return "Answer this question";
    case PromptType.explain:
      return "Explain this";
    case PromptType.summarize:
      return "Summarize this";
    case PromptType.improve:
      return "Improve this";
    case PromptType.fix_grammar:
      return "Fix the grammar and typos";
    case PromptType.reply:
      return "Reply to this tweet, social media post or comment with a helpful response, must not use offensive language, use simple language like answering to friend";
    case PromptType.short_reply:
      return "Reply to this tweet, social media post or comment in short 3-4 words max";
  }
};

export const examplePrompts = [
  {
    title: "What is the capital of Indonesia?",
    prompt: "What is the capital of Indonesia?",
  },
  {
    title: "What is quantum computing?",
    prompt: "What is quantum computing?",
  },
  { title: "What are qubits?", prompt: "What are qubits?" },
  {
    title: "What is multi planetary ideology?",
    prompt: "What is multi planetary ideology?",
  },
];
