import { TelegramClient, Api } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { NewMessage, NewMessageEvent } from 'telegram/events/index.js';
import { promises as fs } from 'fs';
import { apiId, apiHash, stringSession, phoneNumber } from './credentials.js';
import input from 'input';
import { uuid } from 'uuidv4';

import sqlite3 from 'sqlite3';

(async () => {
    const client = new TelegramClient(
      new StringSession(stringSession),
      apiId,
      apiHash,
      {
        connectionRetries: 10,
      },
    );
    await client.start({
      // phoneNumber: '+5564999859851',
      // password: async () => await input.text("Please enter your password: "),
      // phoneCode: async () =>
      // await input.text('Please enter the code you received: '),
      // onError: (err) => console.log(err),
    });
    console.log('You should now be connected.');
    //console.log(client.session.save()); // Save this string to avoid logging in again
  
    async function onMessage(event) {
      
    }
  
    client.addEventHandler(onMessage, new NewMessage({}));
  })();
