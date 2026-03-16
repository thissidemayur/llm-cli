import ora,{type Ora} from "ora";
import { colors } from "./colors";

let activeSpinner:Ora | null = null

export function startSpinner(text = "Thinking..."):void {
    activeSpinner = ora({
        text:colors.muted(text),
        spinner:"dots",
        color:"cyan"
    }).start()
}

export function stopSpinner():void {
    if(activeSpinner) {
        activeSpinner.stop()
        activeSpinner.clear()
        activeSpinner = null
    }
}

export function succeedSpinner(text:string):void {
    if(activeSpinner) {
        activeSpinner.succeed(colors.success(text))
        activeSpinner = null
    }
}

export function failSpinner(text:string) {
    if(activeSpinner) {
        activeSpinner.fail(colors.error(text))
        activeSpinner = null
    }
}