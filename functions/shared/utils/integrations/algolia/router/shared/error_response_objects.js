module.exports = {
  GET_METHOD_NOT_SUPPORTED: {
    error: 'invalid request method',
    error_description: 'get method not supported'
  },
  PARAM_IS_UNDEFINED: (param) => JSON.parse(JSON.stringify({
    error: `invalid ${param}`,
    error_description: `${param} is undefined`
  })),
  SERVER_ERROR: {
    error: 'server error',
    error_description: 'server not responding your request'
  },
  INVALID_REQUEST_OBJECT: (param, message) => JSON.parse(JSON.stringify({
    error: `invalid ${param}`,
    error_description: `${param} in request object is invalid ${message}`
  }))
}
