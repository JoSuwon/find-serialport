import Vue from "vue";
import Vuex from "vuex";

import { sortBy } from 'lodash';
import { coreAPI, request } from '../plugins/axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    company: {},
    kiosk: {},
    machines: [],
  },
  mutations: {
    SET_COMPANY(state, value) {
      state.company = value;
    },
    SET_KIOSK(state, value) {
      state.kiosk = value;
    },
    SET_MACHINES(state, values) {
      state.machines = sortBy(values, ['category', 'sort', 'id']);
    },
  },
  actions: {
    async getKioskConfig({ commit }, { companyId }) {
      const { data } = await request({
        method: 'GET',
        url: `/${companyId}`,
      });
      const { company, kiosk, machines } = data;
      commit('SET_COMPANY', company);
      commit('SET_KIOSK', kiosk);
      commit('SET_MACHINES', machines);
    },
    async createMachine({ state, dispatch }, { name, category, mac }) {
      const companyId = state.company.id;
      const { data } = await coreAPI({
        method: 'POST',
        url: `/add`,
        data: { companyId, name, mac, category },
      });
      dispatch('getKioskConfig', { companyId: state.company.id });

      return data;
    },
    async deleteMachine({ state, dispatch }, { machineId }) {
      const { data } = await coreAPI({
        method: 'DELETE',
        url: `/${machineId}`,
      });
      dispatch('getKioskConfig', { companyId: state.company.id });

      return data;
    },
  },
  modules: {}
});
