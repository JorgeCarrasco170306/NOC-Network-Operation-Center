import { Server } from "./presentation/server.js";
import 'dotenv/config';

(async () => { await main(); })();

async function main() {
    // console.log(process.env['PORT']);
    await Server.start();
}
