import { EV, RSA } from '../crypto'
import { userService } from '../services'
import bigInt from 'big-integer'

const initialState = {
  messages: [],
  room_id: null,
  secrets: {
    from: {},
    to: {},
  },
  key: ''
}

export const chat = {
  namespaced: true,
  state: () => initialState,
  mutations: {
    clear(state) {
      state.messages = []
      state.room_id = null
      state.secrets.from = {}
      state.secrets.to = {}
      state.key = ''
    },
    addMessage(state, message) {
      state.messages.push(message)
    },
    addConversation(state, { messages, room_id, secrets, key }) {
      const { from, to } = secrets
      state.messages = messages
      state.room_id = room_id
      state.secrets.from = from
      state.secrets.to = to
      state.key = key
    }
  },
  actions: {
    clear({ commit }) {
      commit('clear')
    },
    addMessage({ commit, state }, message) {
      message.body = EV.decrypt(message.body, state.key)
      commit('addMessage', message)
    },
    async getConversation({ commit, rootState }) {
      await userService.getConversation(rootState.users.selectedContact.id)
        .then(res => {
          const { messages, room_id, secrets } = res.data
          const { from, to } = secrets
          /**
           * Proses mendapatkan kunci enkripsi dan deksripsi 
           * yang digunakan untuk extended vigenere
           * R2   = T2^d1 mod n1
           * Q    = R1 * R2
           * Key  = Y^x mod Q  
           * 
           * Setelah mendapatkan key maka setiap isi pesan akan 
           * di dekripsi menggunakan extended vigenere dan disimpan dalam state
           */
          const R2 = RSA.decrypt(to.t, from.d, from.n);
          const Q = bigInt(R2).multiply(from.r);
          const key = bigInt(to.big_x).modPow(from.x, Q).toString();

          messages.map(message => {
            message.body = EV.decrypt(message.body, key);
            return message;
          })

          commit('addConversation', {
            messages,
            room_id,
            secrets,
            key
          })

        })
        .catch(error => {
          console.log(error);
        })
    },
    async sendMessage({ commit, dispatch, state, rootState }, plaintext) {
      const ciphertext = EV.encrypt(plaintext, state.key);
      const data = {
        room_id: state.room_id,
        from: JSON.parse(localStorage.getItem('user')).id,
        to: rootState.users.selectedContact.id,
        body: ciphertext
      }
      await userService.sendMessage(data)
        .then(res => {

          dispatch('addMessage', res.data);
        })
        .catch(error => {
          console.log(error)
        })

    }
  },
  getters: {

  }
}