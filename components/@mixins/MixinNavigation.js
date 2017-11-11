import { uniqid } from 'genesis/support/utils'

export default {
  props: {
    changer: {
      type: String,
      default: () => '~'
    }
  },
  methods: {
    /**
     * @param {string} path
     * @param {Object} query
     */
    browse (path, query = {}) {
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
        query[this.changer] = uniqid()
      }
      if (remove) {
        delete query[this.changer]
      }

      const browse = () => this.$router.push({path, query})

      window.setTimeout(browse, 100)
    }
  }
}
