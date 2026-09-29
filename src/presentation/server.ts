import { CreateJob } from "../config/plugins/cron.plugin.js";
import { CheckService } from "../domain/use-cases/checks/check-service.use-cases.js";
import { FileSystemDatasource } from "../infrastructure/datasources/fyle-system.datasource.js";
import { LogRepositoryImplementation } from "../infrastructure/repositories/log-impl.repository.js";


const fileSystemRepository = new LogRepositoryImplementation(
    new FileSystemDatasource()
);


export class Server {

    static start() {

        CreateJob('*/1 * * * * *', () => {
            const url = 'http://localhost:3000/comments';
            new CheckService(
                fileSystemRepository,
                () => console.log('Success'),
                (error) => console.log(`${url} has an error ${error} `),
            ).execute(url);

        });

    }
}