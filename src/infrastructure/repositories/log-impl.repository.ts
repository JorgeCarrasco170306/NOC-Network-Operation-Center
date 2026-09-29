import type { LogDatasource } from "../../domain/datasources/log.datasource.js";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/Log.entity.js";
import { LogRepository } from "../../domain/repository/log.repository.js";

export class LogRepositoryImplementation extends LogRepository {

    constructor(
        private readonly logDatasource: LogDatasource
    ) {
        super();
    }

    override saveLog(log: LogEntity): Promise<void> {
        return this.logDatasource.saveLog(log);
    }
    override getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        return this.logDatasource.getLogs(severityLevel);
    }
}