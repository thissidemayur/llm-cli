import { Command } from "commander"
import type { PresetName } from "../core/presets"
import { config } from "../utils/config"



export interface ParsedArgs {
    mode: "oneshot" | "chat" | "models" | "history"
    query: string | null
    model: string
    preset: PresetName
}


export function parseArgs(): ParsedArgs {
    const program = new Command()

    program
        .name("llm")
        .description("Chat with a local AI model- powered by Docker Model Runner(DMR)")
        .version(config.APP_VERSION)
        .argument("[query...]","Question to ask the AI")
        .option("--chat","Start an interactive chat session")
        .option("--models","List all local models")
        .option("--history","show past conversations")
        .option("--model <name>", "Model to use",config.DEFAULT_MODEL)
        .option("--mode <mode>","Preset mode: chat | code | creative","chat")
    
    program.parse(process.argv)

    const opts = program.opts()
    const args = program.args

    // validate preset
    const validPresets: PresetName[] = ["chat","code","creative"]
    const preset:PresetName = validPresets.includes(opts.mode) ? opts.mode : "chat"

    // --models glag
    if(opts.models) {
        return {mode:"models",query:null,model:opts.model,preset}
    }

    // --history flag
    if(opts.history){
        return {
            mode:"history",query:null,model:opts.model,preset
        }
    }

    // -- chat flag
    if(opts.chat) {
        return {
            mode:"chat",query:null, model:opts.model, preset
        }
    }

    if(args.length > 0){
        return {
            mode:"oneshot",query:args.join(" "), model:opts.model,preset
        }
    }

    // default to chat
    return {mode:"chat",query:null, model:opts.model,preset}

}