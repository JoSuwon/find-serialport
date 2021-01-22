import axios from 'axios';

export const request = axios.create({
  baseURL: 'http://kiosk.coin-machine.com/kiosk',
  timeout: 2000,
});

export const coreAPI = axios.create({
  baseURL: 'http://core.coin-machine.com/device',
  timeout: 1000,
});