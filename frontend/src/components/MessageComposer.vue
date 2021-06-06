<template>
  <div class="form-group">
    <input
      v-model="message"
      class="form-control"
      type="text"
      placeholder="Type a message"
      @keydown="typingEvent()"
      @keydown.enter="send"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const message = ref("");
    const user = JSON.parse(localStorage.getItem("user"));

    const send = async () => {
      if (message.value) {
        await store.dispatch("chat/sendMessage", message.value);
        message.value = "";
      }
    };

    const typingEvent = () => {
      Echo.private("typingevent").whisper("typing", {
        user: user.id,
        typing: message.value,
        userId: store.state.users.selectedContact.id,
      });
    };

    return { message, send, typingEvent };
  },
};
</script>

<style lang="scss" scoped>
.form-control {
  border-radius: 21px;
  padding: 9px 12px 11px;
  border: 1px solid white;
  margin: 5px 10px;
  font-size: 15px;
  font-weight: 400;
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>