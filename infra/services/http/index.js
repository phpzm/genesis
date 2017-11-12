import axios from 'axios'
import canceler from 'axios-cancel'
import { set } from 'lodash'
import { Auth } from 'genesis'
import { URL_API } from 'genesis/support'
import { loading } from 'genesis/support/message'
import configure from './configure'

/**
 * @type {Axios}
 */
export const http = axios.create({
  baseURL: URL_API,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

/**
 * @returns {Axios}
 */
export const install = () => {
  configure(http)

  canceler(http, {
    debug: false // process.env.DEV
  })

  return http
}

/**
 * @param {string} token
 */
export const setToken = token => {
  const configureToken = Auth.get('token')
  set(http, 'defaults.headers.common.Authorization', configureToken(token))
}

/**
 * @param {string} reason
 */
export const abort = reason => {
  http.cancelAll(reason)
  loading(false)
}

/**
 * @param {string} requestId
 */
export const cancel = (requestId) => {
  http.cancel(requestId)
  loading(false)
}

export default http
