<script lang="ts">
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'
  import bytes from 'bytes'
  import HeroIcon from '../atoms/HeroIcon.svelte'

  const storage = (() => {
    const { subscribe, set } = writable(null)
    return {
      subscribe,
      info: async () => {
        const estimate = await window.navigator.storage.estimate()
        const usageStr = bytes.format(estimate.usage)
        const quotaStr = bytes.format(estimate.quota)
        return set({
          usage: `${usageStr}`,
          quota: `${quotaStr}`,
          percentage: ((estimate.usage / estimate.quota) * 100).toFixed(2),
        })
      },
    }
  })()

  onMount(async () => await storage.info())
</script>

<div class="settings-section">
  <header>
    <HeroIcon size={24} outline icon="server" />
    <h2 class="heading">Storage</h2>
  </header>
  <section style="color: rgba(var(--rgb-gray-100), 0.5)">
    <p>
      This app uses IndexedDB which is a browser storage which complies to
      browser storage limits and eviction criteria.
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Browser_storage_limits_and_eviction_criteria#storage_limits"
        target="_blank"
      >
        More information here
      </a>.
    </p>

    {#if $storage}
      {#if $storage.percentage > 70}
        <div class="alert alert--warning">
          {#if $storage.percentage < 80}
            <header>
              <HeroIcon size={24} icon="exclamation" />
              <h3>Time to do something...</h3>
            </header>
            <section>
              <p>
                Looks like you've consumed {$storage.percentage}% of your
                storage quota, while this is still sort-of okay, it'd be nice to
                either backup or archive some of your data.
              </p>

              <p>
                Please see these guides on how you can archive and backup your
                data.
              </p>
            </section>
          {/if}
        </div>
      {/if}
      <div
        class="progress-bar"
        data-usage={$storage.usage}
        data-quota={$storage.quota}
      >
        <div
          class="progress-bar__progress {$storage.percentage > 70
            ? 'progress-bar__progress--warn'
            : ''} {$storage.percentage > 80
            ? 'progress-bar__progress--danger'
            : ''}"
          style="width: {$storage.percentage}%;"
        />
      </div>
    {/if}
  </section>
</div>
