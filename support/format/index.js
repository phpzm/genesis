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
 * @param {string} query
 * @param {int} split
 * @returns {Function}
 */
export const formatHighLight = (query, split = 0) => {
  return (value) => {
    if (query) {
      let string = String(value)
      if (split && string.length > split) {
        string = generateEllipsis(string, string.toLowerCase().indexOf(query.toLowerCase()))
      }
      return stripAccent(string).replace(new RegExp(query, 'ig'), function (match) {
        return `<mark>${match}</mark>`
      })
    }
    return value
  }
}

/**
 * @param {string} string
 * @param {int} start
 * @returns {string}
 */
const generateEllipsis = (string, start) => {
  if (start > 5) {
    start = start - 5
  }
  string = string.substring(start)
  if (start > 5) {
    string = '... ' + string
  }
  return string
}

/**
 * @param string
 * @returns {string}
 */
const stripAccent = (string) => {
  const specials = [
    {regex: /[\xC0-\xC6]/g, char: 'A'},
    {regex: /[\xE0-\xE6]/g, char: 'a'},
    {regex: /[\xC8-\xCB]/g, char: 'E'},
    {regex: /[\xE8-\xEB]/g, char: 'e'},
    {regex: /[\xCC-\xCF]/g, char: 'I'},
    {regex: /[\xEC-\xEF]/g, char: 'i'},
    {regex: /[\xD2-\xD6]/g, char: 'O'},
    {regex: /[\xF2-\xF6]/g, char: 'o'},
    {regex: /[\xD9-\xDC]/g, char: 'U'},
    {regex: /[\xF9-\xFC]/g, char: 'u'},
    {regex: /[\xD1]/g, char: 'N'},
    {regex: /[\xF1]/g, char: 'n'}
  ]
  const reduce = (accumulate, item) => {
    return accumulate.replace(item.regex, item.char)
  }
  return specials.reduce(reduce, string)
}
