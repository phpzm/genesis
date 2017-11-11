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
    timeout: {
      type: Number,
      default: () => 100
    },
    direction: {
      type: String,
      default: () => 'right'
    },
    debug: {
      type: Boolean,
      default: () => false
    }
  }
}
