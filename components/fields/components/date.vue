<template>
  <field :class="classNames" v-bind="{id, inline, problems, label, validate, title, tooltip, editable, visible}">
    <div slot="component">
      <div v-show="editable" class="component" :class="{'has-error': problems.length}">
        <i class="material-icons bg-primary" :class="{'disabled': disabled}" @click="openWidget">&#xE878;</i>
        <q-datetime ref="widget" v-model="widget"
                    v-bind="{type, monthNames, dayNames, format24h, okLabel, cancelLabel, clearLabel}"></q-datetime>
        <input ref="input" class="input full-width" autocomplete="off"
               v-mask="pattern"
               v-model="model" v-bind="{id, name, placeholder, maxlength, disabled}"
               @keypress="keypress" @keyup="keyup" @blur="blur" @focus="focus" @keydown.enter.stop.prevent="enter"
               @input="updateValue($event.target.value)"/>
        <div class="input-bar"></div>
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
      }
    },
    data: () => ({
      widget: '',
      updated: false,
      programmatically: false,
      pattern: '##/##/####',
      model: '',
      monthNames: '', // View.get('locales.date.month')
      dayNames: '' // View.get('locales.date.days.week')
    }),
    computed: {
      html () {
        return this.model
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
  .field-date
    .component
      position relative
      & > input
        height 37px
      & > .material-icons
        position absolute !important
        cursor pointer
        right 0
        top 0
        color #ffffff
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
