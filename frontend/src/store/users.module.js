import { userService } from '../services'

export const users = {
  namespaced: true,
  state: () => ({
    contacts: [],
    selectedContact: null,
    users: [],
    online: '',
    typing: false
  }),
  mutations: {
    addContacts(state, contacts) {
      state.contacts = contacts
    },
    addSelectedContact(state, contact) {
      state.selectedContact = contact
    },
    addUsers(state, users) {
      state.users = users
    },
    addOnline(state, user) {
      state.online = user
    },
    updateTyping(state, typing) {
      state.typing = typing
    },
    updateUnreadCount(state, { contact, reset }) {
      state.contacts.map(single => {
        if (single.id !== contact.id) {
          return single;
        }
        if (reset) {
          single.unread = 0;
        } else {
          single.unread += 1;
        }
        return single;
      });
    }
  },
  actions: {
    getContacts({ commit }) {
      userService.getContacts().then(res => {
        commit('addContacts', res.data)
      }).catch(error => {
        console.log(error)
      })
    },
    addSelectedContact({ commit, dispatch }, user) {
      dispatch('chat/clear', null, { root: true })
      dispatch('updateUnreadCount', { contact: user, reset: true })
      commit('addSelectedContact', user)
    },
    addUsers({ commit }, users) {
      commit('addUsers', users)
    },
    addOnline({ commit }, user) {
      commit('addOnline', user)
    },
    updateTyping({ commit }, typing) {
      commit('updateTyping', typing)
    },
    updateUnreadCount({ commit }, { contact, reset }) {
      commit('updateUnreadCount', { contact, reset })
    }
  },
}