import { mapActions, mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      machines: state => state.machines,
      companyId: state => state.company.id,
    }),
    setMachines() {
      return this.machines.map(machine => { 
        const { category, mac, name, id } = machine;
        const [,port] = mac.split(':');
        const [num,] = name.split(' ');
        return { category, port, num, id };
      });
    },
  },
  methods:{
    ...mapActions({
      deleteMachineAction: 'deleteMachine',
      getKioskConfig: 'getKioskConfig',
    }),
    addMachineModalOpen() {
      this.$refs.addMachineModal.open(true);
    },
    async deleteMachine(id) {
      const machine = this.machines.find(({ id: machineId }) => machineId === id);
      const { name, id: machineId } = machine;
      const isDelete = await this.$modal.confirm(
        {
          title: name,
          message: '정말로 삭제 하시겠습니까 ?',
        },
        { okTitle: '확인', cancelTitle: '취소' }
      );
      
      if(!isDelete) return;

      try {
        this.$modal.progress(true, { title: '장비를 삭제 중 입니다', message: '잠시만 기다려 주세요' });
        await this.deleteMachineAction({ machineId });
      } catch(err) {
        this.$modal.alert('alert', '장비삭제에 실패하였습니다', '확인 후 시도해주세요');
      } finally {
        this.$modal.progress(false);
      }
    },
  },
}