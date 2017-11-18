import moment from 'moment'
import { get } from 'lodash'
import { money, mask } from 'genesis/support/utils'

/**
 * @param value
 * @param format
 * @return {string}
 */
export const parseDate = (value, format = 'DD/MM/YYYY') => {
  const date = moment(value)
  if (!date.isValid()) {
    return ''
  }
  return moment(value).format(format)
}

/**
 * @param value
 * @return {string}
 */
export const formatDate = (value) => {
  return parseDate(value)
}

/**
 * @param value
 * @return {string}
 */
export const formatDateTime = (value) => {
  return parseDate(value, 'DD/MM/YYYY HH:mm')
}

/**
 * @param value
 * @return {string}
 */
export const formatBoolean = (value) => {
  let icon = 'check_box_outline_blank'
  if (value) {
    icon = 'check_box'
  }
  return '<i class="material-icons" style="margin: 0 0 0 10px; font-size: 20px; line-height: 0;">' + icon + '</i>'
}

/**
 * @param value
 * @return {string}
 */
export const formatMoney = (value) => {
  return '<div style="text-align: right;">' + money(value) + '</div>'
}

/**
 * @param value
 * @return {string}
 */
export const formatPhone = (value) => {
  let pattern = '(##) ####-####'
  if (length > 13) {
    pattern = '(##) #-####-####'
  }
  return mask(pattern, value)
}

/**
 * @param options
 * @returns {Function}
 */
export const formatOptions = (options) => {
  return (value) => {
    if (Array.isArray(options)) {
      const option = options.find(option => String(option.value) === String(value))
      return get(option, 'label', '')
    }
    return value
  }
}

/**
 * @param {Route} route
 * @param {string} field
 * @returns {Function}
 */
export const formatHighLight = (route, field) => {
  return (value) => {
    const query = String(route.query[field])
    if (query) {
      return String(value).replace(new RegExp(query, 'gi'), `<mark>${query}</mark>`)
    }
    return value
  }
}

