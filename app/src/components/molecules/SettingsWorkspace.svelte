<script lang="ts">
  import { HeroIcon, Button } from '../atoms'
  import { workspaceStore } from '@/store'
  import type { WorkspacesModelType } from '@/types'

  let current: WorkspacesModelType
  let fileInput!: HTMLInputElement
  let imageData!: string

  $: disableSave = false

  workspaceStore.subscribe((data) => {
    if (!data.current) return

    current = data.current
    disableSave = false

    if (current.avatar && current.avatar.content) {
      imageData = current.avatar.content
    }
  })

  function updateWorkspaceInfo(): void {
    disableSave = true
    workspaceStore.updateWorkspace({ ...current })
  }

  function fileSelect(event: Event): void {
    const target = (event.target as HTMLInputElement).files[0]
    const reader = new FileReader()

    reader.readAsDataURL(target)
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const image = e.target.result as string
      workspaceStore.updateWorkspace({
        ...current,
        avatar: {
          filename: target.name,
          content: image,
        },
        _attachments: {
          [target.name]: {
            content_type: target.type,
            data: btoa(image),
          },
        },
      })
    }

    return
  }
</script>

{#if $workspaceStore.current}
  <div class="settings-section">
    <header>
      <HeroIcon size={28} outline icon="user-circle" />
      <h2 class="heading">{current.name}'s Workspace</h2>
    </header>
    <section class="section-column">
      <form
        on:submit|preventDefault={updateWorkspaceInfo}
        class="field-containter-wrapper"
      >
        <div>
          <div class="field-container">
            <label for="fontFamily">Workspace Name</label>
            <input
              type="text"
              name="workspaceName"
              id="workspaceName"
              spellcheck="false"
              on:change={updateWorkspaceInfo}
              bind:value={current.name}
            />
          </div>
          <div class="field-container">
            <label for="workspaceDescription">Description</label>
            <textarea
              type="text"
              id="workspaceDescription"
              name="workspaceDescription"
              spellcheck="false"
              on:change={updateWorkspaceInfo}
              bind:value={current.description}
            />
          </div>
          <div class="field-container">
            <div style="margin-top: var(--spacing); margin-left: auto;">
              <Button type="submit" variant="success" disabled={disableSave}
                >Save Info</Button
              >
            </div>
          </div>
        </div>
        <div class="avatar-container">
          <div class="avatar-img">
            {#if imageData}
              <img src={imageData} alt={current.avatar.filename} />
            {/if}
          </div>
          <Button on:click={() => fileInput.click()}>
            <HeroIcon size={16} icon="camera" />
            <span>Upload</span>
          </Button>
          <div style="visibility: hidden;">
            <input
              style="display:none"
              type="file"
              accept=".jpg, .jpeg, .png"
              on:change={fileSelect}
              bind:this={fileInput}
            />
          </div>
        </div>
      </form>
    </section>
  </div>
{/if}

<style lang="sass">
.field-containter-wrapper
  display: flex
  width: 100%
  justify-content: space-between
  align-items: flex-start

  & div:first-of-type
    padding-top: var(--spacing)

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

input[type="text"],
textarea
  width: 350px

.section-column
  max-width: 100%
  padding-top: var(--spacing)
  color: rgba(var(--rgb-gray-100), 0.5)


.avatar-container
  position: relative
  width: 180px
  text-align: center


.avatar-img
  width: 160px
  height: 185px
  margin-left: auto
  margin-right: auto
  margin-bottom: var(--spacing)
  background-color: rgba(var(--rgb-blackout), 0.15)
  border-radius: var(--border-radius)
  overflow: hidden

  img
    // position: absolute
    // clip: rect(0,160px,120px,0)
    width: 100%
    height: auto
    object-fit: cover
    object-position: center top
    border-radius: var(--border-radius)
</style>
