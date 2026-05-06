export async function fetchWithAuth(url, options = {}) {
  let response = await fetch(url, {
    ...options,
    credentials: 'include'
  })

  if (response.status === 401) {
    const refreshResponse = await fetch('http://localhost:8000/accounts/refresh/', {
      method: 'POST',
      credentials: 'include'
    })

    if (refreshResponse.ok) {
      response = await fetch(url, {
        ...options,
        credentials: 'include'
      })
    } else {
      window.location.href = '/login'
      return
    }
  }

  return response
}