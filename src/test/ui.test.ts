import { colors } from "../ui/colors";
import { startSpinner, stopSpinner } from "../ui/spinner";
import { printAIFooter, printAIHeader, printGoodbye, printHelp, printModelList, printOneShotHeader, printPrompt, printSystemMsg, printTUIError, printUserMessage, printWelcome } from "../ui/tui";

printWelcome("ai/llama3.2:3B-Q4_0", "chat");
printOneShotHeader("ai/llama3.5-Q4_0");

// spinner
startSpinner("Thinking...")
await Bun.sleep(2000)
stopSpinner()

// simulate conversation
printUserMessage("What is Docker in one sentence?");
printAIHeader()

// simulate streamng word by words
const words =
  "Docker is a tool that packages apps into containers for consistent deployment.".split(
    " ",
  );
for(const word of words) {
    process.stdout.write(colors.ai(word + " "))
    await Bun.sleep(80)
}
printAIFooter(63)

// shows help message pannel
printHelp()

// Model list
printModelList([
  { name: "llama3.2:3B-Q4_0", size: 1912602624, quantization: "Q4_0" },
  { name: "smollm2", size: 268697600, quantization: "IQ2_XXS" },
]);


printSystemMsg("Switched to code mode.");
printGoodbye()

printTUIError("AI image cannot pull from docker","please check your iNternet connection")