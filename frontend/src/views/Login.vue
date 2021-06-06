<template>
  <div class="auth">
    <div class="inner__auth">
      <div class="card">
        <div class="card-body">
          <h2 class="card-title mb-3">Login</h2>
          <alert-component />
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input
                v-model="email"
                type="email"
                class="form-control"
                tabindex="1"
                autofocus
                :disabled="isLoading"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input
                v-model="password"
                type="password"
                class="form-control"
                tabindex="2"
                :disabled="isLoading"
                autocomplete="false"
              />
            </div>
            <div class="mb-4 text-end">
              Belum punya akun?
              <router-link :to="{ name: 'Register' }"> Register </router-link>
            </div>
            <div class="d-grid">
              <button
                type="submit"
                :class="`btn btn-primary ${isLoading ? 'disabled' : ''}`"
                tabindex="3"
              >
                <span v-if="isLoading">Loading...</span>
                <span v-else>Login</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import AlertComponent from "../components/AlertComponent.vue";
export default {
  components: { AlertComponent },
  setup() {
    const store = useStore();
    const email = ref("");
    const password = ref("");
    const isLoading = ref(false);
    store.dispatch("alert/clear");

    const handleSubmit = async () => {
      isLoading.value = true;
      store.dispatch("alert/clear");
      await store.dispatch("auth/login", {
        email: email.value,
        password: password.value,
      });
      isLoading.value = false;
    };

    return { email, password, handleSubmit, isLoading };
  },
};
</script>

