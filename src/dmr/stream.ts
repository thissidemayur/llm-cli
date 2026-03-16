import type OpenAI from "openai";
import { client } from "./client";
import { Errors, printError } from "../utils/errors";

interface StreamOptions {
  model: string;
  messages: OpenAI.Chat.ChatCompletionMessageParam[];
  temperature?: number;
  top_p?: number;
  max_token?: number;

  // called with each word as it arrives
  onWord: (word: string) => void;
  // called when streaming is complete
  onDone: () => void;
}
export async function streamResponse(options: StreamOptions): Promise<string> {
  try {
    const stream = await client.chat.completions.create({
      model: options.model,
      messages: options.messages,
      stream: true,
      temperature: options.temperature ?? 0.7,
      top_p: options.top_p ?? 0.9,
      max_tokens: options.max_token ?? 1024,
    });

    let fullReplay = "";
    for await (const chunk of stream) {
      const word = chunk.choices[0]?.delta.content ?? "";
      if (word) {
        options.onWord(word);
        fullReplay += word;
      }
    }
    options.onDone();
    return fullReplay;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("ECONNREFUSED")) {
        printError(Errors.DMR_NOT_RUNNING);
    }
    else if (message.includes("out of memory")){
      printError(Errors.OUT_OF_MEMORY);
    }else {
      printError(Errors.UNKNOWN(err));
    }
    return ""
  }
}
