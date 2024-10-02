import wwebjs from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = wwebjs;

import sqlite3 from 'sqlite3';
import qrcode from 'qrcode-terminal';
import { promises as fs } from 'fs';
import SmartInterval from 'smartinterval';

import { chatJoao, chatJefferson, chatGabs } from './chats.js';