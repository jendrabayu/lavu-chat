<template>
  <div class="modal fade" tabindex="-1" ref="changePasswordModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Change Password</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <AlertComponent />
          <div class="row mb-3">
            <label class="col-sm-3 col-form-label">Current Password</label>
            <div class="col-sm-9">
              <input
                type="password"
                class="form-control"
                :disabled="isLoading"
                v-model="form.current_password"
                autocomplete="false"
              />
            </div>
          </div>
          <div class="row mb-3">
            <label class="col-sm-3 col-form-label">Password</label>
            <div class="col-sm-9">
              <input
                type="password"
                class="form-control"
                :disabled="isLoading"
                v-model="form.password"
                autocomplete="false"
              />
            </div>
          </div>
          <div class="row mb-3">
            <label class="col-sm-3 col-form-label">Confirm Password</label>
            <div class="col-sm-9">
              <input
                type="password"
                class="form-control"
                :disabled="isLoading"
                v-model="form.password_confirmation"
                autocomplete="false"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="isLoading"
            @click="handleSubmit"
          >
            <span v-if="isLoading">Loading...</span>
            <span v-else>Change Password</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { computed, onMounted, ref, watchEffect } from "vue";
import { Modal } from "bootstrap";
import { useStore } from "vuex";
import AlertComponent from "./AlertComponent";
import { userService } from "../services";

export default {
  components: { AlertComponent },
  setup() {
    const store = useStore();
    const changePasswordModal = ref(null);
    const isOpen = computed(() => store.state.showChangePassword);
    const isLoading = ref(false);

    const form = ref({
      current_password: "",
      password: "",
      password_confirmation: "",
    });

    const resetForm = () => {
      form.value.current_password = "";
      form.value.password = "";
      form.value.password_confirmation = "";
    };

    onMounted(() => {
      watchEffect(() => {
        const modal = new Modal(changePasswordModal.value, {
          keyboard: false,
          backdrop: "static",
        });

        if (isOpen.value) {
          modal.show();
        } else {
          modal.hide();
        }
      });

      changePasswordModal.value.addEventListener("hidden.bs.modal", () => {
        store.dispatch("showChangePassword", false);
        store.dispatch("alert/clear");
        resetForm();
      });
    });

    const handleSubmit = async () => {
      isLoading.value = true;
      await userService
        .updatePassword(
          form.value.current_password,
          form.value.password,
          form.value.password_confirmation
        )
        .then((res) => {
          store.dispatch("alert/success", res.message);
        })
        .catch((error) => store.dispatch("alert/error", error.errors || error));
      resetForm();
      isLoading.value = false;
    };

    return {
      changePasswordModal,
      handleSubmit,
      isLoading,
      form,
    };
  },
};
</script>