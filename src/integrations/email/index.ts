import axios from "axios"

export async function sendEmail(to: string, subject: string, text: string){
    await axios.post('http://localhost:3001/v1/send-email', {
        to,
        subject,
        text
    })
}