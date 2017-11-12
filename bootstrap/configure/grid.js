import { get } from 'lodash'

/**
 * @param {Resource} service
 * @param {string} path
 * @param {string} id
 * @param {Array} schemas
 * @param {Array} filters
 * @param {Array|Function} actions
 * @param {Object} options
 * @returns {Object}
 */
export default (service, path, id, schemas, filters, actions = null, options = {}) => {
  const primaryKey = get(schemas.find(schema => schema.primaryKey), 'field')
  const base = {
    slots: [
      {
        field: primaryKey,
        component: 'AppLink',
        props: {
          path: `${path}/{_id}`,
          label: ''
        }
      }
    ],
    timeout: 200,
    top: false,
    bottom: true,
    styles: {
      height: 'calc(100vh - 225px)',
      minHeight: '200px'
    },
    bodyStyle: {
      height: 'calc(100vh - 275px)',
      minHeight: '150px'
    },
    rule: 'like',
    separator: '~>',
    changer: '$',
    debug: false
  }
  const settings = {service, path, id, schemas, filters, actions}

  return Object.assign({}, base, settings, options)
}
