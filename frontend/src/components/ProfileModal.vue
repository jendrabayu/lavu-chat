<template>
  <div class="modal fade" ref="profileModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Profile</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <AlertComponent />
          <div class="row mb-4 justify-content-center align-items-center">
            <div class="col-3">
              <div class="img__wrapper rounded-circle" @click="openUploadFile">
                <div class="avatar__upload">
                  <span>
                    <img src="../assets/icons/camera.svg" />
                  </span>
                  <p>Change Profile Photo</p>
                  <input
                    type="file"
                    accept="image/gif,image/jpeg,image/jpg,image/png"
                    hidden
                    ref="fileUpload"
                    @change="uploadFile"
                    :disabled="isLoading"
                  />
                </div>
                <img
                  class="rounded-circle w-100 h-100"
                  :src="form.avatar_url"
                  :alt="form.name"
                />
              </div>
            </div>
          </div>
          <div class="row mb-3">
            <label class="col-sm-2 col-form-label">Name</label>
            <div class="col-sm-10">
              <input
                type="text"
                class="form-control"
                v-model="form.name"
                :disabled="isLoading"
              />
            </div>
          </div>
          <div class="row mb-3">
            <label class="col-sm-2 col-form-label">Email</label>
            <div class="col-sm-10">
              <input
                type="email"
                class="form-control"
                v-model="form.email"
                :disabled="isLoading"
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
            :disabled="isLoading"
            type="button"
            class="btn btn-primary"
            @click="handleSubmit"
          >
            <span v-if="isLoading">Loading...</span>
            <span v-else>Update</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import { Modal } from "bootstrap";
import AlertComponent from "./AlertComponent";

export default {
  components: { AlertComponent },
  setup() {
    const store = useStore();
    const isOpen = computed(() => store.state.showProfile);
    const user = computed(() => store.state.auth.user);
    const profileModal = ref(null);
    const fileUpload = ref(null);
    const isLoading = ref(false);

    const form = ref({
      name: user.value.name,
      email: user.value.email,
      avatar_url: user.value.avatar_url,
    });

    let avatar = null;

    const resetForm = () => {
      form.value.name = user.value.name;
      form.value.email = user.value.email;
      form.value.avatar_url = user.value.avatar_url;
      avatar = null;
    };

    onMounted(() => {
      watchEffect(() => {
        const modal = new Modal(profileModal.value, {
          keyboard: false,
          backdrop: "static",
        });

        if (isOpen.value) {
          modal.show();
        } else {
          modal.hide();
        }
      });

      profileModal.value.addEventListener("hidden.bs.modal", () => {
        store.dispatch("showProfile", false);
        store.dispatch("alert/clear");
        resetForm();
      });
    });

    const openUploadFile = () => {
      fileUpload.value.click();
    };

    const uploadFile = (e) => {
      avatar = e.target.files[0];
      form.value.avatar_url = URL.createObjectURL(avatar);
    };

    const handleSubmit = async () => {
      isLoading.value = true;
      await store.dispatch("auth/updateProfile", {
        name: form.value.name,
        email: form.value.email,
        avatar,
      });
      isLoading.value = false;
    };

    return {
      openUploadFile,
      fileUpload,
      uploadFile,
      handleSubmit,
      profileModal,
      isLoading,
      form,
    };
  },
};
</script>

<style lang="scss" scoped>
.img__wrapper {
  position: relative;
  overflow: hidden;
  z-index: 1;
  width: 175px;
  height: 175px;

  &:hover {
    .avatar__upload {
      opacity: 1;
    }
  }

  .avatar__upload {
    transition: 0.3s;
    cursor: pointer;
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #666666cc;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    opacity: 0;
    p {
      font-size: 15px;
      color: rgba($color: #fff, $alpha: 0.8);
      margin-top: 10px;
      text-transform: uppercase;
      font-weight: 400;
      text-align: center;
      margin-bottom: 0;
    }
  }

  img {
    z-index: 2;
  }
}
</style>