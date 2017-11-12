import { storage } from 'genesis/support/utils'
import { $body, $meta, $extract, $first, httpError, httpRequest, httpResponse } from 'genesis/bootstrap/configure/http'

/**
 * @type {Object}
 */
export default storage({
  $body, $meta, $extract, $first, httpError, httpRequest, httpResponse
})
