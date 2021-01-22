<template>
  <v-dialog
    v-model="visible"
    width="unset"
    style="overflow:none;"
    overlay-opacity="0.8"
    overlay-color="#000"
  >
    <div class="eqAdd">
      <h2>장비추가하기</h2>

      <div class="select">
        <v-menu>
          <template v-slot:activator="{attrs, on}">
            <v-btn
              v-bind="attrs"
              v-on="on"
              text
            >
              {{eqCate}}
            </v-btn>
          </template>
          <ul class="items">
            <li 
              v-for="item in ['세탁기','건조기','기타장비']" 
              :key="item" 
              v-ripple
              @click="eqCate = item"
            >
              {{item}}
            </li>
          </ul>
        </v-menu>

        <v-menu>
          <template v-slot:activator="{attrs, on}">
            <v-btn
              v-bind="attrs"
              v-on="on"
              text
            >
              {{eqNumber}}
            </v-btn>
          </template>
          <ul class="items">
            <li 
              v-for="item in 20" 
              :key="item" 
              v-ripple
              @click="eqNumber = item + '번'"
            >
              {{ item + '번' }}
            </li>
          </ul>
        </v-menu>

        <v-menu>
          <template v-slot:activator="{attrs, on}">
            <v-btn
              v-bind="attrs"
              v-on="on"
              text
            >
              {{eqPort}}
            </v-btn>
          </template>
          <ul class="items">
            <li 
              v-for="item in availablePorts" 
              :key="item" 
              v-ripple
              @click="eqPort = item"
            >
              포트 {{item}}
            </li>
          </ul>
        </v-menu>
      </div>

      <div class="divider"/>

      <div class="btns">
        <v-btn text class="test" @click="testMachine">테스트</v-btn>
        <v-btn text class="finish" @click="registerMachine">등록완료</v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import AddMachineModalMixin from '../mixins/AddMachineModal';
export default {
  name: 'AddMachineModalH',
  mixins: [AddMachineModalMixin],
}
</script>

<style lang="scss" scoped>
.eqAdd{
  background:#fff;
  border-radius:20px;
  width:600px;
  padding:30px;

  h2{
    margin-bottom:30px;
    font-weight:500;
  }

  .select{
    .v-btn{
      width:100%;
      min-height:60px;
      height:60px;
      font-size:24px;
      border-radius:10px;
      border:2px solid #d2d2d2;
      margin-bottom:20px;
    }
    .v-btn:last-child{margin-bottom:0;}
  }

  .btns{
    display:flex;
    

    .v-btn{
      flex:1;
      height:60px;
      font-size:24px;
      border-radius:0px;
      background:#fff;
      border:2px solid #e2e2e2;
      border-right:0px;

      border-radius:10px 0 0 10px;
    }

    .v-btn.finish{
      flex:1;
      background:#0085DE;
      color:#fff;
      border:0px;
      border-radius:0px 10px 10px 0;
    }
  }

  .divider{
    height:2px;
    background:#e2e2e2;
    margin:30px 0;
  }
}

ul.items{
  margin:0;
  padding:0;
  background:#fff;
  z-index:10;
  max-height:400px;
  overflow-y:auto;
  border:2px solid #d2d2d2;

  li{
    display:flex;
    align-items: center;
    background:#fff;
    height:80px;
    border-bottom:2px solid #d2d2d2;
    font-size:24px;
    padding:0 20px;
  }

  li:nth-child(2n){
    background:#f8f8f8;
  }
  li:last-child{
    border-bottom:0px;
  }
}


</style>