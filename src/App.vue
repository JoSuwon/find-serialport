<template>
  <v-app>
    <router-view />

    <AlertModal ref="alert" />
    <ConfirmModal ref="confirm" />
    <ProgressModal ref="progress" />
  </v-app>
</template>

<script>
import AlertModal from './components/AlertModal';
import ConfirmModal from './components/ConfirmModal';
import ProgressModal from './components/ProgressModal';

import { ModalEventBus } from './plugins/global-modal';

export default {
  name: "App",
  components: {
    AlertModal,
    ConfirmModal,
    ProgressModal,
  },
  mounted() {
    this.initialModal();
  },
  methods: {
    initialModal() {
      ModalEventBus.$on('alert', this.$refs.alert.show);
      ModalEventBus.$on('confirm', this.$refs.confirm.show);
      ModalEventBus.$on('progress', this.$refs.progress.show);
    }
  }
};
</script>
