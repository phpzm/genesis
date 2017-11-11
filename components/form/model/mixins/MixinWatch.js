export default {
  watch: {
    /**
     * @param data
     */
    data (data) {
      const reduce = (accumulate, key) => {
        accumulate[key] = data[key]
        return accumulate
      }
      this.setRecord(Object.keys(data).reduce(reduce, {}))
    }
  }
}
