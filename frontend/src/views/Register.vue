<template>
  <div class="auth">
    <div class="inner__auth">
      <div class="card">
        <div class="card-body">
          <h2 class="card-title mb-3">Register</h2>
          <alert-component />
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input
                v-model="name"
                type="text"
                class="form-control"
                tabindex="1"
                autofocus
                :disabled="isLoading"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input
                v-model="email"
                type="email"
                class="form-control"
                tabindex="2"
                :disabled="isLoading"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input
                v-model="password"
                type="password"
                class="form-control"
                tabindex="3"
                :disabled="isLoading"
                autocomplete="false"
              />
            </div>
            <div class="mb-4 text-end">
              Sudah punya akun?
              <router-link :to="{ name: 'Login' }"> Login </router-link>
            </div>
            <div class="d-grid">
              <button
                type="submit"
                :class="`btn btn-primary ${isLoading ? 'disabled' : ''}`"
                tabindex="4"
              >
                <span v-if="isLoading">Loading...</span>
                <span v-else>Register</span>
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
    document.title = "Register";
    const store = useStore();
    const email = ref("");
    const password = ref("");
    const name = ref("");
    const isLoading = ref(false);
    store.dispatch("alert/clear");

    const handleSubmit = async () => {
      isLoading.value = true;
      store.dispatch("alert/clear");
      await store.dispatch("auth/register", {
        name: name.value,
        email: email.value,
        password: password.value,
      });
      name.value = "";
      email.value = "";
      password.value = "";
      isLoading.value = false;
    };

    return { name, email, password, handleSubmit, isLoading };
  },
};
</script>

