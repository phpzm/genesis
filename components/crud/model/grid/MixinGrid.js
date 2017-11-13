import { Data } from 'genesis'
import { undo } from 'genesis/support/message/index'
import { wildcard } from 'genesis/support/utils/index'

export default {
  props: {
    scope: {
      type: String,
      default: () => 'index'
    },
    messages: {
      type: Object,
      default: () => ({
        read: '',
        delete: 'Registro apagado com sucesso'
      })
    },
    handlers: {
      type: Object,
      default () {
        return {
          read: (response) => {
            const populateGrid = Data.get('grid')
            populateGrid(this, response)
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
    position: {
      type: String,
      default: () => 'left'
    },
    slots: {
      type: Array,
      default: () => ([])
    },
    filters: {
      type: Array,
      default: () => ([])
    },
    paginate: {
      type: Boolean,
      default: () => true
    },
    unity: {
      type: String,
      default: () => 'vw'
    },
    filtering: {
      type: Boolean,
      default: () => true
    },
    styles: {
      type: Object,
      default: () => ({
        height: 'calc(100vh - 290px)',
        minHeight: '200px'
      })
    },
    bodyStyle: {
      type: Object,
      default: () => ({
        height: 'calc(100vh - 330px)',
        minHeight: '170px'
      })
    },
    limiting: {
      type: Number,
      default: () => (25)
    }
  },
  data: () => ({
    fields: [],
    columns: [],
    data: [],
    page: 1,
    pages: 1,
    limit: 25,
    total: 1
  }),
  methods: {
    /**
     */
    renderElements () {
      this.fields = this.schemas.filter(this.filterColumns).map(this.mapColumns)
      let method = 'unshift'
      if (this.position === 'right') {
        method = 'push'
      }
      this.fields[method]({field: 'options', label: 'Opções', width: '70px'})

      this.columns = this.fields.filter(field => !field.hidden)
    },
    /**
     * @param {Object} item
     * @returns {Array}
     */
    mapColumns (item) {
      const assign = {
        field: item.grid.field,
        width: typeof item.grid.width === 'number' ? item.grid.width + this.unity : item.grid.width
      }
      return Object.assign({}, item.grid, assign)
    },
    /**
     * @param {Object} item
     * @returns {Object}
     */
    filterColumns (item) {
      return item.scopes.includes(this.scope)
    },
    /**
     * @returns {boolean}
     */
    isPaginated () {
      return this.paginate
    },
    /**
     * @param {int} page
     */
    changePage (page) {
      this.page = page
      this.browse(this.path, {page: this.page, limit: this.limit})
    },
    /**
     * @param {int} limit
     */
    changeLimit (limit) {
      this.limit = limit
      this.changePage(1)
    },
    /**
     * @param {boolean} noCache
     */
    fetchData (noCache = false) {
      const filters = Object.keys(this.filter.record).reduce((accumulate, key) => {
        let value = this.filter.record[key]
        if (this.filter.rules[key]) {
          value = this.filter.rules[key] + this.separator + value
        }
        accumulate[key] = value
        return accumulate
      }, {})

      /**
       * @type {Function}
       */
      const configure = Data.get('search')

      const search = () => {
        this.search(configure(this.page, this.limit, filters), {noCache})
      }

      window.setTimeout(search, this.timeout)
    },
    /**
     * @param {AxiosError} error
     * @param {string} method
     * @param {Array} parameters
     */
    catch (error, method, parameters) {
      console.log('~>', this.$options.name, error)
    }
  },
  created () {
    if (this.$route.query.page) {
      this.page = parseInt(this.$route.query.page)
      this.pages = parseInt(this.$route.query.page)
    }
    this.limit = this.limiting
    if (this.$route.query.limit) {
      this.limit = parseInt(this.$route.query.limit)
    }
    this.renderAll()
    this.renderFilters()
    this.loadFilters()
  },
  mounted () {
    this.fetchData()
  }
}
