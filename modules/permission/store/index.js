import { APP_PERMISSIONS } from 'genesis/support/index'
import { set } from 'genesis/infra/storage'

export const SET_PERMISSION = 'setAuthPermission'

const state = {
  permissions: undefined
}

const getters = {
  getAuthPermission: (state) => state.permissions
}

const actions = {
  setAuthPermission: (store, permissions) => {
    store.commit(SET_PERMISSION, permissions)
    set(APP_PERMISSIONS, permissions, false)
  }
}

const mutations = {
  [SET_PERMISSION] (state, permissions) {
    state.permissions = permissions
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
