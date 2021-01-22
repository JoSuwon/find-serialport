import Vue from 'vue';

export const ModalEventBus = new Vue();

Vue.prototype.$modal = {
  alert: (mode, title, message) => {
    ModalEventBus.$emit('alert', mode, title, message);
  },
  confirm: (form, options = { cancelError: false, successCallback: null, cancelCallback: null }) => {
    const { cancelError, onSuccess, onCancel } = options;
    const modalOptions = { okTitle: options.okTitle || '확인', cancelTitle: options.cancelTitle || '취소' };
    const question = new Promise(resolve => {
      ModalEventBus.$emit('confirm', resolve, form, modalOptions);
    });

    return question.then(state => {
      if (cancelError && !state) throw new Error('사용자 취소');
      else if (typeof onSuccess === 'function') {
        state ? onSuccess() : onCancel?.();
      } else {
        return state;
      }
    });
  },
  progress: (visible, form) => ModalEventBus.$emit('progress', visible, form),
  // modalAllClose: () => {
  //   ModalEventBus.$emit('allClose');
  // }
};
