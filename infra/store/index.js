import Vue from 'vue'
import Vuex from 'vuex'

import { strict, APP_USER, APP_TOKEN } from 'phpzm/support/index'
import { get } from 'phpzm/infra/storage'

import state from 'phpzm/infra/store/schema/state'
import mutations from 'phpzm/infra/store/schema/mutations'

import * as actions from 'phpzm/infra/store/schema/actions'
import * as getters from 'phpzm/infra/store/schema/getters'

import modules from 'phpzm/infra/store/schema/modules'

Vue.use(Vuex)

const AppStore = new Vuex.Store({state, mutations, actions, getters, modules, strict})

const user = get(APP_USER)
if (user) {
  // noinspection JSIgnoredPromiseFromCall
  AppStore.dispatch('setAuthUser', user)
}
const token = get(APP_TOKEN)
if (token) {
  // noinspection JSIgnoredPromiseFromCall
  AppStore.dispatch('setAuthToken', token)
}

export default AppStore
