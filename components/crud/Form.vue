<template>
  <div class="app-crud-grid" :class="classNames">

    <slot name="header"/>

    <slot v-if="top" name="top">
      <app-button-bar :buttons="buttons.top" :handler="handler" :direction="direction" :record="data"/>
    </slot>

    <hr v-if="top">
    <slot name="content">
      <component :is="content" ref="form" v-bind="{tabs, tab, fields, data, readonly, change, watches, debug}"
                @form~input="input" @form~valid="valid"/>
    </slot>
    <hr v-if="bottom">

    <slot v-if="bottom" name="bottom">
      <app-button-bar :buttons="buttons.top" :handler="handler" :direction="direction" :record="data"/>
    </slot>

    <slot name="footer"/>

    <slot v-if="floating" name="floating">
      <div class="fixed-bottom-right">
        <app-button-bar :buttons="buttons.floating" :handler="handler" :record="data"/>
      </div>
    </slot>

    <template v-if="debugging">
      <app-debugger v-bind="{label: 'data', inspect: data}"/>
      <app-debugger v-bind="{label: 'fields', inspect: fields}"/>
      <app-debugger v-bind="{label: 'errors', inspect: errors}"/>
    </template>
  </div>
</template>

<script type="text/javascript">
  import AppForm from 'genesis/components/form/AppForm.vue'
  import AppButtonBar from 'genesis/components/button/AppButtonBar.vue'
  import MixinNavigation from 'genesis/components/@mixins/MixinNavigation'
  import { MixinComputed, MixinData, MixinMethods, MixinProps } from './model'
  import { MixinForm } from './model/form'

  /**
   * @type {Object}
   * @property data
   */
  const AppCrudForm = {
    mixins: [
      MixinComputed, MixinData, MixinMethods, MixinProps, MixinNavigation, MixinForm
    ],
    name: 'app-crud-form',
    components: {
      AppForm, AppButtonBar
    }
  }
  export default AppCrudForm
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .app-crud-grid
    padding 16px 0 0 0
    hr
      margin 10px 0
    .fixed-bottom-right
      margin 5px
</style>
