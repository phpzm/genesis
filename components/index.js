import Vue from 'vue'
import * as fields from './fields'
import AppDebugger from './debugger/AppDebugger.vue'
import AppLink from './link/AppLink.vue'
import AppTooltip from './tooltip/AppTooltip.vue'

const components = Object.assign({}, fields, {AppDebugger, AppLink, AppTooltip})

Object.keys(components).forEach(key => {
  Vue.component(key, components[key])
})
