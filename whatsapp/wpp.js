import wwebjs from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = wwebjs;

import sqlite3 from 'sqlite3';
import qrcode from 'qrcode-terminal';
import { promises as fs } from 'fs';
import SmartInterval from 'smartinterval';

const chats = [
    '120363338832607205@g.us', //João
    '120363322187535013@g.us', //Jefferson
    '120363338618670545@g.us', //Gabs
];

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      args: ['--no-sandbox',
        '--disable-setuid-sandbox'
      ],
      headless: true,
      executablePath: '/usr/bin/google-chrome-stable',
    },
  });

client.initialize();

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('qr', qr);
});

client.on('ready', async () => {
    console.log('Client is ready!');
    console.log('whatsapp_id', client.info.wid.user);
  
    let interval = new SmartInterval(async () => {
      await sendMedia();
    }, 5000);
  
    interval.start();
});

async function sendMedia() {
    let db = new sqlite3.Database('../db/db.sqlite3', (err) => {
      if (err) {
        console.error(err.message);
      }
    });
  
    db.serialize(() => {
      db.each('SELECT * FROM media WHERE is_sent = 0', async (err, row) => {
        if (err) {
          console.error(err.message);
        }
        const media = MessageMedia.fromFilePath(row.path);
        const caption = row.caption;

        for (let i in chats) {
            await client.sendMessage(chats[i], media, {
                caption: caption,
              });

            console.log('Mensagem enviada para ', chats[i]);
        }

      });
      db.run('UPDATE media SET is_sent = 1 WHERE is_sent = 0', async (err) => {
        if (err) {
          console.error(err.message);
        }
      });
    });
  
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
    });
  }