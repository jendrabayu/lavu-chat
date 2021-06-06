<template>
  <div class="contact__list">
    <div>
      <div
        v-for="user in contacts"
        @click="handleSelectedContact(user)"
        :key="user.id"
        class="contact__item"
        :class="{ active: user == selected }"
      >
        <div class="img__wrapper">
          <div>
            <img :src="user.avatar_url" alt="" />
          </div>
        </div>
        <div class="contact">
          <div class="item">
            <div class="name">{{ user.name }}</div>
            <div>
              <span
                v-if="onlineUser(user.id) || online === user.id"
                class="status"
                >Online</span
              >
            </div>
          </div>
          <div class="item">
            <div class="email">{{ user.email }}</div>
            <div>
              <span v-if="user.unread" class="unread">{{ user.unread }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import _ from "lodash";
import { useUserOnline } from "../helpers";
export default {
  setup() {
    const store = useStore();
    const { online, onlineUser } = useUserOnline();
    const selected = ref(
      store.state.users.contacts.length ? store.state.users.contacts[0] : null
    );

    const handleSelectedContact = (user) => {
      selected.value = user;
      store.dispatch("users/addSelectedContact", user);
      store.dispatch("chat/getConversation");
    };

    const contacts = computed(() => {
      let contacts = _.sortBy(store.state.users.contacts, [
        (contact) => {
          if (contact === selected.value) {
            return Infinity;
          }
          return contact.unread;
        },
      ]).reverse();

      return contacts;
    });

    return { contacts, handleSelectedContact, onlineUser, online, selected };
  },
};
</script>