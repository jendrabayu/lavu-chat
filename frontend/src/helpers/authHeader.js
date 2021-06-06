export const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user._token) {
    return { 'Authorization': `Bearer ${user._token}` }
  } else {
    return {}
  }
}