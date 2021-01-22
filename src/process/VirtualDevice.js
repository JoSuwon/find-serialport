import SerialPort from 'serialport';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

// const PORT_PATH = process.env.VIRTUAL_DEVICE_SERIAL_PATH;
const PORT_PATH = 'COM20';
// const baudRate = parseInt(process.env.VIRTUAL_DEVICE_SERIAL_BOARDRATE);
const baudRate = 9600;
export const port = new SerialPort(PORT_PATH, { baudRate, autoOpen: true });

// const INSERT_OFFSET_DELAY = parseInt(process.env.VIRTUAL_DEVICE_INSERT_OFFSETDELAY, 10);
const INSERT_OFFSET_DELAY = 500;

function offsetHexString(start, count = 1) {
  return String.fromCharCode(start + count - 1).toString();
}

export async function insert(index, amount) {
  // 오류: 장치가 20개가 넘어가는 경우
  if (index > 20) throw new Error('Too many Device Index Error');
  // 오류: 금액이 음수이거나 500원 이하일 경우
  if (parseInt(amount, 10) < 500) throw new Error('Invalide Input Amount');

  const isValideAmount = Math.floor(parseInt(amount, 10) % 500) === 0;
  // 오류: 투입하려는 금액이 500원 단위가 아닌 경우
  if (!isValideAmount) throw new Error('Invalide Input Amount');

  const times = Math.ceil(parseInt(amount, 10) / 500);
  // 오류: 투입하려는 금액이 10000원 초과일 경우
  if (times > 22) throw new Error('Too many Input Amount');
  const cmd = new Array(3).fill('').reduce(acc => {
    const deviceString = offsetHexString(97, parseInt(index, 10));
    const amountString = offsetHexString(65, times);
    return acc + deviceString + amountString;
  }, '');
  port.write(`${cmd}\r\n`);

  await of(null)
    .pipe(delay(INSERT_OFFSET_DELAY * times))
    .toPromise();

  return { index, amount };
}

