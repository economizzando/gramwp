import wwebjs from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = wwebjs;

import sqlite3 from 'sqlite3';
import qrcode from 'qrcode-terminal';
import { promises as fs } from 'fs';
import SmartInterval from 'smartinterval';

const groups = [
  { name: 'Grupo DualSense',
    group_id: '120363419218299953@g.us' //PD.Cancelados Playstation
  },
  {
    name: 'Grupo Switch 2',
    group_id: '120363402219130428@g.us' //PD.Cancelados Nintendo
  }
  //'120363399726344898@g.us', //DG Pré-vendas #23
    //'120363415740914277@g.us', //DG Pré-vendas
]

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
        const groupName = row.group_name;
        
        const group = groups.find(g => g.name === groupName);
        const groupId = group.group_id;
    
        await client.sendMessage(groupId, media, {
          caption: caption,
        });

        console.log('Mensagem enviada para ', groupName);
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