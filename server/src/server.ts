import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import 'dotenv/config';
import cors from 'cors';
import cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());
app.use(cors());

const SUPABASE_URL = 'https://grpzctxumndpwdwzgzqt.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycHpjdHh1bW5kcHdkd3pnenF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3Njc3NTUsImV4cCI6MjA1OTM0Mzc1NX0.au6WCg30IA9bx4-5MdapzytvS-AJoet5dFyPOIzHopw';
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const PORT = process.env.PORT || 3000;

const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
const CLIENT_ID = process.env.CLIENT_ID as string;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN as string;
const REDIRECT_URI = process.env.REDIRECT_URI as string;
const SMTP_USER = process.env.SMTP_USER as string;
const SMTP_SERVICE = process.env.SMTP_SERVICE as string;
const SMTP_AUTH_TYPE = process.env.SMTP_AUTH_TYPE as string;
const FROM = 'business-advisory';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

app.post('/v1/send-email', async (req: Request, res: Response) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    res.status(400).send({ message: 'Bad Request', status: 400 });
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
      },
    } as SMTPTransport.Options);

    const mailOptions = {
      from: FROM,
      to,
      subject,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: 'Email sent successful',
      messageId: result.messageId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending email', status: 500 });
  }
});

cron.schedule('0 0 * * *', async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const { data: subscriptions, error } = await supabase
    .from('user_tool_subscriptions')
    .select('*')
    .gte('expires_at', startOfDay.toISOString())
    .lte('expires_at', endOfDay.toISOString());

  if (error) {
    throw new Error('Internal error');
  }

  for (const subscription of subscriptions) {
    await supabase
      .from('user_tool_subscriptions')
      .update({ status: 'inactive' })
      .eq('id', subscription.id);
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.post('/v1/work-hours', async (req: Request, res: Response) => {
  const { to, subject, date: stringDate, userId, by } = req.body;

  const date = new Date(stringDate);

  if (!to || !subject || !date || !by || !userId) {
    res.status(400).send({ message: 'Bad Request', status: 400 });
  }

  try {
    const accessTokenObj = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenObj.token;

    const { data, error } = await supabase
      .from('employee_work_hours')
      .select('*')
      .eq('month_year', `${date.getFullYear()}-0${date.getMonth() + 1}`)
        .eq('client_id', userId);

    if (error) {
      throw new Error('work hours data is null');
    }

    const headers = [
      'Company',
      'Employee',
      'Gross Salary',
      'Absence Days',
      'Medical Leave',
      'Notes',
    ];

    // Map the data to a CSV-friendly format
    const csvData = data.map((item) => [
      item.company_name || '',
      item.employee_name,
      item.gross_salary,
      (item.absence_days || 0).toString(),
      item.medical_leave_date || 'N/A',
      (item.notes || '').replace(/,/g, ';'), // Replace any commas in notes with semicolons to avoid CSV issues
    ]);

    // Combine headers with data
    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.join(',')),
    ].join('\n');

    // Create a Blob with the CSV data
    const csvBuffer = Buffer.from(csvContent, 'utf-8');

    const transporter = nodemailer.createTransport({
      service: SMTP_SERVICE,
      auth: {
        type: SMTP_AUTH_TYPE,
        user: SMTP_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    } as SMTPTransport.Options);

    const mailOptions = {
      from: FROM,
      to,
      subject,
      text: `Monthly work hours report sent by ${by}. 
      `,
      attachments: [
        {
          filename: `${date.toLocaleString('en-US', { month: 'long' }).toLowerCase()}_report.csv`,
          content: csvBuffer,
          contentType: 'text/csv',
        },
      ],
    };

    const result = await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: 'Email sent successful',
      messageId: result.messageId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending email', status: 500 });
  }
});
