import { Server } from "./presentation/server.js";

(async () => { await main(); })();

async function main() {
    Server.start();
}