<template>
  <field :class="classNames" v-bind="{id, inline, problems, label, validate, title, tooltip, editable, visible}">
    <div slot="component">

      <div v-show="editable" :class="{'has-error': problems.length}">
        <div ref="input" class="input full-width" :class="{'disabled': disabled}">
          <span v-if="!selected" class="field-placeholder">{{ placeholder }}</span>
          <span v-else :class="'selected ellipsis'">{{ selected }}</span>
          <div class="pull-right" style="margin: -10px -9px" v-if="!disabled">
            <app-button v-if="selected" v-bind="{small: true, round: true, color: 'negative', icon: 'clear'}"
                        class="clear" @click="clear"/>
            <app-button v-bind="{small: true, raised: false, rotate: false, icon: 'search'}"
                        class="widget" @click="openWidget"/>
          </div>
        </div>
      </div>
      <div v-show="!editable" class="html ellipsis" v-html="html"></div>

      <q-modal ref="modal" position="bottom" class="field-search-modal" :content-css="css">
        <div class="text-right">
          <span>
            <q-icon class="cursor-pointer field-search-closer" name="cancel" @click="closeWidget"></q-icon>
            <app-tooltip>Fechar</app-tooltip>
          </span>
        </div>
        <hr class="light">

        <div class="field-search-header">
          <h6>{{ messages.label }} {{ description || label }}</h6>
        </div>

        <div class="field-search-input">
          <q-search ref="search" v-model="search" :debounce="400" inverted placeholder="Digite para pesquisar"
                    icon="search" float-label="Pesquisa" @change="searchData(search, true)"/>
        </div>

        <div class="field-search-list">

          <div v-if="rows.length">
            <q-list link separator multiline>
              <q-item v-for="(row, key) in rows" :key="key" @click="searchSelected(row)">
                <q-item-main>
                  <q-item-tile label v-html="row.label"/>
                  <q-item-tile sublabel v-html="row.sublabel"/>
                </q-item-main>
              </q-item>
            </q-list>
          </div>

          <div v-else class="no-data">
            <div v-if="register && search" class="item-content">
              O termo pesquisado não retornou resultados. Você pode adicionar um novo item usando:
              &nbsp;<span style="font-style: italic">`{{ search }}`</span>
              <br><br>
              <app-button class="primary" icon="add" color="primary" label="Criar novo Item"
                          @click="searchRegister(search)"/>
            </div>
            <div v-else class="text-center">
              <small>Nenhum registro encontrado</small>
            </div>
          </div>

        </div>

        <div class="form no-rotate">
          <div class="field has-50">
            <q-pagination v-model="pagination.page" :max="pagination.last" @input="searchData(search)"/>
          </div>
          <div class="field has-50 text-right" style="padding: 25px 0">
            <small v-html="message"/>
          </div>
        </div>

      </q-modal>
    </div>
  </field>
</template>

