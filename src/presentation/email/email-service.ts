import nodemailer from 'nodemailer';
import { existsSync } from 'node:fs';
import { envs } from '../../config/plugins/env.plugin.js';
import type { LogRepository } from '../../domain/repository/log.repository.js';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/Log.entity.js';

interface SendMailOptions {
    to: string | string[],
    subject: string,
    htmlBody: string,
    attachments?: Attachment[];
}

interface Attachment {
    fileName: string,
    path: string
}

// TODO: attachments
export class EmailService {

    constructor(private readonly logRepository: LogRepository) { }

    private transporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY
        }
    })


    async sendEmail(options: SendMailOptions): Promise<boolean> {
        try {
            const { to, subject, htmlBody, attachments = [] } = options;

            const sentInformation = await this.transporter.sendMail({ attachments, to, subject, html: htmlBody })

            const log = new LogEntity({
                level: LogSeverityLevel.low,
                message: 'Email Sent',
                origin: 'email.service.ts'
            })

            await this.logRepository.saveLog(log);

            console.log(sentInformation)

            return true;

        } catch (error) {
            const log = new LogEntity({
                level: LogSeverityLevel.medium,
                message: 'Email was not sent',
                origin: 'email.service.ts'
            });

            await this.logRepository.saveLog(log);
            console.error('No se pudo enviar el correo:', error)
            return false;
        }
    }


    async sendEmailWithFileSystemLogs(to: string | string[]): Promise<boolean> {
        const subject = `Logs del servidor`;
        const htmlBody = `
        <h3>Logs del sistema - NOC</h3>
        <p>Ver Logs adjuntos</p>
        `

        const attachments: Attachment[] = [
            { fileName: 'logs-low.log', path: './logs/logs-low.log' },
            { fileName: 'logs-medium.log', path: './logs/logs-medium.log' },
            { fileName: 'logs-high.log', path: './logs/logs-high.log' }
        ].filter(({ path }) => existsSync(path));

        return await this.sendEmail({ to, subject, htmlBody, attachments });

    }

}