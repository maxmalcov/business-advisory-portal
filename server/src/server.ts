import express, {Request, Response} from 'express';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import * as SMTPTransport from "nodemailer/lib/smtp-transport";
import 'dotenv/config';
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors())

const PORT = process.env.PORT || 3000;

const CLIENT_SECRET = process.env.CLIENT_SECRET as string
const CLIENT_ID = process.env.CLIENT_ID as string
const REFRESH_TOKEN = process.env.REFRESH_TOKEN as string
const REDIRECT_URI = process.env.REDIRECT_URI as string
const SMTP_USER = process.env.SMTP_USER as string
const SMTP_SERVICE = process.env.SMTP_SERVICE as string
const SMTP_AUTH_TYPE = process.env.SMTP_AUTH_TYPE as string

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

app.post('/v1/send-email', async (req: Request, res: Response) => {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text){
        res.status(400).send({ message: 'Bad Request', status: 400 })
    }

    try {
        const accessTokenObj = await oAuth2Client.getAccessToken();
        const accessToken = accessTokenObj.token;

        const transporter = nodemailer.createTransport({
            service: SMTP_SERVICE,
            auth: {
                type: SMTP_AUTH_TYPE,
                user: SMTP_USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            }
        } as SMTPTransport.Options);

        const mailOptions = {
            from: SMTP_USER,
            to,
            subject,
            text,
        };

        const result = await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successful', messageId: result.messageId });
    } catch (error) {
        res.status(500).json({ error: 'Error sending email', status: 500 });
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
