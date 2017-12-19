import { uniqid } from 'genesis/support/utils'

export default {
  props: {},
  methods: {
    nextStep () {
      this.$refs.form.$refs.stepper.next()
    },
    previousStep () {
      this.$refs.form.$refs.stepper.previous()
    }
  }
}
