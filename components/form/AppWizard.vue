<template>
  <div class="app-form">
    <q-stepper v-model="currentStep" ref="stepper">
      <q-step v-for="step in steps" :name="step.name"
              :key="step.name" :title="step.title" :subtitle="step.subtitle" :icon="step.icon">
        <component v-for="schema in components[step.name]" :key="schema.field" :is="schema.component"
                   v-bind="schema" v-model="record[schema.field]"
                   @input="formInput(schema.field, arguments)" @event="formEvent"></component>
        <q-stepper-navigation>
          <q-btn :disable="step.navigation.back === ''"
                 outline small color="primary" @click="currentStep = step.navigation.back">Voltar</q-btn>
          <q-btn  :disable="step.navigation.next === ''"
                  outline small color="primary" @click="currentStep = step.navigation.next">Avançar</q-btn>
        </q-stepper-navigation>
      </q-step>
      <q-stepper-navigation>
        <q-btn flat @click="$refs.stepper.previous()">Back</q-btn>
        <q-btn @click="$refs.stepper.next()">Next</q-btn>
      </q-stepper-navigation>
    </q-stepper>
  </div>
</template>

<script type="text/javascript">
  import appForm from './AppForm'
  export default {
    name: 'app-wizard',
    extends: appForm,
    created () {
      this.currentStep = this.step
      if (!this.currentStep) {
        this.currentStep = (Array.isArray(this.steps) && this.step[0]) ? this.step[0].name : ''
      }
      if (this.$route.query.step) {
        this.currentStep = this.$route.query.step
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .q-stepper
      box-shadow none
      .q-stepper-header
        box-shadow none
      .q-stepper-step
        .q-stepper-step-content
          .q-stepper-step-inner
            padding 10px 3px !important
</style>
