<template>
  <app-card v-bind="{header: false, style: styles}">
    <router-view slot="content"></router-view>
  </app-card>
</template>

<script type="text/javascript">
  import AppCard from 'genesis/components/card/AppCard.vue'

  export default {
    components: {
      AppCard
    },
    name: 'app-crud',
    props: {
      classes: {
        default: () => ({})
      },
      styles: {
        default: () => ({})
      }
    },
    methods: {
      enviroment () {
        console.log('~> arguments', arguments)
      }
    },
    created () {
      this.$g.on('app-crud-enviroment', this.enviroment())
    },
    destroyed () {
      this.$g.off('app-crud-enviroment')
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
