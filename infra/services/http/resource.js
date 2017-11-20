import http from 'genesis/infra/services/http/index'
import { Http } from 'genesis'

/**
 * @param {object} object
 * @param {string} prefix
 * @returns {string}
 */
export const serialize = (object, prefix = '') => {
  const string = []
  for (let property in object) {
    if (!object.hasOwnProperty(property)) {
      continue
    }
    let key = prefix ? prefix + '[' + property + ']' : property
    let value = object[property]
    let serialized = ''
    if (value && typeof value === 'object') {
      serialized = serialize(value, key)
    }
    else {
      serialized = encodeURIComponent(key) + '=' + encodeURIComponent(value)
    }
    string.push(serialized)
  }
  return string.join('&')
}

/**
 * @param {string} base
 * @param {string} uri
 * @param {object} parameters
 * @returns {string}
 */
export const url = (base, uri, parameters) => {
  return base + (uri ? '/' + uri : '') + (parameters ? '?' + serialize(parameters) : '')
}

/**
 * @param {string} path
 * @param {Object} fixed
 * @returns {Function}
 */
export const create = (path, fixed = {}) => {
  if (typeof fixed !== 'object') {
    fixed = {}
  }
  /**
   * @param {object} data
   * @param {string} uri
   * @param {object} parameters
   * @param {object} config
   */
  return (data, uri, parameters, config) => {
    return http.post(url(path, uri, parameters), Object.assign({}, data, fixed), config)
  }
}

/**
 * @param {string} path
 * @param {Object} fixed
 * @returns {Function}
 */
export const read = (path, fixed = {}) => {
  if (typeof fixed !== 'object') {
    fixed = {}
  }
  /**
   * @param {string} uri
   * @param {object} parameters
   * @param {object} config
   */
  return (uri, parameters, config) => {
    return http.get(url(path, uri, Object.assign({}, parameters, fixed)), config)
  }
}

/**
 * @param {string} path
 * @param {Object} fixed
 * @returns {Function}
 */
export const update = (path, fixed = {}) => {
  if (typeof fixed !== 'object') {
    fixed = {}
  }
  /**
   * @param {string} id
   * @param {object} data
   * @param {object} parameters
   * @param {object} config
   */
  return (id, data, parameters, config) => {
    return http.put(url(path, id, parameters), Object.assign({}, data, fixed), config)
  }
}

/**
 * @param {string} path
 * @param {Object} fixed
 * @returns {Function}
 */
export const destroy = (path, fixed = {}) => {
  if (typeof fixed !== 'object') {
    fixed = {}
  }
  /**
   * @param {object} path
   * @param {string} id
   * @param {object} parameters
   */
  return (id, parameters, config) => {
    return http.delete(url(path, id, Object.assign({}, parameters, fixed)), config)
  }
}

/**
 * @param {string} api - endpoint of api
 * @param {string} value - property what is the value in options
 * @param {string} label - property what is the label in options
 * @param {Object} more - properties do be mapped
 * @return {Function}
 */
export const source = (api, value, label, more = {}) => {
  const map = (item) => {
    const reduce = (accumulate, key) => {
      if (item[more[key]]) {
        accumulate[key] = item[more[key]]
      }
      return accumulate
    }
    const others = Object.keys(more).reduce(reduce, {})
    const base = {
      value: item[value],
      label: item[label]
    }
    return Object.assign({}, base, others)
  }
  const success = (response, callback) => {
    const $body = Http.get('$body')

    const data = $body(response)
    let source = []
    if (Array.isArray(data)) {
      source = data.map(map)
    }
    callback(source)
  }
  /**
   * @param {Function} callback
   */
  return (callback) => read(api)('').then(response => success(response, callback))
}

/**
 * @param {string} path
 * @param {Object} fixed
 * @returns {Resource}
 */
export const resource = (path, fixed = {}) => {
  return new Resource(path, fixed)
}

/**
 * @type {Resource}
 */
class Resource {
  /**
   * @param {string} path
   * @param {Object} fixed
   */
  constructor (path, fixed) {
    this.post = create(path, fixed)
    this.get = read(path, fixed)
    this.put = update(path, fixed)
    this.patch = update(path, fixed)
    this.delete = destroy(path, fixed)
  }
}
