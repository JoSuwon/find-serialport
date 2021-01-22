<template>
  <div class="home pa-5">
    <!-- <h2>연결된 시리얼 포트 : {{ portList }}</h2> -->
    <h1 class="head"> <v-icon color="white" size="50">mdi-usb-port</v-icon> 시리얼 포트 찾기 및 장비 설정 </h1>
    <!-- <h2>지폐기 : {{ cashPort }}</h2>
    <h2>카드기 : {{ cardPort }}</h2>
    <h2>TID : {{ cardTID }}</h2> -->
    <div class="cashTest my-5">
      <h2 class="my-3" v-if="cashPort">
        <v-icon color="white" size="30" class="mr-3">mdi-cash</v-icon>
        지폐기 포트 번호 : {{ cashPort }}
        <span v-if="cashPort !== 'COM21'" style="color: #ee2073;">
          (COM21으로 변경해주세요 !)
        </span>
      </h2>
      <v-btn
        class="mx-3"
        v-for="port in serialportList"
        :key="port.id"
        color="primary"
        @click="cashTest(port)"
        depressed
      >
        <template v-if="!isChecking">
          {{ port }} 지폐기 테스트
        </template>
        <template v-else>
          테스트 중입니다.
        </template>
      </v-btn>
    </div>
    <div class="cardTest my-5">
      <h2 class="my-3" v-if="cardPort">
        <v-icon color="white" size="30" class="mr-3">mdi-credit-card-outline</v-icon>
        카드기 포트 번호 : {{ cardPort }}
        <span v-if="cardPort !== 'COM22'" style="color: #ee2073;">
          (COM22으로 변경해주세요 !)
        </span>
      </h2>
      <v-btn
        class="mx-3"
        v-for="port in serialportList"
        :key="port.id"
        color="primary"
        @click="cardTest(port)"
        depressed
      >
        <template v-if="!isChecking">
          {{ port }} 카드기 테스트
        </template>
        <template v-else>
          테스트 중입니다.
        </template>
      </v-btn>
    </div>
    <!-- <div class="boardTest my-5">
      <h2 class="my-3">
        <v-icon color="white" size="30" class="mr-3">mdi-alert</v-icon>
        보드 테스트시 모든장비에 500원씩 투입됨
        <br />
      </h2>
      <v-btn 
        class="mx-3" 
        v-for="port in serialportList" 
        :key="port.id" 
        color="primary" 
        @click="boardTest(port)"
        depressed
      >
        <template v-if="!isChecking">
          {{ port }} 보드 테스트
        </template>
        <template v-else>
          테스트 중입니다.
        </template>
      </v-btn>
    </div> -->
    <!-- <div v-if="isChecking" class="pa-10">
      <h1>포트를 확인중입니다...</h1>
    </div> -->
    <div class="numPad">
      <h2>COMPANY_ID : {{ companyId }}</h2>
      <div v-for="(numbers, rowindex) in num_pad" :key="rowindex">
        <v-btn v-for="number in numbers" :key="number" class="ma-2 numPadBtn" @click="companyId+=number">
          {{ number }}
        </v-btn>
      </div>
      <v-btn class="ma-2 numPadBtn" @click="companyId = companyId.slice(0, -1)">
        <v-icon size="30">mdi-arrow-left</v-icon>
      </v-btn>
      <v-btn class="ma-2 numPadBtn" @click="companyId+=0">
        0
      </v-btn>
      <v-btn class="ma-2 numPadBtn" @click="companyId = ''">
        초기화
      </v-btn>
      <br>
      <v-btn class="ma-2 submit" @click="goMachineSetting">
        장비설정 이동
      </v-btn>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapActions } from 'vuex';

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
      companyId: '',
      num_pad: [
        [1,2,3],
        [4,5,6],
        [7,8,9],
      ]
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
    ...mapActions({
      getKioskConfig: 'getKioskConfig',
    }),
    sendList(event, list) {
      this.serialportList = list;
    },
    boardTest(port) {
      this.clickedPort = port;
      this.isChecking = true;
      this.$modal.progress(true, { title: '보드 테스트 중 입니다', message: '잠시만 기다려 주세요' });
      setTimeout(() => {
        this.isChecking = false;
        this.$modal.progress(false);
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
      this.$modal.progress(true, { title: '카드기 테스트 중 입니다', message: '카드를 투입해 주세요' });
      ipcRenderer.invoke('cardTest', port);
      ipcRenderer.on('card-finish', this.cardFinish);
    },
    cardFinish(event, isThis, tid) {
      this.$modal.progress(false);
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
    async goMachineSetting() {
      const { companyId } = this;
      await this.getKioskConfig({ companyId });
      this.$router.push({ name: 'MachineSetting' });
    }
  },
  beforeDestroy() {
    ipcRenderer.removeListener('sendList', this.sendList);
    ipcRenderer.removeListener('card-finish', this.cardFinish);
    ipcRenderer.removeListener('cash-finish', this.cashFinish);
  },
};
</script>

<style lang="scss" scoped>
.home {
  background: #373B40;
  color: #fff;
  height: 100vh;
  width: 100vw;
  .head {
    text-align: center;
  }
  .cashTest {
    .v-btn {
      width: 200px;
      height: 50px;
      font-size: 18px;
    }
  }
  .cardTest {
    .v-btn {
      width: 200px;
      height: 50px;
      font-size: 18px;
    }
  }
  .boardTest {
    .v-btn {
      width: 200px;
      height: 50px;
      font-size: 18px;
    }
  }
  .numPad {
    border: 2px white solid;
    border-radius: 30px;
    margin: 50px auto;
    width: 400px;
    padding: 20px;
    background: #0085de;
    h2{
      border: 2px black solid;
      height: 50px;
      border-radius: 15px;
      padding-left: 15px;
      margin-bottom: 15px;
      padding-top: 2px;
      background: #7ab341;
    }
    .numPadBtn {
      width: 100px;
      height: 60px;
      border-radius: 20px;
      font-size: 25px;
    }
    .submit {
      width: 332px;
      height: 70px;
      background: #ee2073;
      color: #fff;
      font-size: 30px;
    }
  }
}
</style>