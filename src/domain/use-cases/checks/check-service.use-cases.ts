import { LogEntity, LogSeverityLevel } from "../../entities/Log.entity.js";
import type { LogRepository } from "../../repository/log.repository.js";

interface CheckServiceUseCase {
    execute: (url: string) => Promise<boolean>,
}

type SuccessCallback = () => void;
type ErrorCallback = (error: string) => void;

export class CheckService implements CheckServiceUseCase {

    constructor(
        private readonly logRepository: LogRepository,
        private readonly successCallback?: SuccessCallback,
        private readonly errorCallback?: ErrorCallback,
    ) { }

    async execute(url: string): Promise<boolean> {

        try {
            const req = await fetch(url);
            if (!req.ok) throw new Error(`Error on check service ${url}`);

            const newLog = new LogEntity({
                level: LogSeverityLevel.low,
                message: 'Service working',
                origin: 'check-service.ts'
            });
            this.logRepository.saveLog(newLog);
            this.successCallback?.();
            return true;

        } catch (error) {
            const newLog = new LogEntity({
                level: LogSeverityLevel.high,
                message: 'Service is not worning',
                origin: 'check-service.ts'
            });
            this.logRepository.saveLog(newLog);
            this.errorCallback?.(`${error}`)
            return false;
        }

    }

}

