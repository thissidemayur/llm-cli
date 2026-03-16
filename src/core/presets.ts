import { llmPrompt } from "./llmPrompt"

export type PresetName = "chat" | "code" | "creative"

export interface Preset {
    name: PresetName
    label: string
    emoji:string
    description:string
    systemPreompt:string
    temperature:number
    top_p:number
    max_tokens:number
}

export const presets: Record<PresetName, Preset> = {
  chat: {
    name: "chat",
    label: "Chat",
    emoji: "💬",
    description: llmPrompt.chat.description,
    systemPreompt: llmPrompt.chat.systemPreompt,
    temperature: 0.7,
    top_p: 0.9,
    max_tokens: 1024,
  },
  code: {
    name: "code",
    label: "Code",
    emoji: "💻",
    description: llmPrompt.code.description,
    systemPreompt: llmPrompt.code.systemPreompt,
    temperature: 0.1,
    top_p: 0.95,
    max_tokens: 2048,
  },
  creative: {
    name: "creative",
    label: "Creative",
    emoji: "🎨",
    description: llmPrompt.creative.description,
    systemPreompt:llmPrompt.creative.systemPreompt,
    temperature: 1.2,
    top_p: 0.95,
    max_tokens: 2048,
  },
};

// validate preset name from user input
export function getPreset(name: string): Preset | null{
    if (name in presets) return presets[name as PresetName]
    return null
}

export function printPresets():void {
      console.log("\n  🎛️  Available modes:\n");
    for(const preset of Object.values(presets)) {
        console.log(`${preset.emoji}  ${preset.name.padEnd(10)}`)
    }
      console.log("\n  Usage: /mode code\n");
}

