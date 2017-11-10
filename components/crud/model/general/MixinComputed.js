import { APP_DEV } from 'phpzm/support/index'

export default {
  computed: {
    debugging () {
      if (!APP_DEV) {
        return false
      }
      return this.debug
    }
  }
}
