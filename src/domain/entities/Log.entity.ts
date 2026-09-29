
export interface LogEntityOptions {
    origin: string,
    level: LogSeverityLevel,
    message: string,
    createdAt?: Date;
}


export enum LogSeverityLevel {
    low = 'low',
    medium = 'medium',
    high = 'high'
}

export class LogEntity {    

    public level: LogSeverityLevel;
    public message: string;
    public origin: string;
    public createdAt: Date;

    constructor(
        options: LogEntityOptions
    ) {
        const { origin, level, message, createdAt = new Date() } = options;
        this.origin = origin
        this.level = level;
        this.message = message;
        this.createdAt = createdAt;
    }

    static fromJson = (json: string): LogEntity => {
        const { level, message, createdAt, origin } = JSON.parse(json);

        const log = new LogEntity({
            level,
            message,
            origin,
            createdAt,
        });
        log.createdAt = new Date(createdAt);

        return log;

    }
}