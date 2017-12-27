<template>
  <field :class="classNames" v-bind="{id, inline, problems, label, validate, title, tooltip, editable, visible}">
    <div slot="component">
      <div v-show="editable" class="component" :class="{'has-error': problems.length}">
        <template v-if="!embed">
          <i class="material-icons" :class="{'disabled': disabled}" @click="openWidget">&#xE878;</i>

          <q-datetime
            ref="widget"
            v-model="widget"
            :okLabel="okLabel"
            :cancelLabel="cancelLabel"
            :clearLabel="clearLabel"
            v-bind="bind"></q-datetime>

          <input ref="input" class="input full-width" autocomplete="off"
                 v-mask="pattern"
                 v-model="model" v-bind="{id, name, placeholder, maxlength, disabled}"
                 @keypress="keypress" @keyup="keyup" @blur="blur" @focus="focus" @keydown.enter.stop.prevent="enter"
                 @input="updateValue($event.target.value)"/>
          <div class="input-bar"></div>

        </template>

        <template v-else>
          <div class="row justify-center">
            <q-inline-datetime
              v-model="widget"
              v-bind="bind">
            </q-inline-datetime>
          </div>
        </template>

      </div>

      <div v-show="!editable" class="html" v-html="html"></div>
    </div>
  </field>
</template>

<script type="text/javascript">
  import moment from 'moment'
  import { View } from 'genesis'
  import { VueMaskDirective } from 'v-mask'
  import Field from 'genesis/components/fields/components/base.vue'
  import FieldAbstract from 'genesis/components/fields/abstract'

  export default {
    extends: FieldAbstract,
    components: {
      Field
    },
    directives: {
      'mask': VueMaskDirective
    },
    name: 'field-date',
    props: {
      type: {
        type: String,
        default: () => 'date'
      },
      min: {
        type: String
      },
      max: {
        type: String
      },
      format24h: {
        type: Boolean,
        default: () => true
      },
      okLabel: {
        type: String,
        default: () => 'Ok'
      },
      cancelLabel: {
        type: String,
        default: () => 'Cancelar'
      },
      clearLabel: {
        type: String,
        default: () => 'Limpar'
      },
      embed: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      widget: '',
      updated: false,
      programmatically: false,
      pattern: '##/##/####',
      model: '',
      format: 'YYYY-MM-DD',
      monthNames: '', // View.get('locales.date.month')
      dayNames: '' // View.get('locales.date.days.week')
    }),
    computed: {
      html () {
        return this.model
      },
      bind () {
        const {type, monthNames, dayNames, format24h} = this

        let min, max

        min = this.min ? moment(this.min).format() : ''
        max = this.max ? max = moment(this.max).format() : ''

        if (this.widget) {
          min = min ? this.widget.replace(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g, this.min) : ''
          max = max ? this.widget.replace(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g, this.max) : ''
        }

        return {min, max, type, monthNames, dayNames, format24h}
      }
    },
    methods: {
      /**
       * @param {*} value
       */
      applyValue (value) {
        if (!value || value === '0000-00-00') {
          return
        }
        if (typeof value !== 'string') {
          value = String(value)
        }
        if (!this.updated) {
          this.model = value.split('-').reverse().join('/')
        }
        this.updated = false
      },
      /**
       * @param {*} value
       */
      updateValue (value) {
        this.updated = true
        this.$emit('input', value.split('/').reverse().join('-'), this.programmatically)
        this.programmatically = false
      },
      /**
       */
      openWidget () {
        if (!this.disabled) {
          this.$refs.widget.open()
        }
      }
    },
    watch: {
      value (value) {
        this.programmatically = true
        this.applyValue(value)
      },
      widget (value) {
        if (!value) {
          return
        }
        value = moment(value).startOf('day').format('YYYY-MM-DD')
        this.updated = false
        this.programmatically = false
        this.applyValue(value)
        this.updateValue(value)
      }
    },
    created () {
      this.monthNames = View.get('locales.date.months')
      this.dayNames = View.get('locales.date.days.week')
    },
    mounted () {
      this.programmatically = true
      this.applyValue(this.value)
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '~variables'

  .field-date
    .component
      position relative
      & > input
        height 37px
      & > .material-icons
        background $field-button-background
        color $field-button-color
        position absolute !important
        cursor pointer
        right 0
        top 0
        padding 8px 4px 9px 5px
        font-size 20px
        z-index 10
        border-radius 2px
      & > .q-datetime-input
        position absolute !important
        z-index 9
        top 0
        right 0
        width 28px
        height 28px
        min-width inherit
        min-height inherit
        overflow hidden
        margin 0
        padding 0
        box-shadow none
    .html
      height 38px
      color #515151
      padding 9px 8px
      font-family Roboto
      font-size 14.4px
</style>
