<script lang="ts">
  import { workspaceStore } from '@/store'
  import type { LocationType } from '@/types'
  import { Button, Password } from '../atoms'

  $: locations = $workspaceStore.current.location

  $: github = locations.github
  $: enableGh = github.token.trim() === ''
  $: githubTokenVisibility = false

  $: gitlab = locations.gitlab
  $: enableGl = gitlab.token.trim() === ''
  $: gitlabTokenVisibility = false

  $: bitbucket = locations.bitbucket
  $: enableBb = bitbucket.token.trim() === ''
  $: bitbucketTokenVisibility = false

  /**
   * @function
   * @summary common update call to workspace
   * @returns {void}
   */
  function updateWorkspace(): void {
    workspaceStore.updateWorkspace({
      ...$workspaceStore.current,
      location: { ...locations },
    })
  }

  /**
   * @function
   * @summary common location update call
   * @param {object<CustomEvent<string>>} event
   * @param {string<LocationType>} name
   * @returns {void}
   */
  function updateIntegrationContext(
    event: CustomEvent<string>,
    name: LocationType,
  ): void {
    locations[name].token = event.detail

    if (locations[name].token.trim() === '') {
      locations[name].enabled = false
    }

    updateWorkspace()
  }

  /**
   * @function
   * @summary
   *  a function that automatically disables integration state if the value is an empty
   *  string, otherwise it sets the value based on user input.
   * @param {string<LocationType>} name - the name of the integration to toggle state
   * @returns {void}
   */
  function updateIntegrationState(name: LocationType): void {
    if (locations[name].token.trim() === '') {
      locations[name].enabled = false
      updateWorkspace()
      return
    }

    locations[name].enabled = !locations[name].enabled
    updateWorkspace()
  }

  function addGithubToken(event: CustomEvent<string>): void {
    updateIntegrationContext(event, 'github')
  }

  function addGitLabToken(event: CustomEvent<string>): void {
    updateIntegrationContext(event, 'gitlab')
  }

  function addBitBucketToken(event: CustomEvent<string>): void {
    updateIntegrationContext(event, 'bitbucket')
  }
</script>

<div class="settings-section">
  <header>
    <svg class="brand-icon">
      <use xlink:href="./img/brands.svg#github" />
    </svg>
    <h2 class="heading">Github Gist</h2>
  </header>

  {#if $workspaceStore.current}
    <section style="color: rgba(var(--rgb-gray-100), 0.5)">
      <p>Allows you to create, read and write to Github Gists.</p>
      <div class="settings-section__password-container">
        <Password
          id="githubAccessToken"
          label="Personal Token"
          model={locations.github.token}
          visibility={githubTokenVisibility}
          on:change={addGithubToken}
        />

        <Button
          utility
          variant="success"
          on:click={() => updateIntegrationState('github')}
          bind:disabled={enableGh}
        >
          {#if locations.github.enabled}
            <span>Disable</span>
          {:else}
            <span>Enable</span>
          {/if}
        </Button>
      </div>
    </section>
  {/if}
</div>

<div class="settings-section">
  <header>
    <svg class="brand-icon">
      <use xlink:href="./img/brands.svg#gitlab" />
    </svg>
    <h2 class="heading">Gitlab Snippets</h2>
  </header>
  {#if $workspaceStore.current}
    <section style="color: rgba(var(--rgb-gray-100), 0.5)">
      <p>Allows you to create, read and write to Gitlab Snippets</p>
      <div class="settings-section__password-container">
        <Password
          id="gitlabAccessToken"
          label="Personal Token"
          model={locations.gitlab.token}
          visibility={gitlabTokenVisibility}
          on:change={addGitLabToken}
        />

        <Button
          utility
          variant="success"
          on:click={() => updateIntegrationState('gitlab')}
          bind:disabled={enableGl}
        >
          {#if locations.gitlab.enabled}
            <span>Disable</span>
          {:else}
            <span>Enable</span>
          {/if}
        </Button>
      </div>
    </section>
  {/if}
</div>

<div class="settings-section">
  <header>
    <svg class="brand-icon">
      <use xlink:href="./img/brands.svg#bitbucket" />
    </svg>
    <h2 class="heading">BitBucket</h2>
  </header>
  <section style="color: rgba(var(--rgb-gray-100), 0.5)">
    <p>Allows you to create, read and write to Dropbox</p>
    <div class="settings-section__password-container">
      <Password
        id="bitbucketAccessToken"
        label="Personal Token"
        model={locations.bitbucket.token}
        visibility={bitbucketTokenVisibility}
        on:change={addBitBucketToken}
      />
      <Button
        utility
        variant="success"
        on:click={() => updateIntegrationState('bitbucket')}
        bind:disabled={enableBb}
      >
        {#if locations.bitbucket.enabled}
          <span>Disable</span>
        {:else}
          <span>Enable</span>
        {/if}
      </Button>
    </div>
  </section>
</div>

<!--
<div class="settings-section">
  <header>
    <svg class="brand-icon">
      <use xlink:href="./img/brands.svg#dropbox" />
    </svg>
    <h2 class="heading">Dropbox</h2>
  </header>
  <section style="color: rgba(var(--rgb-gray-100), 0.5)">
    <p>Allows you to create, read and write to bitbucket</p>
  </section>
</div>
-->
<style lang="sass">
svg.brand-icon
  display: inline-block
  width: 32px
  height: 32px
  margin-right: calc(var(--spacing) / 2)

.settings-section__password-container
  display: flex
  flex-wrap: wrap

// .checkbox-button
//   margin-left: 0
</style>
