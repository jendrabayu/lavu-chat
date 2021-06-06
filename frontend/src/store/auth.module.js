import { userService } from '../services'
import router from '../router'

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { status: { loggedIn: true }, user } : { status: {}, user: null };

export const auth = {
  namespaced: true,
  state: () => (initialState),
  mutations: {
    loginSuccess(state, user) {
      state.status = { loggedIn: true };
      state.user = user;
    },
    loginFailure(state) {
      state.status = {}
      state.user = null
    },
    updateProfile(state, user) {
      state.user = user;
    }
  },
  actions: {
    async login({ dispatch, commit }, { email, password }) {
      await userService.login(email, password)
        .then(res => {
          commit('loginSuccess', res.data);
          router.push({ name: 'Home' });
        })
        .catch(error => {
          dispatch('alert/error', error.errors || error, { root: true });
        });
    },
    async register({ dispatch }, { name, email, password }) {
      await userService.register(name, email, password)
        .then(res => {
          dispatch('alert/success', res.message, { root: true })
        })
        .catch(error => dispatch('alert/error', error.errors || error, { root: true }))
    },
    async logout({ dispatch, commit }) {
      await userService.logout()
        .then(data => {
          dispatch('users/clear', { root: true })
          router.push({ name: 'Login' });
          dispatch('alert/success', data.message, { root: true })
        })
        .catch(error => dispatch('alert/error', error.message, { root: true }));
    },
    async updateProfile({ dispatch, commit }, { name, email, avatar }) {
      await userService.updateProfile(name, email, avatar)
        .then(res => {
          commit('updateProfile', res.data.user);
          dispatch("alert/success", res.message, { root: true });
        })
        .catch(error => dispatch('alert/error', error.errors || error, { root: true }))
    }
  },
}