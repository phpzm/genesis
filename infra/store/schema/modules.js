/**
 * Vuex modules
 */
import { store as auth } from 'phpzm/modules/auth/index'
import { store as dashboard } from 'phpzm/modules/dashboard/index'
import bootstrap from 'src/bootstrap/store'

export default {
  auth,
  dashboard,
  bootstrap
}
