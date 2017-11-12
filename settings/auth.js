import { storage } from 'genesis/support/utils'
import { get } from 'lodash'
import permission from 'genesis/bootstrap/configure/permission'
import user from 'genesis/bootstrap/configure/user'
import token from 'genesis/bootstrap/configure/token'

/**
 * @type {Object}
 */
export default storage({
  permission, user, token
})
