import dotenv from 'dotenv';
import { Client } from './Class/client';
dotenv.config();

const client = new Client(process.env.ORANGE_HOSTNAME ?? '192.168.1.1', process.env.ORANGE_USERNAME ?? '', process.env.ORANGE_PASSWORD ?? '');

client.getSystemInfo()