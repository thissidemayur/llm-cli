import OpenAI from "openai";
import { config } from "../utils/config";
import { Errors, printError } from "../utils/errors";


export const client = new OpenAI({
    baseURL: config.DMR_CHATGPT_URL,
    apiKey:"not providing"
})

export async function isDMRRunning():Promise<boolean> {
    try {
        const res = await fetch(`${config.DMR_BASE_URL}/models`)
        return res.ok
    } catch (error) {
        return false
    }
}

export async function requireDMR(): Promise<void> {
    const running = await isDMRRunning()
    if(!running) {
        printError(Errors.DMR_NOT_RUNNING)
        process.exit(1)
    }
}
