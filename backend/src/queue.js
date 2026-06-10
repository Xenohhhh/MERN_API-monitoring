import { Queue } from "bullmq";

const connection = {
    url: process.env.REDIS_URL,
    maxRetriesPerRequest: null,
    tls: {
        rejectUnauthorized: false
    }
};

const monitorQueue = new Queue("monitorQueue", { connection });

export default monitorQueue;
