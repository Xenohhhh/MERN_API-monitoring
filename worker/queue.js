import {Queue} from "bullmq"

const monitorQueue = new Queue("monitorQueue", {
    connection: {
        host: "127.0.0.1",
        port: 6379
    }
});

export default monitorQueue;