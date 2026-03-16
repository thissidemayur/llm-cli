// read input, sent to DMR, stream response and handles commands
import * as readline from "readline";
import { printAIFooter, printAIHeader, printGoodbye, printHelp, printModelList, printPrompt, printSystemMsg, printUserMessage, printWelcome } from "../ui/tui";
import { ConversationMemory } from "./memory";
import { getPreset, presets, printPresets, type PresetName } from "./presets";
import { saveSession, showHistory } from "./history";
import { listModels } from "../dmr/models";
import { startSpinner, stopSpinner } from "../ui/spinner";
import { streamResponse } from "../dmr/stream";
import { colors } from "../ui/colors";

export async function startChatLoop(model: string, presetName: PresetName): Promise<void> {
    // create memory
    const memory = new ConversationMemory(presets[presetName])

    printWelcome(model, presetName)

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    })

    function prompt(): Promise<string> {
        return new Promise((resolve) => {
            printPrompt();
            rl.once("line", (line) => resolve(line.trim()))
        })
    }

    while (true) {
        const input = await prompt()

        if (!input) continue

        if (input === "/exit" || input === "/quit") {
            // auto save on exit
            if (memory.length > 0) {
                await saveSession(memory.getConversation(), model, memory.getPreset().name)
               
            }
             printGoodbye();
             rl.close();
             process.exit(0);

        }

        if (input === "/clear") {
            memory.clear()
            printWelcome(model, memory.getPreset().name)
            continue;
        }

        if (input === "/help") {
            printHelp()
            continue
        }

        if (input === "/models") {
            const models = await listModels()
            printModelList(models)
            continue
        }

        if (input === "/save") {
            if (memory.length === 0) {
                printSystemMsg("Nothing to save yet")
                continue
            } else {
                await saveSession(memory.getConversation(), model, memory.getPreset().name)
                continue
            }
        }

        if (input === "/history") {
            await showHistory()
            continue
        }

        if (input === "/pesents") {
            printPresets()
            continue
        }

        // mode
        if (input.startsWith("/mode")) {
            const parts = input.split(" ")
            const modeName = parts[1]

            if (!modeName) {
                printPresets()
                continue
            }

            const newPreset = getPreset(modeName);
            if (!newPreset) {
                printSystemMsg(
                    `Unknown mode "${modeName}". Try: chat, code, creative`,
                );
                continue
            }

            memory.switchPreset(newPreset)
            continue
        }

        // unknow command
        if (input.startsWith("/")) {
            printSystemMsg(`Unknown command "${input}". Type /help to see all commands.`);
            continue;
        }



        printUserMessage(input)
        memory.addUser(input)

        // show spinner
        startSpinner("Thinking...")

        let firstToken = true
        let tokenCount = 0

        const reply = await streamResponse({
            model,
            messages:memory.getMessages(),
            temperature:memory.getPreset().temperature,
            top_p:memory.getPreset().top_p,
            max_token:memory.getPreset().max_tokens,

            onWord:(word) => {
                if(firstToken) {
                    stopSpinner();
                    printAIHeader()
                    firstToken = false
                }
                process.stdout.write(colors.ai(word))
                tokenCount++;
            } ,
            onDone:()=>{
                printAIFooter(tokenCount);
            }
        })

        if(reply) {
            memory.addAssistant(reply)
        }
    }

}