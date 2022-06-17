<script lang="ts">
  import { workspaceStore } from '@/store'
  import HeroIcon from '../atoms/HeroIcon.svelte'
  import Button from '../atoms/Button.svelte'

  let editorOptions = $workspaceStore.current.editor

  function updateEditorSettings(): void {
    workspaceStore.updateWorkspace({
      ...$workspaceStore.current,
      editor: { ...editorOptions },
    })
  }
</script>

<div class="settings-section">
  <header>
    <HeroIcon size={24} outline icon="pencil-alt" />
    <h2 class="heading">Editor Settings</h2>
  </header>
  <section style="color: rgba(var(--rgb-gray-100), 0.5)">
    {#if $workspaceStore.current}
      <form on:submit|preventDefault={updateEditorSettings}>
        <h3>Font Settings</h3>

        <div class="field-container">
          <label for="fontFamily">FontFamily</label>
          <input
            type="text"
            name="fontFamily"
            id="fontFamily"
            spellcheck="false"
            on:change={updateEditorSettings}
            bind:value={editorOptions.fontFamily}
          />
        </div>

        <div class="field-container">
          <label for="fontSize">FontFamily</label>
          <input
            type="number"
            name="fontSize"
            id="fontSize"
            on:change={updateEditorSettings}
            bind:value={editorOptions.fontSize}
          />
        </div>

        <div class="field-container">
          <label for="lineHeight">Line Height</label>
          <input
            type="number"
            name="lineHeight"
            id="lineHeight"
            step="0.5"
            on:change={updateEditorSettings}
            bind:value={editorOptions.lineHeight}
          />
        </div>

        <div class="field-container">
          <label for="contextmenu">Context Menu</label>
          <select
            name="contextmenu"
            id="contextmenu"
            on:change={updateEditorSettings}
            bind:value={editorOptions.contextmenu}
          >
            <option value={true}>True</option>
            <option value={false}>False</option>
          </select>
        </div>

        <div class="field-container">
          <label for="dragAndDrop">Drag &amp; Drop</label>
          <select
            name="dragAndDrop"
            id="dragAndDrop"
            on:change={updateEditorSettings}
            bind:value={editorOptions.dragAndDrop}
          >
            <option value={true}>True</option>
            <option value={false}>False</option>
          </select>
        </div>

        <div class="field-container">
          <label for="emptySelectionClipboard">Empty Selection Clipboard</label>
          <select
            name="dragAndDrop"
            id="dragAndDrop"
            on:change={updateEditorSettings}
            bind:value={editorOptions.emptySelectionClipboard}
          >
            <option value={true}>True</option>
            <option value={false}>False</option>
          </select>
        </div>

        <div class="field-container">
          <label for="folding">Folding</label>
          <select
            name="folding"
            id="folding"
            on:change={updateEditorSettings}
            bind:value={editorOptions.folding}
          >
            <option value={true}>True</option>
            <option value={false}>False</option>
          </select>
        </div>

        <div class="field-container">
          <label for="foldingHighlight">Folding Highlight</label>
          <select
            name="foldingHighlight"
            id="foldingHighlight"
            on:change={updateEditorSettings}
            bind:value={editorOptions.foldingHighlight}
          >
            <option value={true}>True</option>
            <option value={false}>False</option>
          </select>
        </div>

        <div class="field-container">
          <label for="foldingStrategy">Folding Strategy</label>
          <select
            name="foldingStrategy"
            id="foldingStrategy"
            on:change={updateEditorSettings}
            bind:value={editorOptions.foldingStrategy}
          >
            <option value="auto">Auto</option>
            <option value="indentation">indentation</option>
          </select>
        </div>

        <div class="field-container">
          <label for="autoClosingDelete">Auto Closing Delete</label>
          <select
            name="autoClosingDelete"
            id="autoClosingDelete"
            bind:value={editorOptions.autoClosingDelete}
            on:change={updateEditorSettings}
          >
            <option value="auto">Auto</option>
            <option value="always">Always</option>
            <option value="never">Never</option>
          </select>
        </div>

        <div class="field-container">
          <label for="autoClosingOvertype">Auto Closing Overtype</label>
          <select
            name="autoClosingOvertype"
            id="autoClosingOvertype"
            bind:value={editorOptions.autoClosingOvertype}
            on:change={updateEditorSettings}
          >
            <option value="auto">Auto</option>
            <option value="always">Always</option>
            <option value="never">Never</option>
          </select>
        </div>

        <div class="field-container">
          <label for="matchBrackets">Match Brackets</label>
          <select
            name="matchBrackets"
            id="matchBrackets"
            bind:value={editorOptions.matchBrackets}
            on:change={updateEditorSettings}
          >
            <option value="auto">Auto</option>
            <option value="always">Always</option>
            <option value="never">Never</option>
          </select>
        </div>

        <div class="field-container">
          <label for="autoIndent">Auto Indent</label>
          <select
            name="autoIndent"
            id="autoIndent"
            bind:value={editorOptions.autoIndent}
            on:change={updateEditorSettings}
          >
            <option value="none">none</option>
            <option value="advanced">advanced</option>
            <option value="full">full</option>
            <option value="brackets">brackets</option>
            <option value="keep">keep</option>
          </select>
        </div>

        <h3>Minimap</h3>

        <div class="field-container">
          <label for="minimap.enabled">Enable Minimap</label>
          <select
            name="minimap.enabled"
            id="minimap.enabled"
            on:change={updateEditorSettings}
            bind:value={editorOptions.minimap.enabled}
          >
            <option value={true}>True</option>
            <option value={false}>False</option>
          </select>
        </div>

        <div class="field-container">
          <label for="minimap.renderCharacters">Render Characters</label>
          <select
            name="minimap.renderCharacters"
            id="minimap.renderCharacters"
            on:change={updateEditorSettings}
            bind:value={editorOptions.minimap.renderCharacters}
          >
            <option value={true}>True</option>
            <option value={false}>False</option>
          </select>
        </div>

        <div class="field-container">
          <label for="minimap.maxColumn">Max Column</label>
          <input
            type="number"
            name="minimap.maxColumn"
            id="minimap.maxColumn"
            on:change={updateEditorSettings}
            bind:value={editorOptions.minimap.maxColumn}
          />
        </div>

        <div class="field-container">
          <label for="minimap.scale">Scale</label>
          <input
            type="number"
            name="minimap.scale"
            id="minimap.scale"
            on:change={updateEditorSettings}
            bind:value={editorOptions.minimap.scale}
          />
        </div>

        <div class="field-container">
          <label for="minimap.showSlider">Show Slider</label>
          <select
            name="minimap.showSlider"
            id="minimap.showSlider"
            bind:value={editorOptions.minimap.showSlider}
          >
            <option value="always">always</option>
            <option value="mouseover">mouseover</option>
          </select>
        </div>

        <div class="field-container">
          <label for="minimap.size">Size</label>
          <select
            name="minimap.size"
            id="minimap.size"
            bind:value={editorOptions.minimap.size}
          >
            <option value="proportional">proportional</option>
            <option value="fill">fill</option>
            <option value="fit">fit</option>
            <option value="actual">actual</option>
          </select>
        </div>

        <div class="field-container">
          <label for="minimap.side">Side</label>
          <select
            name="minimap.side"
            id="minimap.side"
            bind:value={editorOptions.minimap.side}
          >
            <option value="left">left</option>
            <option value="right">right</option>
          </select>
        </div>

        <div class="button-section">
          <Button variant="success" type="submit">Update Editor Settings</Button
          >
        </div>
      </form>
    {/if}
  </section>
</div>

<style lang="sass">
.field-container
  display: flex
  justify-content: flex-start
  align-items: center
  padding-top: 8px
  padding-bottom: 8px

label
  display: inline-block
  width: 240px
  cursor: pointer

select
  width: 180px

input[type="text"]
  width: 350px

.button-section
  padding: var(--spacing) 0
</style>
