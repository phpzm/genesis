import { get as __get } from 'lodash'
import { uid, LocalStorage } from 'quasar-framework'

/**
 * @param {string} alias
 * @returns {string}
 */
export default (alias) => {
  let device = LocalStorage.get.item(alias)
  if (!device) {
    const appVersion = __get(window, 'navigator.appVersion', 'unknown')
    const appId = uid()
    device = `[${appId}] ${appVersion}`
    LocalStorage.set(alias, device)
  }
  return device
}
