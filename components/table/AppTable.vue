<template>
  <div class="q-data-table">
    <table class="q-table horizontal-delimiter">
      <thead>
      <tr>
        <th style="width: 60px" class="text-align: center"></th>
        <th v-for="schema in schemas" v-bind="schema.head"><span v-html="schema.label"/></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="record in records">
        <td>
        </td>
        <td v-for="schema in schemas" v-bind="schema.body">
          <span v-html="schema.format(record[schema.field])"></span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script type="text/javascript">
  import { formatDate, formatMoney } from 'genesis/support/format/index'

  export default {
    name: 'app-table',
    props: {
      columns: {
        type: Array,
        required: true
      },
      records: {
        type: Array,
        required: true
      }
    },
    computed: {
      schemas () {
        const types = {
          date: {
            format: formatDate
          },
          money: {
            format: formatMoney,
            head: {'class': 'text-right'}, body: {'class': 'text-right'}
          }
        }
        const map = (column) => {
          const settings = types[column.type] ? types[column.type] : {}
          const item = Object.assign({}, settings, column)
          if (!item.format) {
            item.format = value => value
          }
          return item
        }
        return this.columns.map(map)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