<script type="text/javascript">
  import { get } from 'lodash'
  import { Data } from 'genesis'
  import { wildcard } from 'genesis/support/utils'
  import Field from 'genesis/components/fields/components/base.vue'
  import FieldAbstract from 'genesis/components/fields/abstract'
  import AppButton from '../../button/AppButton.vue'

  export default {
    extends: FieldAbstract,
    components: {
      Field, AppButton
    },
    name: 'field-search',
    props: {
      remote: {
        type: Object,
        default: () => ({})
      },
      placeholder: {
        type: String,
        default: () => ('.:. Pesquisar .:.')
      },
      filters: {
        type: Object,
        default: () => ({})
      },
      parameters: {
        type: Function,
        default: () => {
          return (query, remote, filters) => {
            return Object.assign({}, {query}, {order: remote.reference.label}, filters)
          }
        }
      },
      messages: {
        type: Object,
        default: () => ({
          label: 'Pesquisar por',
          pagination: 'Exibindo registros de <b>{start}</b> de <b>{end}</b> de um total de <b>{total}</b>'
        })
      },
      description: {
        type: String,
        default: () => ('')
      },
      register: {
        type: Boolean,
        default: () => (false)
      },
      css: {
        type: Object,
        default: () => ({
          overflow: 'hidden',
          maxHeight: '100vh',
          height: '90vh'
        })
      }
    },
    data: () => ({
      model: undefined,
      selected: undefined,
      search: '',
      rows: [],
      pagination: {
        size: 10,
        page: 1,
        last: 1,
        total: 0,
        start: 1,
        end: 1
      },
      updated: false
    }),
    computed: {
      html () {
        return ''
      },
      message () {
        return wildcard(get(this.messages, 'pagination', ''), this.pagination)
      }
    },
    methods: {
      /**
       */
      openWidget () {
        this.$refs.modal.open()
        window.setTimeout(this.$refs.search.focus, 100)
        this.searchData(this.search)
      },
      /**
       */
      closeWidget () {
        this.$refs.modal.close()
      },
      /**
       */
      clear () {
        this.model = ''
        this.selected = ''
        this.$emit('input', undefined)
      },
      /**
       * @param {string} term
       */
      searchRegister (term) {
        const record = {}
        record[this.remote.reference.label] = term
        // noinspection JSValidateTypes
        this.remote.service.post(record).then(response => this.searchData(term, true))
      },
      /**
       * @param {string} term
       * @param {boolean} reset
       */
      searchData (term, reset) {
        let parameters = this.parameters(term, this.remote, this.filters)
        if (reset) {
          this.pagination.page = 1
        }
        this.searchRequest(parameters, (rows) => (this.rows = rows))
      },
      /**
       * @param filters
       * @param done
       */
      searchRequest (filters, done) {
        /**
         * @type {Function}
         */
        const configure = Data.get('search')

        this.remote
          .service
          .get('', configure(this.pagination.page, this.pagination.size, filters), {})
          .then((response) => (this.searchParser(response, done)))
          .catch(() => (done([])))
      },
      /**
       * @param {AxiosResponse} response
       * @param {Function} done
       */
      searchParser (response, done) {
        const body = this.$http.$body(response)
        const meta = this.$http.$meta(response)

        if (!Array.isArray(body)) {
          return done([])
        }

        const value = this.remote.reference.value
        const label = this.remote.reference.label
        let details = this.remote.reference.details
        if (typeof details !== 'function') {
          details = row => row[value]
        }

        this.pagination.total = meta.total
        this.pagination.last = Math.ceil(this.pagination.total / this.pagination.size) || 1

        const start = (this.pagination.size * (this.pagination.page - 1))
        const end = start + this.pagination.size
        this.pagination.start = start + 1
        this.pagination.end = end > this.pagination.total ? this.pagination.total : end

        const map = row => ({
          value: String(row[value]),
          label: row[label],
          sublabel: details(row),
          row: row
        })

        return done(body.map(map))
      },
      /**
       * @param item
       * @param local
       */
      searchSelected (item, local = false) {
        this.selected = item.label
        this.model = item.value

        if (!local) {
          this.updated = true
          this.$emit('event', 'selected', this, item.row)
          this.$emit('input', item.value)
        }
        this.closeWidget()
      },
      /**
       * @param value
       */
      applyValue (value) {
        if (!value) {
          return
        }
        const filter = {}
        filter[this.remote.reference.value] = value
        const done = data => {
          if (data.length) {
            this.searchSelected(data[0], true)
          }
        }
        this.searchRequest(filter, done)
      }
    },
    watch: {
      value (value) {
        if (!this.updated) {
          this.applyValue(value)
        }
        this.updated = false
      }
    },
    mounted () {
      this.applyValue(this.value)
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '~variables'

  .field-search
    position relative
    .input
      .field-placeholder
        color #c3c3c3
      .selected
        position absolute
        width calc(100% - 55px)
        overflow hidden
        height 21px
      button
        &.widget
          width 30px
          height 38px
          padding 0 15px
          box-shadow none
          overflow hidden
          background $field-button-background
          color $field-button-color
        i
          font-size 20px
        &.clear
          height 30px
          width 30px
          transition opacity .9s
          opacity 0
      &:hover button.clear
        opacity 1

  .field-search-modal
    .modal-content
      max-height 100%
      min-width 80vw
      min-height 50vh
      padding 0 20px 10px 20px
      border-radius 4px 4px 0 0
    .field-search-closer
      font-size 24px
      margin 10px -10px 0 0
      color #b10000
    .field-search-list
      height calc(100% - 200px)
      overflow auto
      border 1px #ddd solid
      border-radius 2px
      .q-list
        border none
      .no-data
        padding 40px
    .q-if:before
      content unset

  @media (max-width 768px)
    .field-search-modal
      .modal-content
        height 100vh !important
        border-radius 0 !important
</style>
