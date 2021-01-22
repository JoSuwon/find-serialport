<template>
  <div>
    <v-dialog v-model="visible" width="unset" overlay-opacity="0.8" persistent>
      <div class="messageHorizontal">
        <div>
          <v-icon :color="type[form.mode].color">{{ type[form.mode].sorce }}</v-icon>
          <h4>{{ form.title }}</h4>
          <p>{{ form.message }}</p>
          <v-btn text @click="visible=false;">확인</v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>

export default {
  name: 'AlertModal',
  data() {
    return {
      visible: false,
      type: {
        info: { sorce: 'mdi-information', color: '#0085DE' },
        alert: { sorce: 'mdi-alert-circle', color: '#d22828' },
        pass: { sorce: 'mdi-email', color: '#c2c2c2' },
        error: { sorce: 'mdi-close-circle', color: '#d22828' },
      },
      form: {
        mode: 'info',
        title: '제목',
        message: '내용',
      },
    };
  },
  methods: {
    show(mode, title, message) {
      this.form = { mode, title, message };
      this.visible = true;
    },
    close() {
      this.visible = false;
    }
  },
}
</script>

<style lang="scss" scoped>
.messageHorizontal {
  max-width: 600px;
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-radius: 15px;
    padding: 30px 60px;
  }

  .v-icon {
    font-size: 80px;
    margin-bottom: 30px;
    animation: scaleUp 0.5s forwards ease-in-out;
    animation-delay: 0.1s;
    color:#EC1F72;
    opacity: 0;
  }
  @keyframes scaleUp {
    0% {
      opacity: 0;
      transform: scale(0.1);
    }
    50% {
      opacity: 1;
      transform: scale(1.5);
    }
    100% {
      opacity: 1;
      transform: scale(1);
      
    }
  }
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
}
@keyframes effect {
  0% {
    bottom: 150px;
  }
  100% {
    bottom: 0;
  }
}
@keyframes effectBtn {
  0% {
    bottom: -150px;
  }
  100% {
    bottom: 0px;
  }
}
</style>
