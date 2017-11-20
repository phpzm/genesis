<template>
  <div class="app-button-bar" :style="style" :class="{'fixed-bottom-right': floating}">
    <template v-if="!floating || buttons.length === 1">
      <q-button v-if="permissionCheck(button, record)" v-for="button in buttons" :key="button.id" v-bind="button"
                @click="handler(button)" class="button-default">
        <app-tooltip :disable="!button.tooltip">{{ button.tooltip }}</app-tooltip>
      </q-button>
    </template>
    <template v-else>
      <q-fab color="primary" icon="add" direction="up">
        <q-fab-action v-if="permissionCheck(button, record)" v-for="button in buttons" :key="button.id"
                      @click="handler(button)" :color="button.color" :icon="button.icon" class="rotate">
          <app-tooltip :anchor="'center left'" :self="'center right'" :offset="[10, 10]" :disabled="!button.tooltip">
            {{ button.tooltip }}
          </app-tooltip>
        </q-fab-action>
      </q-fab>
    </template>
  </div>
</template>

<script type="text/javascript">
  import MixinPermission from 'genesis/components/@mixins/MixinPermission'

  export default {
    mixins: [
      MixinPermission
    ],
    name: 'app-button-bar',
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
        default: () => 'right'
      },
      record: {
        type: Object,
        default: () => ({})
      },
      floating: {
        type: Boolean,
        default: () => false
      }
    },
    computed: {
      style () {
        return {
          'text-align': this.direction
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .app-button-bar
    button.button-default
      margin 0 5px
    button.button-default:first-child
      margin 0 5px 0 0
    button.button-default:last-child
      margin 0 0 0 5px

  @media (max-width 768px)
    .app-button-bar
      display flex
      flex-wrap wrap
      justify-content space-between
      button:not(.q-btn-round)
        height 40px
        margin 5px !important
</style>
