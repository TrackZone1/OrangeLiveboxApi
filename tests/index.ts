import dotenv from "dotenv";
import { ClientOrange } from "../Class/client";
dotenv.config();

const client = new ClientOrange(
    process.env.ORANGE_HOSTNAME ?? "192.168.1.1",
    process.env.ORANGE_USERNAME ?? "admin",
    process.env.ORANGE_PASSWORD ?? ""
);

console.log(await client.getPortForwarding());
//console.log(await client.setPortForwarding("123", 80, 80, "123Server"));
//console.log(await client.deletePortForwarding("123"));
