import { ipcMain } from 'electron';
import serialport from 'serialport';
import InterByteTimeoutParser from '@serialport/parser-inter-byte-timeout';
import fs from 'fs';
import pathModule from 'path';
import util from 'util';

const SMARTRO_PATH = pathModule.join('C:', 'kiosk', 'smartro');
const hasDirectory = path => util.promisify(fs.stat)(path);
const createDirectory = path => util.promisify(fs.mkdir)(path, { recursive: true });

let serialportList = [];

(async function() {
  serialportList = await (await serialport.list()).map(({ path }) => path);

  console.log(serialportList);
})();

ipcMain.handle('serialport-list', (event) => {
  console.log('handle serialport-list', serialportList);
  event.sender.send('sendList', serialportList);
});

// 보드 테스트
ipcMain.handle('boardTest', async (event, path) => {
  const port = new serialport(path, {
    baudRate: 9600,
  });
  port.on('error', (err) => {
    console.log(err);
  });

  await boardTest(port);
  port.close();
  console.log('port closing!');
});

// let complete = false;

// 지폐기 테스트
ipcMain.handle('cashTest', async (event, path) => {
  const port = new serialport(path, {
    baudRate: 9600,
  });
  const parser = port.pipe(new serialport.parsers.ByteLength({ length: 5 }));
  let complete = false;
  parser.on('data', data => {
    if(complete) return;
    port.close();
    parser.removeAllListeners('data');
    console.log('port closing!');
    event.sender.send('cash-finish', true);
    complete = true;
  });
  port.write(Buffer.from([0x06, 0x20, 0x21, 0x52, 0x55]));

  await delay(3000);
  if(!complete) {
    port.close();
    parser.removeAllListeners('data');
    console.log('port closing!');
    event.sender.send('cash-finish', false);
  }
});

// 카드기 테스트
ipcMain.handle('cardTest', async (event, path) => {
  const port = new serialport(path, {
    baudRate: 115200,
  });
  const parser = port.pipe(new InterByteTimeoutParser({ interval: 10 }));
  let complete = false;

  parser.on('data', data => {
    const tid = bytesParser(data);
    if(complete) return;
    port.close();
    parser.removeAllListeners('data');
    console.log('port closing!');
    event.sender.send('card-finish', true, tid);
    complete = true;

    hasDirectory(SMARTRO_PATH)
      .catch(() => createDirectory(SMARTRO_PATH))
      .finally(() => {
        fs.writeFileSync(pathModule.join(SMARTRO_PATH, 'tid'), tid);
      });
  });

  await delay(5000);
  if(!complete) {
    port.close();
    parser.removeAllListeners('data');
    console.log('port closing!');
    event.sender.send('card-finish', false);
  }
});







async function boardTest(port) {
  port.write(`aAaAaA\r\n`);
  await delay(500);
  port.write(`bAbAbA\r\n`);
  await delay(500);
  port.write(`cAcAcA\r\n`);
  await delay(500);
  port.write(`dAdAdA\r\n`);
  await delay(500);
  port.write(`eAeAeA\r\n`);
  await delay(500);
  port.write(`fAfAfA\r\n`);
  await delay(500);
  port.write(`gAgAgA\r\n`);
  await delay(500);
  port.write(`hAhAhA\r\n`);
  await delay(500);
  port.write(`iAiAiA\r\n`);
  await delay(500);
  port.write(`jAjAjA\r\n`);
  await delay(500);
  port.write(`kAkAkA\r\n`);
  await delay(500);
  port.write(`lAlAlA\r\n`);
  await delay(500);
  port.write(`mAmAmA\r\n`);
  await delay(500);
  port.write(`nAnAnA\r\n`);
  await delay(500);
  port.write(`oAoAoA\r\n`);
  await delay(500);
  port.write(`pApApA\r\n`);
  await delay(500);
  port.write(`qAqAqA\r\n`);
  await delay(500);
  port.write(`rArArA\r\n`);
  await delay(500);
  port.write(`sAsAsA\r\n`);
  await delay(500);
  port.write(`tAtAtA\r\n`);
  await delay(500);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function bytesParser(bytes) {
  const isValide = bytes[bytes.length - 1] === checksum(bytes.slice(0, -1));
  if (!isValide) return null;

  return bytes.slice(1, 17).toString().trim();
  // const { tid, datetime, jobcode, data } = headerParser(bytes);
  // const { type, convert } = RESPONSE_CODE[jobcode];

  // return { tid, jobcode, datetime, type, data: convert(data) };
}

export function checksum(byteArray) {
  return byteArray.reduce((acc, byte) => {
    if (acc === null) {
      return byte;
    }
    return acc ^ byte;
  }, null);
}