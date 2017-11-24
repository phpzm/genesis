/**
 * Vuex modules
 */
import { store as auth } from 'genesis/modules/auth/index'
import { store as permission } from 'genesis/modules/permission/index'
import { store as dashboard } from 'genesis/modules/dashboard/index'

export default {
  auth, permission, dashboard
}
