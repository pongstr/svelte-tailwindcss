<script lang="ts">
  import DashboardToolbar from '@/components/DashboardTemplate/DashboardToolbar.svelte'

  export let workspaceId = ''
  export let title = ''
</script>

<DashboardToolbar {title} />

<code>{title} + {workspaceId}</code>
