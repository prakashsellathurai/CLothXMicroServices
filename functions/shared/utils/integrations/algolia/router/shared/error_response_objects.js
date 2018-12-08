module.exports = {
  GET_METHOD_NOT_SUPPORTED: {
    error: 'invalid request method',
    error_description: 'get method not supported'
  },
  PARAM_IS_UNDEFINED: (param) => JSON.parse(JSON.stringify({
    error: `invalid ${param}`,
    error_description: `${param} is undefined`
  }))
}
