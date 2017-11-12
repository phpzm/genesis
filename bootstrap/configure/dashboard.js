import store from 'genesis/infra/store'
import { Navigation } from 'genesis'

/**
 * @param {Vue} $component
 */
export default ($component) => {
  const menu = Navigation.get('drawer')
  const options = Navigation.get('options')
  const path = Navigation.get('path')

  store.dispatch('setAppMenu', menu(path))
  store.dispatch('setDashboardOptions', options(path))
}
