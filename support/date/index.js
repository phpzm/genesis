import moment from 'moment'

/**
 * @param {string} format
 * @returns {string}
 */
export const today = (format = 'DD/MM/YYYY') => {
  return moment(new Date()).startOf('day').format(format)
}
