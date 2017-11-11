import { get } from 'lodash'
import { clone } from 'genesis/support/utils'

export default {
  props: {
    rule: {
      type: String,
      default: () => ''
    },
    separator: {
      type: String,
      default: () => ''
    }
  },
  data: () => ({
    filter: {
      active: false,
      columns: [],
      record: {},
      rules: {},
      css: {
        padding: '0',
        height: '100vh',
        maxHeight: '100vh',
        width: '30vw',
        maxWidth: '30vw',
        borderRadius: '0'
      }
    }
  }),
  methods: {
    /**
     */
    filterOpen () {
      this.$refs.filter.open()
    },
    /**
     */
    filterClose () {
      window.setTimeout(this.$refs.filter.close, this.timeout)
    },
    /**
     */
    filterApply () {
      const query = this.$route.query

      Object.keys(this.filter.record).forEach(key => (delete query[key]))

      Object.keys(this.filter.record).forEach(key => {
        let value = this.filter.record[key]
        if (value === undefined) {
          return
        }
        if (typeof value === 'string' && value.length === 0) {
          return
        }
        if (typeof value === 'boolean') {
          value = value ? '1' : '0'
        }
        query[key] = value
      })

      this.browse(this.path, query)
    },
    /**
     */
    filterClear () {
      const query = this.$route.query
      Object.keys(this.filter.record).forEach(key => delete query[key])
      this.browse(this.path, query)
    },
    /**
     * @param {object} schema
     * @returns {boolean}
     */
    filterFilters (schema) {
      const filter = get(schema, 'grid.filter')
      return typeof filter === 'object'
    },
    /**
     * @param {Object} column
     * @returns {Object}
     */
    mapFilters (column) {
      const {grid, form} = column
      const {filter} = grid
      const base = {
        component: this.parseFilterComponent(filter, grid, form),
        value: get(filter, 'value', undefined),
        rule: get(filter, 'rule', this.rule)
      }
      const map = Object.assign({}, form, grid, base)
      map.width = 100
      delete map.validate
      delete map.filter
      delete map.hidden
      return map
    },
    /**
     * @param filter
     * @param grid
     * @param form
     * @returns {*|string}
     */
    parseFilterComponent (filter, grid, form) {
      let component = get(filter, 'component')
      if (component) {
        return this.componentName(component)
      }
      component = get(grid, 'component')
      if (component) {
        return this.componentName(component)
      }
      component = get(form, 'component')
      if (component) {
        return this.componentName(component)
      }
    },
    /**
     * @param {Object} accumulate
     * @param {Object} filter
     * @returns {Object}
     */
    reduceFiltersRecord (accumulate, filter) {
      accumulate[filter.field] = filter.value
      return accumulate
    },
    /**
     * @param {Object} accumulate
     * @param {Object} filter
     * @returns {Object}
     */
    reduceFiltersRules (accumulate, filter) {
      accumulate[filter.field] = filter.rule
      return accumulate
    },
    /**
     */
    renderFilters () {
      const schemas = clone(this.schemas)
      schemas.shift()
      const columns = schemas.filter(this.filterFilters)
      const filters = this.filters.filter(this.filterFilters)

      const filterColumns = columns.map(this.mapFilters)
      const filterAdditional = filters.map(this.mapFilters)

      const all = []
      all.push(...filterColumns)
      all.push(...filterAdditional)

      this.filter.columns = all

      this.filter.record = this.filter.columns.reduce(this.reduceFiltersRecord, {})
      this.filter.rules = this.filter.columns.reduce(this.reduceFiltersRules, {})
    },
    /**
     * @param {*} value
     * @param {string} separator
     * @returns {*}
     */
    clearFilter (value, separator) {
      if (value === undefined) {
        return value
      }
      if (!separator) {
        return value
      }
      const split = String(value).split(separator)
      if (split.length < 2) {
        return value
      }
      split.shift()
      return split.join(separator)
    },
    /**
     */
    loadFilters () {
      const record = Object.keys(this.filter.record).reduce((accumulate, key) => {
        const value = this.clearFilter(this.$route.query[key], this.separator)
        if (value !== undefined) {
          accumulate[key] = value
        }
        return accumulate
      }, {})
      this.filter.record = record
      this.filter.active = !!Object.keys(record).length
    }
  }
}
