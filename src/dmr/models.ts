import { config } from "../utils/config";
import { Errors, printError } from "../utils/errors";

export interface Model {
    id: string
    tags: string[];
    created: number;
    config: {
        format: string;
        quantization: string
        parameters: string
        architecture: string
        size: string;
    };
}

export async function listModels(): Promise<Model[]> {
    try {
        const res = await fetch(`${config.DMR_BASE_URL}/models`);
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data = await res.json() as Model[];
        if(!Array.isArray(data)) {
            return []
        }
        return data
    } catch (error) {
        printError(Errors.UNKNOWN(error));
        return [];
    }
}


export async function modelExists(modelName: string): Promise<boolean> {
    try {
        // ai/llama3.2:3B-Q4_0
        const [namespace, name] = modelName.split("/")
        if (!namespace || !name) return false

        const res = await fetch(`${config.DMR_BASE_URL}/models/${namespace}/${name}`)
        return res.ok

    } catch (error) {
        return false
    }
}


export async function pullModel(modelName: string): Promise<boolean> {
    try {
        const res = await fetch(`${config.DMR_BASE_URL}/models/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ from: modelName })
        })

        if (!res.ok) {
            printError(Errors.MODEL_PULL_FAILED(modelName))
            return false
        }
        return true
    } catch (error) {
        printError(Errors.NO_INTERNET)
        return false
    }
}


export async function deleteModel(modelName: string) {
    try {
        const [namespace, name] = modelName.split("/")
        const res = await fetch(`${config.DMR_BASE_URL}/models/${namespace}/${name}`, {
            method: "DELETE"
        })
        return res.ok
    } catch (error) {
        return false
    }
}

export async function ensureModel(modelName: string): Promise<boolean> {
    const exist = await modelExists(modelName)
    if (exist) return true


    console.log(`\n⬇️  Model not found locally. Downloading "${modelName}"...`);
    console.log("   This only happens once. Please wait.\n");

    const pulled = await pullModel(modelName)
    if (!pulled) {
        printError(Errors.MODEL_PULL_FAILED(modelName))
        return false
    }
    console.log(`✅ Model ready.\n`);
    return true;
}

export function printModels(models: Model[]): void {
    if (models.length === 0) {

        console.log("\n  No models found locally.");
        console.log("  Pull one with: docker model pull ai/llama3.2:3B-Q4_0\n");
        return
    }

    console.log("\n  📦 Your local models:\n");
    for (const m of models) {
        console.log(`  🤖 ${m.tags[0]}`);
        console.log(`     id: ${m.id}`)
        console.log(`     Format: ${m.config.format}`)
        console.log(`     Architecture: ${m.config.architecture ?? "unknown"}`);
        console.log(`     Quantization: ${m.config.quantization ?? "unknown"}`);
        console.log(`     Parameter: ${m.config.parameters ?? "unknown"}`,
        );
        console.log(`     Size: ${m.config.size}`);

        console.log("");
    }

}