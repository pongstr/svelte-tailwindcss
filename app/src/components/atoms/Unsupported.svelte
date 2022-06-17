<script lang="ts">
  export let headline = 'Your browser is too small'
  export let leadtext =
    'Resize your browser to be at least 860px for optimum awesome.'
  export let name = ''
</script>

<div id={name} class="unsupported-viewport">
  <div class="unsupported-viewport-content">
    <span class="headline-icon">
      <svg width="52" height="40" viewBox="0 0 52 40" class="svg-icon">
        <path
          d="M26 32v-2h-4.586l6.293-6.293L32 19.414V24h2v-8h-8v2h4.586l-4.293 4.293L20
          28.586V24h-2v8h8zM2 8h48V2H2v6zm0 30h48V10H2v28zM52 0v40H0V0h52zM11 6a1 1 0 1 0 0-2 1 1
          0 0 0 0 2zM8 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM4 5a1 1 0 1 1 2 0 1 1 0 0 1-2 0z"
          fill="currentColor"
        />
      </svg>
    </span>
    <span class="headline">{headline}</span>
    <span class="content">
      <p>{leadtext}</p>
    </span>
  </div>
</div>

<style lang="postcss">
  .unsupported-viewport {
    @apply fixed top-0 left-0 right-0 bottom-0 w-full h-full hidden;
    @apply flex justify-center items-center opacity-0 transition-all;
    @apply text-white bg-oh-black;
    z-index: -100;
  }

  @media screen and (max-width: 799px) {
    .unsupported-viewport {
      @apply transition-all opacity-100;
      z-index: 100000;
    }

    .unsupported-viewport > div {
      z-index: 1001;
    }
  }

  .unsupported-viewport-content {
    @apply text-center;
  }

  .headline-icon {
    @apply inline-block text-center py-4 mx-auto;
  }

  .headline {
    @apply block mt-6 text-center text-2xl font-bold;
  }

  .content {
    @apply mt-3 mb-6 block max-w-xs mx-auto;
  }
</style>
