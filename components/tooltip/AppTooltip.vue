<template>
  <q-tooltip v-bind="{disable: disabled}">
    <slot/>
  </q-tooltip>
</template>

<script type="text/javascript">
  import { View } from 'genesis'

  const AppTooltip = {
    extends: {},
    mixins: [],
    name: 'app-tooltip',
    props: {
      disable: {
        type: Boolean,
        default: () => false
      }
    },
    data: () => ({
      disabled: false
    }),
    computed: {
      classNames () {
        return [this.$options.name]
      }
    },
    created () {
      const tooltip = View.get('tooltip')
      // test if environment has tooltips
      this.disabled = !tooltip(this)
      // if has, test if tooltip was disabled via props
      if (this.disabled) {
        return
      }
      this.disabled = this.disable
    }
  }
  export default AppTooltip
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
