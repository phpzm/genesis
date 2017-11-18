import { get } from 'lodash'
import { actions } from '../../model'
import { setDotNotation } from 'genesis/support/transform'

export default {
  methods: {
    /**
     * @param {Object} record
     * @param {Function} callback
     */
    create (record, callback = null) {
      this.service
        .post(setDotNotation(record))
        .then(response => this.then(response, 'create', callback))
        .catch(error => this.catch(error, 'create', [record]))
    },
    /**
     * @param {string} id
     * @param {Function} callback
     */
    read (id = '', callback = null) {
      this.service
        .get(id)
        .then(response => this.then(response, 'read', callback))
        .catch(error => this.catch(error, 'read', [id]))
    },
    /**
     * @param {Object} record
     * @param {Function} callback
     */
    update (record, callback = null) {
      this.service
        .put(record[this.id], setDotNotation(record))
        .then(response => this.then(response, 'update', callback))
        .catch(error => this.catch(error, 'update', [record]))
    },
    /**
     * @param {string} id
     * @param {Function} callback
     */
    delete (id = '', callback = null) {
      this.service
        .delete(id)
        .then(response => this.then(response, 'delete', callback))
        .catch(error => this.catch(error, 'delete', [id]))
    },
    /**
     * @param {Object} parameters
     * @param {Object} config
     */
    search (parameters = {}, config = {}) {
      this.service
        .get('', parameters, config)
        .then(response => this.then(response, 'read'))
        .catch(error => this.catch(error, 'search', [parameters]))
    },
    /**
     * @param {AxiosError} error
     * @param {string} method
     * @param {Array} parameters
     */
    catch (error, method, parameters) {
      const handler = get(this.error, method, undefined)
      if (typeof handler === 'function') {
        return handler(error, parameters)
      }
      console.error(error)
    },
    /**
     * @param {Object} record
     * @param {Function} callback
     * @returns {record}
     */
    save (record, callback) {
      const scope = this.scopes[this.scope]
      if (scope.method && typeof this[scope.method] === 'function') {
        return this[scope.method](record, callback)
      }
    },
    /**
     * @param {string} component
     * @returns {string}
     */
    componentName (component) {
      return this.component + '-' + component
    },
    /**
     */
    renderElements () {
      // override
    },
    /**
     */
    renderActions () {
      // noinspection JSCheckFunctionSignatures
      const _actions = actions(this, this.actions)
      if (!Array.isArray(_actions)) {
        return
      }
      const buttons = _actions
        .filter(button => button.scopes.includes(this.scope))
        .map(button => {
          if (typeof button.validate === 'function') {
            button.disabled = button.validate(this.record, this.schemas, this)
          }
          return button
        })

      this.buttons.top = buttons.filter(button => button.positions.includes('top'))
      this.buttons.middle = buttons.filter(button => button.positions.includes('middle'))
      this.buttons.bottom = buttons.filter(button => button.positions.includes('bottom'))
      this.buttons.floating = buttons.filter(button => button.positions.includes('floating'))
    },
    /**
     */
    renderAll () {
      this.renderActions()
      this.renderElements()
    },
    /**
     * @param {Object} action
     */
    handler (action) {
      if (typeof action.handler === 'function') {
        action.handler(this.data, this.fields, this, action)
      }
    }
  }
}
