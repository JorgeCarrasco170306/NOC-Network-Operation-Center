import { LogDatasource } from "../../domain/datasources/log.datasource.js";
import { LogSeverityLevel, LogEntity } from "../../domain/entities/Log.entity.js";
import fs from 'fs';

export class FileSystemDatasource extends LogDatasource {

    private readonly logPath = 'logs/';

    private readonly allLogsPath = 'logs/logs-low.log';
    private readonly mediumLogsPath = 'logs/logs-medium.log';
    private readonly errorLogsPath = 'logs/error-low.log';

    constructor() {
        super();
        this.createLogsFiles();
    }

    private createLogsFiles = () => {
        if (!fs.existsSync(this.logPath)) fs.mkdirSync(this.logPath);

        [
            this.allLogsPath,
            this.mediumLogsPath,
            this.errorLogsPath,
        ].forEach(path => {
            if (!fs.existsSync(path)) {
                fs.writeFileSync(path, '');
            }
        })
    }

    override async saveLog(log: LogEntity): Promise<void> {

        fs.appendFileSync(this.allLogsPath, `${JSON.stringify(log)}\n`);

        if (log.level === LogSeverityLevel.low) return;

        if (log.level === LogSeverityLevel.medium) {
            fs.appendFileSync(this.mediumLogsPath, `${JSON.stringify(log)}\n`);
        } else {
            fs.appendFileSync(this.errorLogsPath, `${JSON.stringify(log)}\n`);
        }
    }
    override getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        switch (severityLevel) {
            case LogSeverityLevel.low:
                return Promise.resolve(this.getLogsFromFile(this.allLogsPath));
            case LogSeverityLevel.medium:
                return Promise.resolve(this.getLogsFromFile(this.mediumLogsPath));
            case LogSeverityLevel.high:
                return Promise.resolve(this.getLogsFromFile(this.errorLogsPath));
            default:
                throw new Error('log severity level not implemented');
        }
    }


    private getLogsFromFile = (path: string): LogEntity[] => {
        const content = fs.readFileSync(path, 'utf-8');
        const logs = content
            .split('\n')
            .filter(Boolean)
            .map(LogEntity.fromJson);

        return logs;

    }
}

