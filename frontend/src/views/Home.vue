<template>
  <div class="chat">
    <aside>
      <SideHeader />
      <SearchContact />
      <ContactList />
    </aside>
    <main>
      <Conversation v-if="contact" />
      <NoContact v-else />
    </main>
  </div>
  <ProfileModal />
  <ChangePasswordModal />
</template>

<script>
import SideHeader from "../components/SideHeader";
import SearchContact from "../components/SearchContact";
import ContactList from "../components/ContactList";
import Conversation from "../components/Conversation";
import ProfileModal from "../components/ProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import NoContact from "../components/NoContact";
import { useStore } from "vuex";
import { computed, onMounted } from "vue";
export default {
  components: {
    SideHeader,
    SearchContact,
    ContactList,
    Conversation,
    ProfileModal,
    ChangePasswordModal,
    NoContact,
  },
  setup() {
    document.title = "Lavu Chat";
    const store = useStore();
    const contact = computed(() => store.state.users.selectedContact);
    store.dispatch("users/getContacts");

    onMounted(() => {
      Echo.join("liveuser")
        .here((users) => {
          store.dispatch("users/addUsers", users);
        })
        .joining((user) => {
          store.dispatch("users/addOnline", user);
        })
        .leaving((user) => {
          console.log(user.name);
        });
    });

    return { contact };
  },
};
</script>
