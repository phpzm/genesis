import * as Validators from 'vuelidate/lib/validators'

const arrayToObject = (accumulate, item) => {
  accumulate[item.field] = item
  return accumulate
}

export default {
  methods: {
    /**
     * @param {string} field
     */
    formInput (field) {
      if (this.$v.record[field]) {
        this.$v.record[field].$touch()
      }
      // pass errors to fields
      this.schemas[field].errors = this.getErrors(field)

      // emit changes to parent
      if (!this.readonly) {
        this.$emit('form~input', this.record)
      }

      // get invalid fields
      const reduce = (accumulate, key) => {
        if (this.$v.record[key].$invalid) {
          accumulate[key] = true
        }
        return accumulate
      }
      const invalids = Object.keys(this.$v.record).reduce(reduce, {})
      // emit invalids to parent
      this.$emit('form~valid', !this.$v.$invalid, invalids)
    },
    /**
     * @param {string} event
     * @param {Vue} schema
     */
    formEvent (event, schema) {
      const field = schema.field
      this.fireEvent(field, event)
    },
    /**
     * @param {string} field
     * @param {string} event
     */
    fireEvent (field, event) {
      if (this.schemas[field] && this.schemas[field].events && typeof this.schemas[field].events[event] === 'function') {
        this.schemas[field].events[event](this.record, this.schemas, this)
      }
    },
    /**
     */
    touch () {
      this.$v.$touch()
    },
    /**
     */
    reset () {
      this.$v.$reset()
    },
    /**
     * @param fields
     * @returns {Object}
     */
    generateValidations (fields) {
      if (!Array.isArray(fields)) {
        return {}
      }
      const validations = {}
      fields
        .filter(schema => !!schema.validate)
        .forEach(schema => {
          validations[schema.field] = this.configureValidation(schema.validate)
        })
      return validations
    },
    /**
     * @param {Object} validate
     * @return {Object}
     */
    configureValidation (validate) {
      const configure = {}
      Object.keys(validate).forEach(property => {
        let action = Validators[property]
        if (!action.length) {
          configure[property] = action
          return true
        }
        configure[property] = action((validate[property]))
      })
      return configure
    },
    /**
     */
    updateComponents () {
      const components = {}
      if (this.tabs.length) {
        this.tabs.forEach(tab => {
          components[tab.name] = this.fields.filter(field => field.tab === tab.name).reduce(arrayToObject, {})
        })
      }
      this.components = components
    },
    /**
     */
    updateSchemas () {
      this.schemas = this.fields.reduce(arrayToObject, {})
    },
    /**
     */
    updateRecord () {
      const reduce = (accumulate, field) => {
        accumulate[field] = this.data[field] || this.schemas[field].default
        if (this.$route.query[field]) {
          accumulate[field] = this.$route.query[field]
        }
        return accumulate
      }
      const record = Object.keys(this.schemas).reduce(reduce, {})
      this.setRecord(record)
    },
    /**
     * @param {Object} record
     * @returns this
     */
    setRecord (record) {
      this.record = record
      Object.keys(record).forEach(field => {
        if (record[field] !== undefined && this.schemas[field]) {
          this.fireEvent(field, 'change')
        }
      })
      // execute the change function of form
      this.executeChange()
      return this
    },
    executeChange () {
      if (typeof this.change === 'function') {
        this.change(this.record, this.schemas, this)
      }
    },
    /**
     * @param {String} field
     * @return {Array}
     */
    getErrors (field) {
      const errors = []
      if (this.schemas[field].validate && this.$v.record[field] && this.$v.record[field].$error) {
        Object.keys(this.schemas[field].validate).forEach(rule => {
          const status = this.$v.record[field][rule]
          const parameters = this.$v.record[field].$params[rule]
          errors.push({rule, status, parameters})
        })
      }
      return errors
    }
  }
}
