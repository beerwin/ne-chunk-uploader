export const requestSuccess = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        status: 200,
        statusText: 'OK'
      })
    }, 10)
  })
}

export const requestRedirected = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        status: 301,
        statusText: 'OK'
      })
    }, 10)
  })
}

export const requestStatusError = async () => {
  return Promise.resolve({
    status: 500,
    statusText: 'Internal server error'
  })
}

export const requestStatusNotFound = async () => {
  return Promise.resolve({
    status: 404,
    statusText: 'Not found'
  })
}

export const requestStatusAuthorizationRequired = async () => {
  return Promise.resolve({
    status: 401,
    statusText: 'Unauthorized'
  })
}

export const requestStatusBadRequest = async () => {
  return Promise.resolve({
    status: 400,
    statusText: 'Bad Request'
  })
}

export const requestFail = async () => {
  return Promise.reject(new Error('fetch failed'))
}
