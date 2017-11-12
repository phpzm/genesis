import Vue from 'vue'
import Vuex from 'vuex'

import state from 'genesis/infra/store/schema/state'
import mutations from 'genesis/infra/store/schema/mutations'

import * as actions from 'genesis/infra/store/schema/actions'
import * as getters from 'genesis/infra/store/schema/getters'

import modules from 'genesis/infra/store/schema/modules'

Vue.use(Vuex)

const strict = process.env.DEV

const AppStore = new Vuex.Store({state, mutations, actions, getters, modules, strict})

export default AppStore
