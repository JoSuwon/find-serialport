<template>
  <div class="home pa-5">
    <!-- <h2>연결된 시리얼 포트 : {{ portList }}</h2> -->
    <h2>지폐기 : {{ cashPort }}</h2>
    <h2>카드기 : {{ cardPort }}</h2>
    <h2>TID : {{ cardTID }}</h2>
    <div class="cashTest my-5" v-if="!isChecking">
      <v-btn
        class="mx-3"
        v-for="port in serialportList"
        :key="port.id"
        color="primary"
        @click="cashTest(port)"
        depressed
        :disabled="isChecking"
      >
        <template v-if="!isChecking">
          {{ port }} 지폐기 테스트
        </template>
        <template v-else>
          테스트 중입니다.
        </template>
      </v-btn>
    </div>
    <div class="cardTest my-5" v-if="!isChecking">
      <v-btn
        class="mx-3"
        v-for="port in serialportList"
        :key="port.id"
        color="primary"
        @click="cardTest(port)"
        depressed
        :disabled="isChecking"
      >
        <template v-if="!isChecking">
          {{ port }} 카드기 테스트
        </template>
        <template v-else>
          테스트 중입니다.
        </template>
      </v-btn>
    </div>
    <div class="boardTest my-5" v-if="!isChecking">
      <v-btn 
        class="mx-3" 
        v-for="port in serialportList" 
        :key="port.id" 
        color="primary" 
        @click="boardTest(port)"
        depressed
        :disabled="isChecking"
      >
        <template v-if="!isChecking">
          {{ port }} 보드 테스트
        </template>
        <template v-else>
          테스트 중입니다.
        </template>
      </v-btn>
    </div>
    <div v-if="isChecking" class="pa-10">
      <h1>포트를 확인중입니다...</h1>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
  name: "Home",
  data() {
    return {
      serialportList: [],
      isChecking: false,
      clickedPort: '',
      cashPort: null,
      cardPort: null,
      cardTID: null,
      checkMessage: '',
    };
  },
  computed: {
    portList() {
      return this.serialportList.join(', ');
    }
  },
  mounted() {
    ipcRenderer.invoke("serialport-list");
    ipcRenderer.on("sendList", this.sendList);
  },
  methods: {
    sendList(event, list) {
      this.serialportList = list;
    },
    boardTest(port) {
      this.clickedPort = port;
      this.isChecking = true;
      setTimeout(() => {
        this.isChecking = false;
      }, 12000);
      ipcRenderer.invoke('boardTest', port);
    },
    cashTest(port) {
      this.clickedPort = port;
      this.isChecking = true;
      ipcRenderer.invoke('cashTest', port);
      ipcRenderer.on('cash-finish', this.cashFinish);
    },
    cashFinish(event, isThis) {
      if(isThis) {
        // alert(this.clickedPort + ' 지폐기 입니다.');
        this.isChecking = false;
        this.cashPort = this.clickedPort;
      } else {
        // alert(this.clickedPort + ' 지폐기가 아닙니다.');
        this.isChecking = false;
      }
    },
    cardTest(port) {
      this.clickedPort = port;
      this.isChecking = true;
      ipcRenderer.invoke('cardTest', port);
      ipcRenderer.on('card-finish', this.cardFinish);
    },
    cardFinish(event, isThis, tid) {
      console.log(isThis, tid);
      // const { isThis, tid = null } = value;
      if(isThis) {
        // alert(this.clickedPort + ' 카드기 입니다. TID : ' + tid);
        this.isChecking = false;
        this.cardPort = this.clickedPort;
        this.cardTID = tid;
      } else {
        // alert(this.clickedPort + ' 카드기가 아닙니다.');
        this.isChecking = false;
      }
    },
  },
  beforeDestroy() {
    ipcRenderer.removeListener('sendList', this.sendList);
    ipcRenderer.removeListener('card-finish', this.cardFinish);
    ipcRenderer.removeListener('cash-finish', this.cashFinish);
  },
};
</script>
