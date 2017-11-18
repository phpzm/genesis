import { Model } from 'genesis'
import item from 'genesis/modules/dashboard/helper/item'
import { uniqid } from 'genesis/support/utils'

/**
 * @type {Function}
 *
 * @param field
 * @param label
 * @param component
 * @param scopes
 * @returns {object}
 */
export const field = (field, label, component = 'text', scopes = []) => {
  /**
   * @type {Function}
   * @private
   */
  const _field = Model.get('field')
  return _field(field, label, component, scopes)
}

/**
 * @type {Function}
 *
 * @param {Resource} service
 * @param {string} path
 * @param {string} id
 * @param {Array} schemas
 * @param {Array} filters
 * @param {Array} actions
 * @param {Object} options
 * @returns {Object}
 */
export const grid = (service, path, id, schemas, filters, actions = null, options = {}) => {
  /**
   * @type {Function}
   * @private
   */
  const _grid = Model.get('grid')
  return _grid(service, path, id, schemas, filters, actions, options)
}

/**
 * @type {Function}
 *
 * @param {Resource} service
 * @param {string} scope
 * @param {string} path
 * @param {string} id
 * @param {Array} schemas
 * @param {Array} actions
 * @param {Object} options
 * @returns {Object}
 */
export const form = (service, scope, path, id, schemas, actions = null, options = {}) => {
  const _form = Model.get('form')
  return _form(service, scope, path, id, schemas, actions, options)
}

/**
 * @type {Function}
 *
 * @param {Array} fields
 * @param {string} scope
 * @returns {Array}
 */
export const filter = (fields, scope) => {
  return fields.filter(field => scope ? field.scopes && field.scopes.includes(scope) : true)
}

/**
 * @type {Function}
 *
 * @param {string} icon
 * @param {string} label
 * @param {string} title
 * @param {string} tooltip
 * @param {string} namespace
 * @param {int} permission
 * @returns {Object}
 */
export const meta = (icon, label, title, tooltip = '', namespace = '', permission = 1) => {
  return {icon, label, title, tooltip, namespace, permission}
}

/**
 * @type {Function}
 *
 * @param {string} icon
 * @param {string} label
 * @param {string} path
 * @param {Boolean} exact
 * @param {string} tooltip
 * @param {string} id
 * @param {string} namespace
 * @param {int} permission
 * @param {string} color
 * @returns {Function}
 */
export const menu = (icon, label, path, exact = false, tooltip = '', id = '', namespace = '', permission = 1, color = '') => {
  const identification = id || uniqid()
  return (to) => item(identification, to(path), label, icon, exact, tooltip, namespace, permission, color)
}

/**
 * @type {Function}
 *
 * @param {string} uri
 * @param {Object} reference
 * @param {string} referenced
 */
export const pivot = (uri, reference, referenced) => ({uri, reference, referenced})

/**
 * @type {Function}
 *
 * @param {string} icon
 * @param {string} label
 * @param {string} path
 * @param {string} tooltip
 * @param {string} description
 * @param {int} width
 * @returns {Function}
 */
export const card = (icon, label, path, tooltip, description, width) => {
  return (to) => ({icon, label, to: to(path), tooltip, description, width})
}

/**
 * @type {Object}
 */
export default {
  grid, form, field, filter, meta, menu, pivot, card
}
