<template>
  <header>
    <div class="img__wrapper">
      <div>
        <img :src="selectedContact.avatar_url" :alt="selectedContact.name" />
      </div>
    </div>
    <div class="name">
      <div>{{ selectedContact.name }}</div>
      <div class="user__status">
        <span
          v-if="
            (onlineUser(selectedContact.id) && typing === false) ||
            (online === selectedContact.id && typing === false)
          "
          >Online</span
        >
        <span v-if="typing === true">Typing...</span>
      </div>
    </div>
    <div class="menu__wrapper">
      <div class="dropdown">
        <button
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img src="../assets/icons/menu.svg" />
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li>
            <a class="dropdown-item text-danger" href="#">Delete all my chat</a>
          </li>
        </ul>
      </div>
    </div>
  </header>
  <div class="conversation">
    <div class="background"></div>
    <div class="inner__conversation" v-if="messages" ref="feed">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="`message ${message.to === selectedContact.id ? 'in' : 'out'}`"
      >
        <div class="inner__message">
          <div>
            {{ message.body }}
          </div>
          <div class="datetime">{{ dateFormat(message.created_at) }}</div>
        </div>
      </div>
    </div>
  </div>
  <footer>
    <MessageComposer />
  </footer>
</template>


<script>
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import MessageComposer from "./MessageComposer";
import moment from "moment";
import _ from "lodash";
import { useUserOnline } from "../helpers";

export default {
  components: { MessageComposer },
  setup() {
    const store = useStore();
    const selectedContact = computed(() => store.state.users.selectedContact);
    const messages = computed(() => store.state.chat.messages);
    const feed = ref(null);

    const { onlineUser, online } = useUserOnline();

    const scrollToBottom = () => {
      setTimeout(() => {
        feed.value.scrollTop =
          feed.value.scrollHeight - feed.value.clientHeight;
      }, 50);
    };

    const typing = computed(() => store.state.users.typing);

    const dateFormat = (date) => moment(date).fromNow();

    watch(typing, () => {});

    // setiap perubahan pada state messages maka akan auto scroll ke bawah
    watch(
      messages,
      () => {
        scrollToBottom();
      },
      { deep: true }
    );

    onMounted(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      Echo.private(`messages.${user.id}`).listen("NewMessage", (e) => {
        const { message } = e;
        if (
          selectedContact.value &&
          message.from === selectedContact.value.id
        ) {
          store.dispatch("chat/addMessage", message);
        }
      });

      Echo.private("typingevent").listenForWhisper("typing", (e) => {
        if (
          e.user === store.state.users.selectedContact.id &&
          e.userId === user.id
        ) {
          store.dispatch("users/updateTyping", true);
        }
        setTimeout(() => {
          store.dispatch("users/updateTyping", false);
        }, 2000);
      });
    });

    return {
      selectedContact,
      messages,
      feed,
      dateFormat,
      typing,
      onlineUser,
      online,
    };
  },
};
</script>