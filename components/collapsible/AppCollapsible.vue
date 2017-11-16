<template>
  <div class="q-collapsible q-item-division relative-position" :class="{'q-collapsible-open': open}">
    <div class="q-item q-item-division relative-position q-item-link" @click="open = !open">
      <div v-if="icon" class="q-item-side q-item-side-left q-item-section">
        <q-icon v-bind="icon"/>
      </div>
      <div v-if="label" class="q-item-main q-item-section">
        <div class="q-item-label" v-html="label"/>
      </div>
      <div class="q-item-side q-item-side-right q-item-section">
        <div class="cursor-pointer relative-position inline-block">
          <q-icon name="keyboard_arrow_up"></q-icon>
        </div>
      </div>
    </div>

    <div class="q-collapsible-sub-inner">
      <div class="q-collapsible-sub-item relative-position">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    name: 'app-collapsible',
    props: {
      label: {
        default: () => ('')
      },
      icon: {
        default: () => ({})
      }
    },
    data: () => ({
      open: false
    })
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .q-item-main.q-item-section
    overflow hidden
    display -webkit-box
    -webkit-box-orient vertical
  .q-icon
    font-size 24px
  .q-collapsible-sub-inner
    max-height 0
    overflow hidden
    transition max-height .7s
  .q-item-side.q-item-side-right
    .q-icon
      transition transform  .7s
      transform rotate(0deg)
  .q-collapsible.q-collapsible-open
    & > .q-item > .q-item-side.q-item-side-right
      .q-icon
        transform rotate(180deg)
    & > .q-collapsible-sub-inner
      max-height 100vh
      transition max-height .7s
</style>
