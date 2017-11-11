/**
 * Vuex modules
 */
import { store as auth } from 'genesis/modules/auth/index'
import { store as dashboard } from 'genesis/modules/dashboard/index'
import bootstrap from 'src/bootstrap/store'

export default {
  auth,
  dashboard,
  bootstrap
}
