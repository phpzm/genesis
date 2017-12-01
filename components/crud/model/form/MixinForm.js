import { Data } from 'genesis'
import { mapActions } from 'vuex'
import { toast, undo } from 'genesis/support/message/index'
import { wildcard } from 'genesis/support/utils/index'

export default {
  props: {
    scope: {
      default: () => 'view'
    },
    messages: {
      type: Object,
      default: () => ({
        create: 'Registro criado com sucesso',
        read: '',
        update: 'Registro atualizado com sucesso',
        delete: 'Registro apagado com sucesso'
      })
    },
    handlers: {
      type: Object,
      default () {
        return {
          create: (response) => {
            if (!this.messages.create) {
              return console.error('There is no prop `messages.create`')
            }
            toast(wildcard(this.messages.create, this.$http.$body(response)))
            this.setAppModified(false)
          },
          read: (response) => {
            const populateForm = Data.get('form')
            populateForm(this, response)
            // this.$refs.form.setRecord(this.data)
          },
          update: (response) => {
            if (!this.messages.update) {
              return console.error('There is no prop `messages.create`')
            }
            toast(wildcard(this.messages.update, this.$http.$body(response)))
            this.setAppModified(false)
          },
          delete: (response) => {
            if (!this.messages.delete) {
              return console.error('There is no prop `messages.create`')
            }
            undo(wildcard(this.messages.delete, this.$http.$body(response)), () => {
              // window.alert('Undo')
            })
            this.browse(this.path)
          }
        }
      }
    },
    tabs: {
      type: Array,
      default: () => ([])
    },
    tab: {
      type: String,
      default: () => ''
    },
    steps: {
      type: Array,
      default: () => ([])
    },
    step: {
      type: String,
      default: () => ''
    },
    change: {
      type: Function
    },
    content: {
      type: String,
      default: () => 'app-form'
    }
  },
  data: () => ({
    fields: {},
    data: {},
    errors: {},
    status: false,
    readonly: false
  }),
  computed: {
    classNames () {
      const classNames = []
      if (this.className) {
        classNames.push(this.className)
      }
      if (this.$route.name) {
        classNames.push(String(this.$route.name).replace(/\./g, '_'))
      }
      return classNames
    }
  },
  methods: {
    /**
     */
    renderElements () {
      this.fields = this.schemas.filter(this.filterFields).map(this.mapFields).sort(this.sortFields)
    },
    /**
     * @param {Object} item
     * @returns {boolean}
     */
    filterFields (item) {
      return item.scopes.includes(this.scope)
    },
    /**
     * @param {Object} item
     * @param {Number} index
     * @returns {Object}
     */
    mapFields (item, index) {
      return Object.assign({}, item.form, {
        disabled: this.readonly ? true : item.form.disabled,
        order: item.form.order || index,
        field: item.field,
        component: item.form.component ? (this.component + '-' + item.form.component) : ''
      })
    },
    /**
     * @param {Object} a
     * @param {Object} b
     */
    sortFields (a, b) {
      if (a.order < b.order) {
        return -1
      }
      if (a.order > b.order) {
        return 1
      }
      return 0
    },
    /**
     * @param {Object} data
     */
    input (data) {
      this.data = data
      this.setAppModified(true)
    },
    /**
     * @param {boolean} valid
     * @param {Object} errors
     */
    valid (valid, errors) {
      this.status = valid
      this.errors = errors
    },
    /**
     * @param {string} id
     */
    fetchData (id) {
      window.setTimeout(() => this.read(id), this.timeout)
    },
    /**
     * @param {AxiosResponse} response
     * @param {string} method
     * @param {Function} callback
     */
    then (response, method, callback = null) {
      if (this.handlers[method]) {
        this.handlers[method](response)
      }
      if (typeof callback === 'function') {
        callback(response)
      }
    },
    /**
     * @param {boolean}
     */
    ...mapActions(['setAppModified'])
  },
  watch: {
    status () {
      this.renderActions()
    },
    data (current, previous) {
      this.renderActions()
    }
  },
  created () {
    if (this.scopes[this.scope]) {
      this.readonly = this.scopes[this.scope].readonly
    }
    if (this.tabs.length) {
      this.$g.emit('app-crud-enviroment', 'tabs')
    }
    if (this.steps.length) {
      this.$g.emit('app-crud-enviroment', 'steps')
    }
    this.renderAll()
  },
  mounted () {
    if (this.id && this.$route.params[this.id]) {
      const fetch = () => this.fetchData(this.$route.params[this.id])
      window.setTimeout(fetch, 100)
    }
  }
}
