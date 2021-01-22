<template>
  <div>
    <v-dialog v-model="visible" width="unset" overlay-opacity="0.8">
      <div class="confirmHorizontal">
        <h4>{{ form.title }}</h4>
        <p>{{ form.message }}</p>
        <div class="btns">
          <v-btn text class="cancle" @click="done(false)">
            {{ options.cancelTitle }}
          </v-btn>
          <v-btn text class="finish" @click="done(true)">
            {{ options.okTitle }}
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>

export default {
  name: 'ConfirmModal',
  data() {
    return {
      visible: false,
      mode: 'async',
      form: { title: '', message: '' },
      resolve: () => {},
      options: { okTitle: '확인', cancelTitle: '취소' },
    }
  },
  methods: {
    show(resolve, form, options = { okTitle: '확인', cancelTitle: '취소' }) {
      this.resolve = resolve;
      this.form = form;
      this.options = options;
      this.visible = true;
    },
    done(state) {
      this.resolve(state);
      this.visible = false;
    },
    close() {
      this.visible = false;
    }
  },
}
</script>

<style lang="scss" scoped>
.confirmHorizontal {
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
  .v-btn {
    font-size: 18px;
    height: 54px;
    width: 150px;
    margin: 30px 10px 10px 0;
    border-radius: 27px;
    background: #0085de;
    color: #fff;
  }

  .v-btn.cancle {
    background: #a2a2a2;
  }

  .card-error {
    .v-icon {
      color: #d22828;
    }
  }
}
</style>
