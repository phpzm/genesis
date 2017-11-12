import { APP_USER, APP_TOKEN, APP_REMEMBER } from 'genesis/support/index'
import { set, get } from 'genesis/infra/storage'
import { setToken } from 'genesis/infra/services/http/index'

export const CHANGE_USER = 'setAuthUser'

export const CHANGE_TOKEN = 'setAuthToken'

export const CHANGE_REMEMBER = 'setAuthRemember'

const state = {
  remember: get(APP_REMEMBER),
  user: undefined,
  token: undefined
}

const getters = {
  getAuthRemember: (state) => state.remember,
  getAuthUser: (state) => state.user,
  getAuthToken: (state) => state.token
}

const actions = {
  setAuthRemember: (store, remember) => {
    store.commit(CHANGE_REMEMBER, remember)
    set(APP_REMEMBER, remember, true)
  },
  setAuthUser: (store, user) => {
    store.commit(CHANGE_USER, user)
    console.log('~> setAuthUser', store.getters.getAuthRemember)
    set(APP_USER, user, store.getters.getAuthRemember)
  },
  setAuthToken: (store, token) => {
    store.commit(CHANGE_TOKEN, token)
    set(APP_TOKEN, token, store.getters.getAuthRemember)
    if (token) {
      setToken(token)
    }
  }
}

const mutations = {
  [CHANGE_REMEMBER] (state, remember) {
    state.remember = remember
  },
  [CHANGE_USER] (state, user) {
    state.user = user
  },
  [CHANGE_TOKEN] (state, token) {
    state.token = token
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
