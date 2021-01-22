import { ipcMain } from 'electron';
import { insert as deviceInsert } from './VirtualDevice';


ipcMain.handle('device:insert', async (_, index, amount) => {
  console.log('장비에 금액 넣기', index, amount);
  deviceInsert(index, amount);
});