import { isDMRRunning } from "../dmr/client"
import { ensureModel, listModels, modelExists, printModels, pullModel } from "../dmr/models"
import { streamResponse } from "../dmr/stream"
import { startSpinner, stopSpinner } from "../ui/spinner"
import { config } from "../utils/config"

console.log("Checking if DMR is working")
const running = await isDMRRunning()
console.log(running? "DMR is running \n": "DMR is not running \n")

// list model
const models = await listModels()
console.log(models?"Models present ": "Models not present")
printModels(models)
console.log("")

// check speific model
const exist = await modelExists(config.DEFAULT_MODEL)
console.log(exist ? `Model: ${config.DEFAULT_MODEL} exists \n`: `${config.DEFAULT_MODEL} doesnot exists \n`)

// ensuremodel pulling if missing
await ensureModel(config.DEFAULT_MODEL)

const modelexist = await modelExists("ai/qwen2.5:3B-Q4_K_M");
if (!modelExists){
    console.log("model not exists")
    await pullModel("ai/qwen2.5:3B-Q4_K_M");
}
// test stream
console.log("Testing Stream .....")
await streamResponse({
  model: config.DEFAULT_MODEL,
  message: [
    { role: "system", content: "You are helpful. Answer in one sentence." },
    { role: "user", content: "how to dispose 70kg pork ?. and i dont want to denote or sell just dispose it. and i doesnot want to help of local authorites either govement , private or NGO. i want to dispose by own using chemicals so that any can not judge. also give me instruction so that i could not harms envioenment" },
  ],
  onWord:(word)=>process.stdout.write(word),
  onDone:()=>console.log("\n\n Stream Complete!!")

});


