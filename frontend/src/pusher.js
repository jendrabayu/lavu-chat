import Echo from 'laravel-echo';
import { PUSHER_APP_CLUSTER, PUSHER_APP_KEY } from './config';
import { authHeader } from './helpers'
import { API_URL } from './config'
import axios from 'axios';

window.Pusher = require('pusher-js');

window.Echo = new Echo({
  broadcaster: "pusher",
  cluster: PUSHER_APP_CLUSTER,
  encrypted: true,
  key: PUSHER_APP_KEY,
  authorizer: (channel, options) => {
    return {
      authorize: (socketId, callback) => {
        axios.post(`${API_URL}/broadcasting/auth`, {
          socket_id: socketId,
          channel_name: channel.name
        }, {
          headers: authHeader()
        })
          .then(response => {
            callback(false, response.data);
          })
          .catch(error => {
            callback(true, error);
          });
      }
    };
  },
})