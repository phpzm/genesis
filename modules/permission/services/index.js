import store from 'genesis/infra/store'
import { promise } from 'genesis/support/utils'

/**
 * @param {Object} user
 * @param {Function} success
 * @returns {Promise}
 */
export const setPermissions = (permissions, success = () => ({})) => {
  return store.dispatch('setAuthPermission', permissions).then(success)
}

/**
 * @param {Function} success
 * @returns {Promise}
 */
export const unPermissions = (success) => {
  return promise((resolve, reject) => {
    const solver = () => {
      success()
      resolve()
    }
    store
      .dispatch('setAuthPermission', undefined)
      .then(store.dispatch('setAppMenu', []).then(solver).catch(reject))
      .catch(reject)
  })
}
