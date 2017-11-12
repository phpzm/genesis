import { Auth } from 'genesis'
import store from 'genesis/infra/store'
import { promise } from 'genesis/support/utils'

/**
 * @param {string} token
 * @param {boolean} remember
 * @param {Function} success
 * @returns {Promise}
 */
export const registerToken = (token, remember, success = () => ({})) => {
  return store.dispatch('setAuthRemember', remember).then(store.dispatch('setAuthToken', token).then(success))
}

/**
 * @param {Object} user
 * @param {Function} success
 * @returns {Promise}
 */
export const registerUser = (user, success = () => ({})) => {
  const configure = Auth.get('user')
  return store.dispatch('setAuthUser', configure(user)).then(success)
}

/**
 * @param {Function} success
 * @returns {Promise}
 */
export const unRegister = (success) => {
  return promise((resolve, reject) => {
    const solver = () => {
      success()
      resolve()
    }
    store
      .dispatch('setAuthUser', undefined)
      .then(store.dispatch('setAuthToken', undefined).then(solver).catch(reject))
      .catch(reject)
  })
}
