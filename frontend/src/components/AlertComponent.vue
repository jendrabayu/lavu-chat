<template>
  <div
    v-if="alert.message"
    :class="`alert ${alert.type} alert-dismissible fade show`"
    role="alert"
  >
    <ul
      class="mb-0"
      v-if="typeof alert.message === 'object' && alert.message.length > 0"
    >
      <li v-for="(message, index) in alert.message" :key="index">
        {{ message }}
      </li>
    </ul>
    <span v-else>
      {{ alert.message }}
    </span>

    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
      @click="handleClose"
    ></button>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const alert = computed(() => store.state.alert);
    const handleClose = () => {
      store.dispatch("alert/clear");
    };

    return { alert, handleClose };
  },
};
</script>