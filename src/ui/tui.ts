import type { PresetName } from "../core/presets";
import type { Model } from "../dmr/models";
import { colors } from "../ui/colors";
import { config } from "../utils/config";

const WIDTH = 60;
function line(char = "_"): string {
  return colors.border(char.repeat(WIDTH));
}

function pad(text: string, width: number): string {
  return text + " ".repeat(Math.max(0, width - text.length));
}

// welcome Banner
export function printWelcome(model: string, mode: PresetName): void {
  const modeEmojis: Record<PresetName, string> = {
    chat: "💬",
    code: "💻",
    creative: "🎨",
  };

  console.clear();

  console.log("\n" + line("_"));
  console.log(
    colors.accent.bold("  🐳 LLM CLI") + colors.dim(" v" + config.APP_VERSION),
  );

  console.log(line("_"));
  console.log(colors.label(" Model ") + colors.user(model));

  console.log(line("_"));
  console.log(
    colors.dim(" /exit") +
    colors.muted(" quit ") +
    colors.dim("/clear") +
    colors.muted(" new session  ") +
    colors.dim("/mode") +
    colors.muted(" switch mode"),
  );

  console.log(
    colors.dim("  /models") +
    colors.muted(" list models  ") +
    colors.dim("/save") +
    colors.muted(" save history  ") +
    colors.dim("/help") +
    colors.muted(" commands"),
  );

  console.log(line("─") + "\n");
}

// UI message User and AI both
export function printUserMessage(text: string): void {
  console.log("\n" + colors.userLabel + colors.user(text + "\n"));
}

// before streaming
export function printAIHeader(): void {
  console.log("\n" + colors.aiLabel + colors.ai(" "));
}

// after streaming complets(footer)
export function printAIFooter(tokens?: number): void {
  console.log("\n");
  if (tokens) {
    console.log(colors.dim(` ~${tokens} tokens \n`));
  }
}

export function printSystemMsg(text: string): void {
  console.log(colors.system(`\n ℹ️  ${text}\n`));
}

export function printTUIError(text: string, hint?: string): void {
  console.log(colors.error(`\n  ❌  ${text}`));
  if (hint) console.log(colors.warning(`  💡  ${hint}`));
}
console.log("");

export function printPrompt(): void {
  process.stdout.write(colors.user("\n  You › "));
}

export function printDivider(): void {
  console.log("\n" + line() + "\n");
}

// help panel

export function printHelp(): void {
  console.log("\n" + line());
  console.log(colors.accent.bold("  📖 Commands\n"));
  const commands = [
    ["/exit", "Quit the app"],
    ["/clear", "Start a fresh conversation"],
    ["/mode chat", "Switch to chat mode"],
    ["/mode code", "Switch to code mode"],
    ["/mode creative", "Switch to creative mode"],
    ["/models", "List your local AI models"],
    ["/save", "Save this conversation to file"],
    ["/history", "View past conversations"],
    ["/help", "Show this help panel"],
  ];

  for (const [cmd, desc] of commands) {
    console.log(colors.dim("  " + pad(cmd as string, 20)) + colors.muted(desc));
  }
  console.log(line() + "\n");
}

// model list
export function printModelList(
  models: Model[]
): void {

  console.log("\n" + line())
  console.log("\n" + colors.accent.bold("  📦 Local Models\n"))
  if (models.length === 0) {

    console.log(colors.muted("  No models found locally."));
    console.log(
      colors.dim("  Pull one: ") +
      colors.user("docker model pull ai/llama3.2:3B-Q4_0")
    )
  } else {
            console.log("Total Number of Model: ", models.length);
            let indx=0
    for (const m of models) {
      indx++
      const tag = m.tags?.[0] ?? m.id ?? "unknown";

      const size= m.config.size;
      
      const createdDate = m.created
        ? new Date(m.created * 1000).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        : "unknown";
     
        console.log(colors.ai(indx,"  🤖 " + tag));
        console.log(
          colors.dim("    ├─ ") +
            colors.label("Size         ") +
            colors.muted(size),
        );
        console.log(
          colors.dim("    ├─ ") +
            colors.label("Format       ") +
            colors.muted(m.config.format ?? "unknown"),
        );
         console.log(
           colors.dim("    ├─ ") +
             colors.label("Quantization ") +
             colors.muted(m.config.quantization ?? "unknown"),
         );
         console.log(
           colors.dim("    ├─ ") +
             colors.label("Architecture ") +
             colors.muted(m.config.architecture ?? "unknown"),
         );
         console.log(
           colors.dim("    ├─ ") +
             colors.label("Parameters   ") +
             colors.muted(m.config.parameters ?? "unknown"),
         );
          console.log(
            colors.dim("    └─ ") +
              colors.label("Created      ") +
              colors.muted(createdDate),
          );
          console.log("");
    }
  }
    console.log(line() + "\n");
}


















export function printGoodbye(): void {
  console.log(
    "\n" + line() + "\n" + colors.accent("  👋 Goodbye!\n") + line() + "\n",
  );
}

export function printOneShotHeader(model: string): void {
  console.log("\n" + colors.dim("  🐳 llm  •  ") + colors.user(model) + "\n");
}