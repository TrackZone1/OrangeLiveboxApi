import "dotenv/config";
import { ClientOrange } from "../Class/client";

const client = new ClientOrange(
    process.env.ORANGE_HOSTNAME ?? "192.168.1.1",
    process.env.ORANGE_USERNAME ?? "admin",
    process.env.ORANGE_PASSWORD ?? ""
);

/*const systemInfo = await client.getSystemInfoDevice();
console.log(systemInfo);*/

//console.log(await client.getPortForwarding());
console.log(
    await client.setPortForwarding(
        "123",
        80,
        80,
        "123Server",
        true,
        true,
        "6,17",
        "",
        "data",
        "",
        "cloudflare"
    )
);
//console.log(await client.deletePortForwarding("123"));
