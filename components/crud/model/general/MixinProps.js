export default {
  props: {
    scopes: {
      type: Object,
      default: () => ({
        index: {},
        create: {
          method: 'create'
        },
        edit: {
          method: 'update'
        },
        view: {
          readonly: true
        }
      })
    },
    scope: {
      type: String
    },
    service: {
      type: Object,
      required: true,
      default: () => ({})
    },
    path: {
      type: String,
      required: true,
      default: () => ''
    },
    schemas: {
      type: Array,
      required: true,
      default: () => ([])
    },
    actions: {
      default: () => null
    },
    component: {
      type: String,
      default: () => 'field'
    },
    id: {
      type: String,
      default: () => 'id'
    },
    bottom: {
      type: Boolean,
      default: () => true
    },
    top: {
      type: Boolean,
      default: () => true
    },
    floating: {
      type: Boolean,
      default: () => true
    },
    timeout: {
      type: Number,
      default: () => 100
    },
    watches: {
      type: Object,
      default: () => ({})
    },
    direction: {
      type: String,
      default: () => 'right'
    },
    className: {
      type: Array,
      default: () => ([])
    },
    debug: {
      type: Boolean,
      default: () => false
    }
  }
}
