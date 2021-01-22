import { ipcRenderer } from 'electron';
import Vue from 'vue';

Vue.prototype.$device = {
  insert: (index, amount) => ipcRenderer.invoke('device:insert', index, amount),
};