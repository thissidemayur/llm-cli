export class LLMError extends Error {
    constructor(
        message: string,
        public readonly hint?: string,
    ) {
        super(message);
        this.name = "LLMError";
    }
}

export const Errors = {
  DMR_NOT_RUNNING: new LLMError(
    "❌  AI engine is not running.",
    "💡  Fix: Make sure Docker is running, then try again.",
  ),

  MODEL_NOT_FOUND: (model: string) =>
    new LLMError(
      `❌  Model "${model}" not found locally.`,
      "💡  Fix: It will be downloaded automatically. Please wait...",
    ),

  MODEL_PULL_FAILED: (model: string) =>
    new LLMError(
      `❌  Could not download model "${model}".`,
      "💡  Fix: Check your internet connection and try again.",
    ),

  OUT_OF_MEMORY: new LLMError(
    "❌  Not enough memory to run this model.",
    "💡  Fix: Try a smaller model like ai/smollm2",
  ),
  NO_INTERNET: new LLMError(
    "❌  Cannot reach Docker Hub.",
    "💡  Fix: Check your internet connection.",
  ),

  EMPTY_RESPONSE: new LLMError(
    "❌  AI returned an empty response.",
    "💡  Fix: Try asking again or restart with a fresh session.",
  ),
  UNKNOWN: (err: unknown) =>
    new LLMError("❌  Something went wrong.", `💡  Details: ${err instanceof Error ? err?.message : String(err)}`),
} as const;


export function printError(err:LLMError):void {
    console.error(`\n${err.message}`)
    if(err.hint) {
        console.error(err.hint)
    }
    console.error("")
}