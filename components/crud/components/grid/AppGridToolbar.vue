<!--suppress RequiredAttributes -->
<template>
  <div class="form app-grid-toolbar">
    <template v-if="paginate">
      <div v-if="toolbar.elementsPaginate.pagination.show"
            :class="['field', toolbar.elementsPaginate.pagination.className ]"
           class="app-grid-pagination">
        <q-pagination v-model="pagination" v-bind="{max}" @input="emitPagination(pagination)"/>
      </div>
      <div v-if="toolbar.elementsPaginate.select.show"
            :class="['field', toolbar.elementsPaginate.select.className ]">
        <q-select v-model="select" v-bind="{options}" @input="emitSelect(select)"></q-select>
      </div>
      <div v-if="toolbar.elementsPaginate.info.show"
            :class="['field', toolbar.elementsPaginate.info.className ]"
           class="app-grid-info">
        <div v-if="counter.total">{{ counter.start }} - {{ counter.end }} de {{ counter.total }}</div>
        <div v-else class="counter">Exibindo {{ counter.end }} registros</div>
      </div>
    </template>
    <div :class="['field',  toolbar.show ? 'has-40' : 'has-100']">
      <app-button-bar v-bind="{buttons, handler, direction}"/>
    </div>
  </div>
</template>

<script type="text/javascript">
  import AppButtonBar from 'genesis/components/button/AppButtonBar.vue'

  const options = [
    {
      value: 5,
      label: '5'
    },
    {
      value: 10,
      label: '10'
    },
    {
      value: 15,
      label: '15'
    },
    {
      value: 25,
      label: '25'
    },
    {
      value: 50,
      label: '50'
    }
  ]

  export default {
    components: {
      AppButtonBar
    },
    name: 'app-grid-toolbar',
    props: {
      buttons: {
        type: Array,
        required: true
      },
      handler: {
        type: Function,
        required: true
      },
      direction: {
        type: String,
        required: true
      },
      page: {
        type: Number,
        required: true
      },
      pages: {
        type: Number,
        required: true
      },
      limit: {
        type: Number,
        required: true
      },
      total: {
        type: Number,
        required: true
      },
      paginate: {
        type: Boolean,
        default: () => true
      },
      toolbar: {
        type: Object,
        default: () => ({
          show: false,
          className: 'top-navigation',
          elementsPaginate: {
            pagination: {
              show: true,
              className: 'has-25 xs-70'
            },
            select: {
              show: true,
              className: 'has-15 xs-30'
            },
            info: {
              show: true,
              className: 'has-15 xs-30'
            }
          }
        })
      }
    },
    data: () => ({
      max: 1,
      pagination: 1,
      select: 25,
      options: options,
      counter: {
        start: 1,
        end: 1,
        total: 1
      }
    }),
    methods: {
      /**
       * @param {int} pagination
       */
      emitPagination (pagination) {
        this.$emit('change-page', pagination)
      },
      /**
       * @param {int} select
       */
      emitSelect (select) {
        this.$emit('change-limit', select)
      },
      updateCounter () {
        const start = (this.limit * (this.page - 1))
        const end = start + this.limit
        this.counter.start = start + 1
        this.counter.end = end > this.total ? this.total : end
        this.counter.total = this.total
      }
    },
    watch: {
      page (page) {
        this.pagination = page
        this.updateCounter()
      },
      pages (pages) {
        this.max = pages
        this.updateCounter()
      },
      limit (limit) {
        this.select = limit
        this.updateCounter()
      },
      total () {
        this.updateCounter()
      }
    },
    created () {
      this.pagination = this.page
      this.select = this.limit
      this.max = this.pages

      this.updateCounter()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .app-grid-toolbar
    .field
      padding 5px 10px
      &:first-child
        padding 5px 10px 5px 0
      &:last-child
        padding 5px 0 5px 10px
    .q-select
      margin 6px 0 0 0
    .q-if:before, .q-if:after
      display none

    .app-grid-pagination
      .q-pagination
        padding 0
        width 100%
        button
          max-height 36px
          height 36px
        .q-input
          margin 0
          width 46% !important
        .q-if
          padding-bottom 0

    .app-grid-info
      padding 14px 0 0 0
</style>
