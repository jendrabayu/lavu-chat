import { useStore } from "vuex"
import _ from 'lodash'
import { computed } from "@vue/runtime-core";

export const useUserOnline = () => {
  const store = useStore()

  const onlineUser = (user_id) => {
    return _.find(store.state.users.users, { id: user_id })
  };

  const online = computed(() => store.state.users.online.id)

  return { onlineUser, online }
}