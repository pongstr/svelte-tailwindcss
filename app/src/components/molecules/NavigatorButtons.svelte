<script>
  import ButtonIcon from '../atoms/ButtonIcon.svelte'

  export let editorToolbar = false
</script>

<div class="toolbar-button-group">
  <ButtonIcon
    outline
    float
    size={!editorToolbar ? 24 : 18}
    icon="chevron-left"
    disabled={window.history.length - 1 === 0}
    on:click={() => history.back()}
  />
  <ButtonIcon
    outline
    float
    size={!editorToolbar ? 24 : 18}
    icon="chevron-right"
    disabled={window.history.length - 1 === 0}
    on:click={() => history.forward()}
  />
</div>
