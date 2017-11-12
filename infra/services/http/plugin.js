import { Http } from 'genesis'
import { loading } from 'genesis/support/message/index'
import { PATH_LOGIN } from 'genesis/support/index'
import { default as http, install } from 'genesis/infra/services/http'

/**
 * @param http
 * @param store
 * @param router
 */
export const interceptors = (http, store, router) => {
  const httpRequest = Http.get('httpRequest')
  const httpResponse = Http.get('httpResponse')
  const httpError = Http.get('httpError')
  /**
   * @param config
   * @returns {*}
   */
  const request = config => {
    // noinspection JSUnresolvedVariable
    if (!config.noLoading) {
      loading(true, 100)
    }
    return httpRequest(config)
  }
  http.interceptors.request.use(request)

  /**
   * @param response
   * @returns {*}
   */
  const response = response => {
    loading(false)
    // noinspection JSUnresolvedVariable
    if (response.headers && response.headers.authorization) {
      // noinspection JSUnresolvedVariable
      store.dispatch('setAuthToken', response.headers.authorization)
    }
    return httpResponse(response)
  }

  /**
   * @param error
   * @returns {Promise<any> | Promise.<*>}
   */
  const error = error => {
    loading(false)
    const {response} = error
    if (response && [401, 400].indexOf(response.status) > -1) {
      router.push(PATH_LOGIN)
    }
    return Promise.reject(httpError(error, router, store))
  }

  http.interceptors.response.use(response, error)
}

/**
 * @param Vue
 * @param store
 * @param router
 * @returns {AxiosInstance}
 */
export default (Vue, {store, router}) => {
  install()
  interceptors(http, store, router)
  Object.defineProperty(Vue.prototype, '$http', {
    get () {
      return http
    }
  })
}
