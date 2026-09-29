import { CreateJob } from "../config/plugins/cron.plugin.js";
import { CheckService } from "../domain/use-cases/checks/check-service.use-cases.js";
import { FileSystemDatasource } from "../infrastructure/datasources/fyle-system.datasource.js";
import { LogRepositoryImplementation } from "../infrastructure/repositories/log-impl.repository.js";
import { EmailService } from "./email/email-service.js";


const fileSystemRepository = new LogRepositoryImplementation(
    new FileSystemDatasource()
);


export class Server {

    static async start() {

        CreateJob('*/1 * * * * *', () => {
            const url = 'http://localhost:3000/comments';
            void new CheckService(
                fileSystemRepository,
            ).execute(url);

        });

        const emailService = new EmailService(fileSystemRepository);

        await emailService.sendEmailWithFileSystemLogs(
            ['jorgeydiego1729@gmail.com', 'jorgedev1729@hotmail.com', 'diegomatosozuna1@gmail.com', 'yermana@hotmail.com'],
        );
    }
}