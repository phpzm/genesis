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
            toast(wildcard(this.messages.create, this.$http.$body(response)))
            this.setAppModified(false)
          },
          read: (response) => {
            const populateForm = Data.get('form')
            populateForm(this, response)
            this.$refs.form.setRecord(this.data)
          },
          update: (response) => {
            toast(wildcard(this.messages.update, this.$http.$body(response)))
            this.setAppModified(false)
          },
          delete: (response) => {
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
    change: {
      type: Function
    }
  },
  data: () => ({
    fields: {},
    data: {},
    errors: {},
    status: false,
    readonly: false
  }),
  methods: {
    /**
     */
    renderElements () {
      const map = item => {
        return Object.assign({}, item.form, {
          disabled: this.readonly ? true : item.form.disabled,
          field: item.form.field,
          component: item.form.component ? (this.component + '-' + item.form.component) : ''
        })
      }
      const filter = item => item.scopes.includes(this.scope)

      this.fields = this.schemas.filter(filter).map(map)
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
     * @param {AxiosError} error
     * @param {string} method
     * @param {Array} parameters
     */
    catch (error, method, parameters) {
      console.log('~>', this.$options.name, error)
    },
    /**
     * @param {string} id
     */
    fetchData (id) {
      window.setTimeout(() => this.read(id), this.timeout)
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
    data () {
      this.renderActions()
    }
  },
  created () {
    if (this.scopes[this.scope]) {
      this.readonly = this.scopes[this.scope].readonly
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
