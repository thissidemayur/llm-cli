import { parseArgs } from "./cli/args";
import { startChatLoop } from "./core/chat";
import { ConversationMemory } from "./core/memory";
import { presets } from "./core/presets";
import { requireDMR } from "./dmr/client";
import { ensureModel, listModels } from "./dmr/models";
import { streamResponse } from "./dmr/stream";
import { colors } from "./ui/colors";
import { startSpinner, stopSpinner } from "./ui/spinner";
import { printAIFooter, printAIHeader, printModelList, printOneShotHeader, printTUIError } from "./ui/tui";

async function main():Promise<void>{
    const args = parseArgs();

    // check DMR is running
    await requireDMR()

    if(args.mode === "models"){
        const models = await listModels()
        printModelList(models)
        process.exit(0)
    }

    if(args.mode === "history") {
        const {showHistory} = await import("./core/history")
        await showHistory()
        process.exit(0)
    }

    // ensure model exist if not auto pull
    startSpinner(`Checking model ${args.model}...`)
    const ready = await ensureModel(args.model)
    stopSpinner()
    
    if(!ready) {
         printTUIError(
           `Could not load model "${args.model}"`,
           "Try: docker model pull " + args.model,
         );
         process.exit(1)
    }

    if(args.mode === "oneshot" && args.query) {
        printOneShotHeader(args.model)

        const preset= presets[args.preset]
        const memory = new ConversationMemory(preset)
        memory.addUser(args.query)

        startSpinner("Thinking...")
        let firstToken = true

        await streamResponse({
          model: args.model,
          messages: memory.getMessages(),
          temperature: preset.temperature,
          top_p: preset.top_p,
          max_token: preset.max_tokens,
          onWord:(word) =>{
            if(firstToken) {
                stopSpinner()
                printAIHeader()
                firstToken =false
            }
            process.stdout.write(colors.ai(word))
          },
          onDone:()=>{
            printAIFooter();
            console.log("");
          }

        });

        process.exit(0)
    }

    // interactive chatloop
    await startChatLoop(args.model,args.preset)
}

main().catch((err)=>{
      console.error(colors.error("\n  ❌ Unexpected error:"), err.message);
      process.exit(1);
}) 