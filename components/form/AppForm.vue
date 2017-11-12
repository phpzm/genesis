<template>
  <div class="app-form">
    <div v-if="tabs.length" class="tabs">
      <q-tabs v-model="tabSeletecd" inverted>
        <!-- Tabs - notice slot="title" -->
        <q-tab v-for="tab in tabs" :key="tab.name" slot="title" v-bind="tab"/>
        <!-- Targets -->
      </q-tabs>
      <div class="tab-content form" v-for="tab in tabs" v-show="tab.name === tabSeletecd">
        <component v-for="schema in components[tab.name]" :key="schema.field" :is="schema.component"
                   v-bind="schema" v-model="record[schema.field]"
                   @input="formInput(schema.field)" @event="formEvent"></component>
      </div>
    </div>
    <div v-else class="form">
      <component v-for="schema in schemas" :key="schema.field" :is="schema.component"
                 v-bind="schema" v-model="record[schema.field]"
                 @input="formInput(schema.field)" @event="formEvent"></component>
    </div>
  </div>
</template>

<script type="text/javascript">
  import { validationMixin as validation } from 'vuelidate'
  import { data, methods, props, watch } from './model'

  export default {
    mixins: [validation, data, methods, props, watch],
    name: 'app-form',
    validations () {
      const validations = this.generateValidations(this.fields)
      return {
        record: validations
      }
    },
    created () {
      this.updateComponents()
      this.updateSchemas()
      this.updateRecord()

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

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .app-form
    font-family Roboto
    .tab-content
      padding 20px 0
      border-top 1px solid #ddd
</style>
