import { createStore } from 'vuex'
import { auth } from './auth.module'
import { alert } from './alert.module'
import { users } from './users.module'
import { chat } from './chat.module'

export default createStore({
  state: () => ({
    showProfile: false,
    showChangePassword: false
  }),
  mutations: {
    showProfile(state, show) {
      state.showProfile = show;
    },
    showChangePassword(state, show) {
      state.showChangePassword = show
    }
  },
  actions: {
    showProfile({ commit }, show = false) {
      commit('showProfile', show);
    },
    showChangePassword({ commit }, show = false) {
      commit('showChangePassword', show);
    }
  },
  modules: {
    auth,
    alert,
    users,
    chat
  }
})
