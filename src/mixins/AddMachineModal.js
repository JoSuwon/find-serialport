import { mapActions, mapState } from "vuex";

export default {
  data(){
    return{
      visible:false,
      eqCate: '장비카테고리 선택',
      eqNumber: '장비번호 선택',
      eqPort: '포트번호 선택',
    }
  }, 
  watch: {
    visible(newValue) {
      if(newValue) {
        this.eqCate = '장비카테고리 선택';
        this.eqNumber = '장비번호 선택';
        this.eqPort = '포트번호 선택';
      }
    },
  },
  computed: {
    ...mapState({
      companyId: state => state.company.id,
      machines: state => state.machines,
    }),
    alreadyUsingPorts() {
      return this.machines.map(machine => {
        return parseInt(machine.mac.split(':')[1], 10);
      });
    },
    availablePorts() {
      return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].filter(item => {
        return !this.alreadyUsingPorts.includes(item);
      });
    }
  },
  methods:{
    ...mapActions({
      createMachine: 'createMachine',
    }),
    open(value) {
      this.visible = value;
    },
    testMachine() {
      if(this.eqCate !== '장비카테고리 선택' && this.eqNumber !== '장비번호 선택' && this.eqPort !== '포트번호 선택') {
        this.$device.insert(this.eqPort, 500);
      }
    },
    async registerMachine() {
      if(this.eqCate !== '장비카테고리 선택' && this.eqNumber !== '장비번호 선택' && this.eqPort !== '포트번호 선택') {
        const name = `${this.eqNumber} ${this.eqCate}`;
        const category = this.eqCate;
        const mac = `${this.companyId}:${this.eqPort}`;

        try {
          this.$modal.progress(true, { title: '장비를 등록 중 입니다', message: '잠시만 기다려 주세요' });
          await this.createMachine({ name, category, mac });
        } catch (error) {
          this.$modal.alert('alert', '장비등록에 실패하였습니다', '확인 후 시도해주세요');
        } finally {
          this.visible = false;
          await this.$modal.progress(false);
        }
      }
    },
  },
}