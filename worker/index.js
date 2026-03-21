import monitorQueue from "./queue.js";

async function addJob() {
  await monitorQueue.add("monitorQueue", {
    monitorId: "69a33a457846bd902d890365", 
  });

  console.log("Monitor job added!");
}

addJob();