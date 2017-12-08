<template>
  <field :class="classNames" v-bind="{id, inline, problems, label, validate, title, tooltip, editable, visible}">
    <div slot="component">
      <div v-show="editable" class="color-wrapper grid" :class="{'has-error': problems.length}">
        <div class="color" :style="{'background': hex}"></div>
        <q-btn color="primary" class="color-button">
          <q-icon name="search"></q-icon>
          <q-popover ref="popover">
            <sketch :value="hex" @input="updateValue"></sketch>
          </q-popover>
        </q-btn>
      </div>
      <div v-show="!editable" class="html grid">
        <div class="color" :style="{'background': value}"></div>
      </div>
    </div>
  </field>
</template>

<script type="text/javascript">
  import Field from 'genesis/components/fields/components/base.vue'
  import FieldAbstract from 'genesis/components/fields/abstract'
  import { Sketch } from 'vue-color'

  export default {
    extends: FieldAbstract,
    components: {
      Field, Sketch
    },
    name: 'field-color',
    data: () => ({
      hex: ''
    }),
    props: {
      color: {
        type: String,
        default: '#FFFFFF'
      }
    },
    methods: {
      updateValue (color) {
        this.hex = color
        this.$emit('input', color)
      }
    },
    watch: {
      value (color) {
        this.hex = color
      }
    },
    created () {
      this.hex = this.color
      this.updateValue(this.color)
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .field-color
    .color-wrapper
      height 40px
    .color-button
      height 37px
      color #89919E
    .color
      display inline-block
      width 60px
      height 37px
      margin 0 10px 0 0
      border-radius 3px
      border 1px solid #e8e5e5
      box-shadow 0 2px 3px rgba(0, 0, 0, 0.22), 0 1px 2px rgba(0, 0, 0, 0.24)
    .html
      height 40px
      color #515151
      font-family Roboto
      font-size 14.4px
</style>
