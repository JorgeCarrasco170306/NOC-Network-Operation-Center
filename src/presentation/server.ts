import { CreateJob } from "../config/plugins/cron.plugin.js";
import { CheckService } from "../domain/use-cases/checks/check-service.use-cases.js";

export class Server {
    static start() {

        CreateJob('*/5 * * * * *', () => {

            new CheckService().execute('https://google.com');

        });

    }
}