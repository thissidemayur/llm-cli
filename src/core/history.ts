// stored at ~/.llm/history/YYYY-MM-DD.json
import {  readdir, readFile, writeFile } from "node:fs/promises"
import type { Message } from "./memory"
import { config } from "../utils/config"
import { mkdir } from "node:fs/promises"
import { join } from "node:path"
import { existsSync } from "node:fs"

export interface Session {
    id:string
    startedAt: string
    model:string
    mode:string
    message: Message[]
}

export interface HistoryFile {
    date:string
    sessions:Session[]
}

//check  history directory 
async function ensureHistoryDir():Promise<void>{
    if(!existsSync(config.HISTORY_DIR)) {
        await mkdir(config.HISTORY_DIR,{recursive:true})
    }
}

// today's file path: ~/.llm/history/2026-03-15.json
function todayFilePath():string {
    const date = new Date().toISOString().split("T")[0]
    return join(config.HISTORY_DIR,`${date}.json`)
}

// generate simple session ID
function genereateId():string {
    return Math.random().toString(36).substring(2,8)
}

// Save current session to disk
export async function saveSession(message:Message[],model:string,mode:string):Promise<void>{
try {
    await ensureHistoryDir()
    const filePath = todayFilePath()
    const date = new Date().toISOString().split("T")[0]

    // load existing file pr create fresh
    let historyFile:HistoryFile = {date:date as string,sessions:[]}
    if(existsSync(filePath)) {
        const raw = await readFile(filePath,"utf-8")
        historyFile = JSON.parse(raw)
    }

    // add new sessions
    const session:Session = {
        id:genereateId(),
        startedAt:new Date().toLocaleDateString(),
        mode,
        model,
        message
    }

    historyFile.sessions.push(session)

    await writeFile(filePath,JSON.stringify(historyFile,null,2))
    console.log(`\n  💾 Saved to ${filePath}\n`);
} catch (error) {
    console.error("\n  ⚠️  Could not save history:", error);
}
}

// load and display past sessions
export async function showHistory():Promise<void> {
    try {
        await ensureHistoryDir()

        const files= await readdir(config.HISTORY_DIR) 
const jsonFiles = files
  .filter((f) => f.endsWith(".json"))
  .sort()
  .reverse();        
        if (jsonFiles.length === 0) {
          console.log("\n  📭 No history found yet.\n");
          return;
        }

            console.log("\n  📚 Conversation History:\n");
        
            // shows last 3 day files
            for (const file of jsonFiles) {
                const raw = await readFile(join(config.HISTORY_DIR,file),"utf-8")
                const historyFile =JSON.parse(raw)
                      console.log(`  📅 ${historyFile.date}`);

                for(const session of historyFile.sessions) {
                    const msgCount = session.message.length
                     console.log(
                       `     • ${session.startedAt} — ${session.mode} mode — ` +
                         `${msgCount} message${msgCount !== 1 ? "s" : ""} — ` +
                         `${session.model}`,
                     );
                }
                      console.log("");
                

            }

    } catch (error) {
            console.error("\n  ⚠️  Could not load history:", error);
    }
}