<script lang="ts">
  import '../app.css'
  import { getToasts } from '$lib/toastStore.svelte'
  
  let { children } = $props();
  let toasts = $derived(getToasts())
</script>

<div class="toast toast-bottom toast-end z-50">
  {#each toasts as toast (toast.id)}
    {#if toast.type == "success"}
      <div class="alert alert-success shadow-lg">
        <span class="font-bold">{toast.message}</span>
      </div>
    {:else if toast.type == "warning" || "info"}
      <div class="alert alert-warning shadow-lg">
        <span class="font-bold">{toast.message}</span>
      </div>
    {:else}
      <div class="alert alert-{toast.type} shadow-lg">
        <span class="font-bold">{toast.message}</span>
      </div>
    {/if}
  {/each}
</div>

{@render children()}
