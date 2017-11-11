<template>
  <div class="app-link">
    <router-link :to="to">{{ value }}</router-link>
    <app-tooltip :disable="!tooltip">{{ tooltip }}</app-tooltip>
  </div>
</template>

<script type="text/javascript">
  import { get } from 'lodash'

  const AppLink = {
    name: 'app-link',
    props: {
      path: {
        default: () => ''
      },
      label: {
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
        return get(this.record, this.label, '')
      }
    }
  }
  export default AppLink
</script>
