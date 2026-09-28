import { CronJob } from 'cron';

type CronTime = string | Date;
type OnTick = () => void;

export const CreateJob = (cronTime: CronTime, onTick: OnTick) => {
    let job = new CronJob(cronTime, onTick);

    job.start();

}