import type OpenAI from "openai";
import type { Preset } from "./presets";

export type Message = OpenAI.Chat.ChatCompletionMessageParam

export class ConversationMemory {
    private messages:Message[]=[]
    private preset: Preset

    constructor(preset:Preset) {
        this.preset = preset
        this.messages.push({
            role:"system",
            content:preset.systemPreompt
        })
    }

    // add user message
    addUser(content:string):void {
        this.messages.push({role:"user",content})
    }

    // add assistant replay
    addAssistant(content:string):void{
        this.messages.push({role:"assistant",content})
    }

    // get full history for api call
    getMessages():Message[] {
        return this.messages
    }

    // get user conversatin
    getConversation():Message[] {
        return this.messages.slice(1)
    }

    // Wipe user conversation except systemPrompt
    clear():void {
        this.messages = [
            {
                role:"system",
                content:this.preset.systemPreompt
            }
        ]
        console.log("\n  🧹 Conversation cleared.\n");
    }

    // switch to a different preset mid-conversation
    switchPreset(newPreset:Preset):void {
        this.preset = newPreset
        // update systemPrompt 
        this.messages[0] = {
            role:"system",
            content:newPreset.systemPreompt
        }
         console.log(
           `\n  ${newPreset.emoji} Switched to ${newPreset.label} mode.\n`,
         );
    }

    get length():number {
        return this.messages.length-1 // exclude system prompt
    }

    // current preset info
    getPreset():Preset {
        return this.preset
    }

    // token estimate (roughly 1 token = 4 char)
    estimateTokens():number {
        const totalChars = this.messages.map((m)=>{
            return typeof m.content === "string"? m.content.length : 0
        }).reduce((a,b)=>a+b,0)

        return Math.round(totalChars/4)
    }
}