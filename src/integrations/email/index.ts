import axios from "axios"
import {log} from "@/utils/logs/log.funciton.ts";
import {LogCategory} from "@/pages/AdminLogs/types.ts";

export async function sendEmail(to: string, subject: string, text: string){
    await axios.post('http://localhost:3001/v1/send-email', {
        to,
        subject,
        text
    })

    log({ category: LogCategory.EMAIL, user: 'system', level: 'info', action: 'Email sent', description: ""})
}