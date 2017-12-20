<template>
  <div class="app-form">

    <div class="tabs">
      <q-tabs v-model="tabSeletecd" inverted>
        <q-tab v-for="tab in tabs" :key="tab.name" slot="title" v-bind="tab"/>
      </q-tabs>
      <div class="tab-content form" v-for="tab in tabs" v-show="tab.name === tabSeletecd">
        <component v-for="schema in components[tab.name]" :key="schema.field" :is="schema.component"
                   v-bind="schema" v-model="record[schema.field]"
                   @input="formInput(schema.field, arguments)" @event="formEvent"></component>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import appForm from './AppForm'

  export default {
    name: 'app-tabs',
    extends: appForm,
    created () {
      this.tabSeletecd = this.tab
      if (!this.tabSeletecd) {
        this.tabSeletecd = (Array.isArray(this.tabs) && this.tabs[0]) ? this.tabs[0].name : ''
      }
      if (this.$route.query.tab) {
        this.tabSeletecd = this.$route.query.tab
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .app-form
    .tab-content
      padding 20px 0
      border-top 1px solid #ddd
</style>
