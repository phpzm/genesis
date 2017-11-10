<template>
  <div class="app-link">
    <router-link :to="to">{{ value }}</router-link>
    <app-tooltip>{{ tooltip }}</app-tooltip>
  </div>
</template>

<script type="text/javascript">
  const AppLink = {
    name: 'app-link',
    props: {
      path: {
        default: () => ''
      },
      value: {
        default: () => ''
      },
      record: {
        default: () => ({})
      }
    },
    computed: {
      to () {
        const reduce = (path, property) => path.replace(`{${property}}`, this.record[property])
        return {
          path: Object.keys(this.record).reduce(reduce, String(this.path)),
          query: this.$route.query
        }
      },
      tooltip () {
        return this.record ? this.record.name : ''
      }
    }
  }
  export default AppLink
</script>
