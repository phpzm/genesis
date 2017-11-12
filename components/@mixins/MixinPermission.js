import { get } from 'lodash'
import { mapGetters } from 'vuex'
import { Auth } from 'genesis'

export default {
  computed: {
    ...mapGetters(['getAuthUser'])
  },
  methods: {
    /**
     * @param {Object} action
     * @param {Object} record
     */
    permissionCheck (action, record) {
      // test if the mixin has access to $route
      const $route = get(this, '$route')
      if (!$route) {
        return false
      }
      // verify if permission was override with a function
      if (typeof action.permission === 'function') {
        return action.permission(record, this, this.getAuthUser)
      }

      const permission = Auth.get('permission')

      // test the permission using the criteria defined in configure
      const access = permission(this.getAuthUser, $route, action)
      if (!access) {
        return false
      }
      // last layer of verification
      if (typeof action.access === 'function') {
        return action.access(record, this, this.getAuthUser)
      }
      // all right! move on
      return true
    }
  }
}
