<template>
  <div>
    <v-dialog v-model="visible" width="unset" overlay-opacity="0.8" persistent>
      <div class="progressBoxHorizontal">
        <v-progress-circular
          indeterminate
          size="80"
          width="8"
          color="#EC1F72"
          style="margin-bottom:30px;"
        />
        <h4>{{ form.title || '로딩 중 입니다' }}</h4>
        <p>{{ form.message || '잠시만 기다려주세요' }}</p>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'ProgressModal',
  data() {
    return {
      visible: false,
      form: {
        title: null,
        message: null,
      }
    };
  },
  methods: {
    show(visible, form = { title: null, message: null }) {
      this.visible = visible;
      this.form = form;
    },
    close() {
      this.visible = false;
    }
  },
}
</script>

<style lang="scss">
.progressBoxHorizontal {
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 15px;
  padding: 30px 60px;
  
  h4 {
    font-size: 32px;
    font-weight: 500;
  }
  p {
    font-size: 20px;
    margin-top: 5px;
    color: #888;
  }
}
</style>