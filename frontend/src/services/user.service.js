import { API_URL } from '../config'
import { authHeader, generateKey } from '../helpers'

const handleResponse = (response) => {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const error = data || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
}

const login = (email, password) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }

  return fetch(`${API_URL}/login`, requestOptions).then(handleResponse).then(res => {
    localStorage.setItem('user', JSON.stringify(res.data));
    return res;
  });
}

const register = (name, email, password) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  }

  return fetch(`${API_URL}/register`, requestOptions).then(handleResponse).then(res => res);
}

const logout = () => {
  return fetch(`${API_URL}/logout`, {
    headers: authHeader()
  }).then(handleResponse).then(res => {
    localStorage.removeItem('user');
    return res;
  });
}

const getContacts = () => {
  return fetch(`${API_URL}/users`, { headers: authHeader() }).then(handleResponse).then(res => {
    return res
  })
}

const updateProfile = (name, email, avatar) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('avatar', avatar);

  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: formData
  }

  return fetch(`${API_URL}/update_profile`, requestOptions)
    .then(handleResponse)
    .then(res => {
      const user = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...user, ...res.data.user, }
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return res;
    })
}

const updatePassword = (currentPassword, password, passwordConfirmation) => {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    },
    body: JSON.stringify({
      current_password: currentPassword,
      password: password,
      password_confirmation: passwordConfirmation
    })
  }

  return fetch(`${API_URL}/update_password`, requestOptions)
    .then(handleResponse)
    .then(res => res);
}

const getConversation = (user_id) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    },
    body: JSON.stringify(generateKey())
  }

  return fetch(`${API_URL}/messages/${user_id}`, requestOptions)
    .then(handleResponse)
    .then(res => res)
}

const sendMessage = ({ room_id, from, to, body }) => {

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    },
    body: JSON.stringify({ room_id, from, to, body })
  }

  return fetch(`${API_URL}/send`, requestOptions)
    .then(handleResponse)
    .then(res => res)
}


export const userService = {
  login,
  register,
  logout,
  getContacts,
  updateProfile,
  updatePassword,
  getConversation,
  sendMessage
}