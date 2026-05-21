<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { Crepe } from '@milkdown/crepe'
  import { getMarkdown, insert, replaceAll } from '@milkdown/kit/utils'
  import '@milkdown/crepe/theme/common/style.css'
  import '@milkdown/crepe/theme/frame.css'
  import { setEditorAPI } from '$lib/editorStore'

  let {
    content = '',
    noteId,
    onSave,
    saving,
  }: {
    content: string
    noteId: number | null
    onSave: () => void
    saving: boolean
  } = $props()

  let container: HTMLDivElement
  let crepe: Crepe | null = null
  let initialized = $state(false)

  onMount(async () => {
    crepe = new Crepe({ root: container })
    await crepe.create()
    setEditorAPI(
      () => crepe!.editor.action(getMarkdown()),
      (md: string) => {
        crepe!.editor.action(replaceAll(''))
        crepe!.editor.action(insert(md))
      },
    )
    initialized = true
  })

  onDestroy(() => {
    crepe?.destroy()
  })

  let prevId = $state<number | null>(null)

  $effect(() => {
    if (!initialized || !crepe) return
    if (noteId === prevId) return
    prevId = noteId
    if (content) {
      crepe.editor.action(replaceAll(''))
      crepe.editor.action(insert(content))
    }
  })

  function handleKeydown(e: KeyboardEvent) {
    if (!initialized) return
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      onSave()
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex flex-col h-full">
  <div class="flex gap-2 items-center p-2 border-b border-gray-200">
    <div class="flex-1"></div>
    <button
      class="rounded px-4 py-2 cursor-pointer disabled:opacity-50 bg-yellow-500 hover:bg-yellow-600 text-white"
      onclick={onSave}
      disabled={saving || !initialized}
    >
      {saving ? 'Saving...' : 'Save'}
    </button>
  </div>

  <div class="flex-1 overflow-y-auto border" class:opacity-0={!initialized}>
    <div bind:this={container} class="h-full"></div>
  </div>
</div>
