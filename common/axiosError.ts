enum types {
  response = 'response',
  request = 'request',
  error = 'error'
}

const axiosError = (error): { type: string; data: any; config: any } => {
  const config = error.config;
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    // console.log(error.response.data);
    // console.log(error.response.status);
    // console.log(error.response.headers);
    return {
      type: types.response,
      data: error.response,
      config
    }
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    // console.log(error.request);
    return {
      type: types.request,
      data: error.request,
      config,
    }
  }
  // Something happened in setting up the request that triggered an Error
  // console.log('Error', error.message);
  return {
    type: types.error,
    data: error.message,
    config,
  }
}
export {
  axiosError
}
