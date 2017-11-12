/**
 * @type {string}
 */
export const path = 'app/components/crud'

/**
 * @param {string} component
 * @param {string} path
 * @returns {string}
 */
export default (component) => {
  return `${path}/${component}`
}
