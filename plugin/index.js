import { get, set } from 'lodash'
import { uniqid } from 'genesis/support/utils'

/**
 * @param {string} path
 * @param {Object} query
 * @param {string} changer
 */
const browse = (path, query = {}, changer = '~') => {
  let remove = false
  if (query === false) {
    query = {}
  }

  if (query !== undefined) {
    query = Object.assign({}, this.$route.query, query)
  }
  if (query === undefined) {
    query = {}
  }
  if (path === this.$route.path) {
    query[changer] = uniqid()
  }
  if (remove) {
    delete query[changer]
  }
  window.setTimeout(() => this.$router.push({path, query}), 100)
}

const genesis = {
  get, set, browse
}

/**
 * @param Vue
 * @returns {*}
 */
export default Vue => {
  Object.defineProperty(Vue.prototype, '$g', {
    get () {
      return genesis
    }
  })
}
