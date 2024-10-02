import { TelegramClient, Api } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { NewMessage, NewMessageEvent } from 'telegram/events/index.js';
import { promises as fs } from 'fs';
import { apiId, apiHash, stringSession, phoneNumber } from './credentials.js';
import input from 'input';
import { uuid } from 'uuidv4';

import sqlite3 from 'sqlite3';
