<script lang="ts">
  import type { Note } from '$lib/types'

  let {
    notes,
    currentId,
    searchQuery = $bindable(''),
    onSelect,
    onCreate,
    onRename,
  }: {
    notes: Note[]
    currentId: number | null
    searchQuery: string
    onSelect: (id: number) => void
    onCreate: () => void
    onRename: (id: number) => void
  } = $props()

  let search = $state(searchQuery)

  $effect(() => {
    searchQuery = search
  })

  const filtered = $derived(
    search
      ? notes.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()))
      : notes,
  )

  function handleKeydown(e: KeyboardEvent, id: number) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(id)
    }
  }
</script>

<div class="flex flex-col h-full bg-white shadow-md">
  <div class="p-3 flex gap-2 items-center">
    <div class="relative w-full">
      <input
        type="text"
        bind:value={search}
        placeholder="Search notes"
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />
      <button
        class="absolute right-2 top-1.5 font-bold text-black hover:text-yellow-500 cursor-pointer"
        onclick={onCreate}
      >
        +
      </button>
    </div>
  </div>

  <div class="flex-1 overflow-y-auto px-3 pb-2">
    {#if filtered.length === 0}
      <p class="text-gray-500 mt-4 text-sm italic text-center">No matching notes found.</p>
    {/if}
    {#each filtered as note (note.id)}
      <div
        class="px-3 py-2 rounded-md cursor-pointer mb-1 transition-colors duration-200"
        class:bg-yellow-100={note.id === currentId}
        class:text-black={note.id === currentId}
        class:font-medium={note.id === currentId}
        class:shadow-sm={note.id === currentId}
        class:hover:bg-gray-100={note.id !== currentId}
        class:text-gray-800={note.id !== currentId}
        role="button"
        tabindex="0"
        onclick={() => note.id && onSelect(note.id)}
        onkeydown={(e) => note.id && handleKeydown(e, note.id)}
      >
        <div class="flex justify-between items-center group">
          <span class="truncate text-sm flex-1">{note.title || 'Untitled'}</span>
          <button
            class="opacity-0 group-hover:opacity-100 cursor-pointer text-gray-500 hover:text-yellow-500"
            onclick={(e) => {
              e.stopPropagation()
              note.id && onRename(note.id)
            }}
          >
            ✏️
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>
