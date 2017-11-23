import moment from 'moment'

/**
 * @param {string} format
 * @returns {string}
 */
export const today = (format = 'YYYY-MM-DD') => {
  return moment(new Date()).startOf('day').format(format)
}
