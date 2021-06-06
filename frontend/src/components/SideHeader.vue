<template>
  <header>
    <div class="img__wrapper">
      <div>
        <img
          :src="user.avatar_url"
          :alt="user.name"
          @click="handleShowProfile"
        />
      </div>
    </div>
    <div class="menu__wrapper">
      <div class="dropdown dropstart">
        <button data-bs-toggle="dropdown" id="dropdownMenuButton1">
          <img src="../assets/icons/menu.svg" />
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li>
            <a class="dropdown-item" href="#" @click.prevent="handleShowProfile"
              >Profile</a
            >
          </li>
          <li>
            <a
              class="dropdown-item"
              href="#"
              @click.prevent="handleShowChangePassword"
              >Change Password</a
            >
          </li>
          <li>
            <a
              class="dropdown-item text-danger"
              href="#"
              @click.prevent="handleLogout"
              >Log out</a
            >
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const user = computed(() => store.state.auth.user);

    const handleLogout = () => {
      store.dispatch("auth/logout");
    };

    const handleShowProfile = () => {
      store.dispatch("showProfile", true);
    };

    const handleShowChangePassword = () => {
      store.dispatch("showChangePassword", true);
    };

    return { user, handleLogout, handleShowProfile, handleShowChangePassword };
  },
};
</script>