import monitorQueue from "./queue.js";

async function addJob() {
  await monitorQueue.add("test-job", {
    message: "test job",
  });

  console.log("Job added!");
}

addJob();