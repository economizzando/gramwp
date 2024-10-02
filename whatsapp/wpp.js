import wwebjs from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = wwebjs;

import sqlite3 from 'sqlite3';
import qrcode from 'qrcode-terminal';
import { promises as fs } from 'fs';
import SmartInterval from 'smartinterval';

const bot = '';
const chats = [
    '120363338832607205@g.us', //João
    '120363322187535013@g.us', //Jefferson
    '120363338618670545@g.us', //Gabs
];

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      args: ['--no-sandbox'],
      headless: true,
      executablePath: '/usr/bin/google-chrome-stable',
    },
  });

client.initialize();

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('qr', qr);
});