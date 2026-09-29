import type { EmailService } from "../../../presentation/email/email-service.js";
import { LogEntity, LogSeverityLevel } from "../../entities/Log.entity.js";
import type { LogRepository } from "../../repository/log.repository.js";


interface SendLogEmailUseCase {
    execute: (to: string | string[]) => Promise<boolean>,

}


export class SendEmailLogs implements SendLogEmailUseCase {

    constructor(
        private readonly emailService: EmailService,
        private readonly logRepository: LogRepository
    ) { }

    async execute(to: string | string[]): Promise<boolean> {
        const sent = await this.emailService.sendEmailWithFileSystemLogs(to);

        try {

            if (!sent) {
                throw new Error('Email log was not sent');
            }

            return true;

        } catch (error) {
            const log = new LogEntity(
                {
                    level: LogSeverityLevel.medium,
                    message: 'email was not sent',
                    origin: 'send-email.use-case.ts'
                }
            )

            this.logRepository.saveLog(log);

            console.log(log);

            return false;
        }
    }

}