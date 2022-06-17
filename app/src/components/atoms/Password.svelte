<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import ButtonIcon from './ButtonIcon.svelte'

  export let id: string
  export let label: string
  export let model: string
  export let visibility: boolean
  export let placeholder = ''
  export let disabled = false

  const dispatch = createEventDispatcher<{ change: string }>()
  function changeEvent(): void {
    dispatch('change', model)
  }

  function toggleVisibility(): void {
    visibility = !visibility
  }
</script>

<label for={id}>{label}</label>
<div class="input-password-container">
  <div class="input-password-field">
    {#if visibility}
      <input
        type="text"
        {id}
        name={id}
        bind:value={model}
        on:change={changeEvent}
        {placeholder}
      />
    {:else}
      <input
        type="password"
        {id}
        name={id}
        class:disabled
        {disabled}
        bind:value={model}
        on:change={changeEvent}
        {placeholder}
      />
    {/if}
    <span>
      <ButtonIcon
        float
        size="small"
        on:click={toggleVisibility}
        icon={visibility ? 'eye' : 'eye-off'}
      />
    </span>
  </div>
</div>

<style lang="sass">
label
  display: block
  width: 100%

.input-password-container
  display: inline-flex
  justify-content: flex-start
  align-items: center

.input-password-field
  position: relative

.input-password-field input
  min-width: 280px
  margin-left: 0
  padding-right: calc(var(--spacing) * 3)

  &:disabled
    opacity: 0.5
    cursor: not-allowed

.input-password-field span
  position: absolute
  top: 8px
  right: 16px
</style>
