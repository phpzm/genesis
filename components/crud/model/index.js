import { Crud } from 'genesis'

export { default as MixinComputed } from 'genesis/components/crud/model/general/MixinComputed'
export { default as MixinData } from 'genesis/components/crud/model/general/MixinData'
export { default as MixinMethods } from 'genesis/components/crud/model/general/MixinMethods'
export { default as MixinProps } from 'genesis/components/crud/model/general/MixinProps'

/**
 * @param {Vue} $this
 * @param {*} actions
 * @returns {Array}
 */
export const actions = ($this, actions) => {
  if (Array.isArray(actions)) {
    return actions
  }
  const buttons = Crud.get('buttons')
  if (typeof actions === 'function') {
    return actions($this, buttons($this))
  }
  return buttons($this)
}
