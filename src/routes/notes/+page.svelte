<script lang="ts">
  import { onMount } from 'svelte'
  import { getAllNotes, createNote, saveNote, deleteNote, getNoteCount } from '$lib/db'
  import { showToast } from '$lib/toastStore.svelte'
  import { getEditorAPI } from '$lib/editorStore'
  import type { Note } from '$lib/types'
  import Sidebar from '$lib/components/Sidebar.svelte'
  import Editor from '$lib/components/Editor.svelte'
  import DeleteButton from '$lib/components/DeleteButton.svelte'
  import AskAI from '$lib/components/AskAI.svelte'

  let notes = $state<Note[]>([])
  let currentId = $state<number | null>(null)
  let sidebarOpen = $state(true)
  let saving = $state(false)
  let searchQuery = $state('')

  let currentNote = $derived(notes.find((n) => n.id === currentId) ?? null)
  let apiKey = $state('')

  onMount(async () => {
    notes = await getAllNotes()
    apiKey = localStorage.getItem('gemini_api_key') || ''
    if (notes.length === 0) {
      await handleCreate()
    } else if (!currentId) {
      currentId = notes[0].id!
    }
  })

  function selectNote(id: number) {
    currentId = id
  }

  async function handleCreate() {
    const note = await createNote()
    notes = await getAllNotes()
    currentId = note.id!
    showToast('Note created', 'success')
  }

  async function handleSave() {
    if (!currentId || !currentNote) return
    saving = true
    try {
      const ctx = getEditorAPI()
      const md = ctx.getMarkdown()
      currentNote.content = md
      await saveNote(currentNote)
      notes = await getAllNotes()
      showToast('Note saved', 'success')
    } catch {
      showToast('Failed to save note', 'error')
    }
    saving = false
  }

  async function handleDelete() {
    if (!currentId) return
    const count = await getNoteCount()
    if (count <= 1) {
      showToast('Cannot delete the last note', 'warning')
      return
    }
    await deleteNote(currentId)
    notes = await getAllNotes()
    if (notes.length > 0) {
      currentId = notes[0].id!
    }
    showToast('Note deleted', 'success')
  }

  function handleRename(id: number) {
    const note = notes.find((n) => n.id === id)
    if (!note) return
    const newTitle = prompt('Enter new title:', note.title)
    if (newTitle && newTitle.trim()) {
      note.title = newTitle.trim()
      saveNote(note)
      notes = notes.map((n) => (n.id === id ? note : n))
    }
  }
</script>

<div class="lg:flex h-screen bg-white">
  <div class="sm:w-full sm:h-75 lg:h-full lg:w-72 border-r overflow-scroll border-gray-200" class:hidden={!sidebarOpen}>
    <Sidebar
      {notes}
      {currentId}
      bind:searchQuery
      onSelect={selectNote}
      onCreate={handleCreate}
      onRename={handleRename}
    />
  </div>

  <div class="flex-1 flex flex-col">
    <div class="flex items-center gap-2 p-2 border-b border-gray-200 bg-white">
      <button class="cursor-pointer" onclick={() => (sidebarOpen = !sidebarOpen)}>
        {sidebarOpen ? '◀' : '▶'}
      </button>

      {#if currentNote}
        <input
          type="text"
          bind:value={currentNote.title}
          class="input input-ghost input-sm font-bold flex-1"
          onclick={() => showToast("Save to register title change", "warning")}
        />
        <DeleteButton onDelete={handleDelete} disabled={notes.length <= 1} />
        <AskAI {apiKey} />
        <a href="/sync" class="btn btn-ghost btn-sm">⚙️</a>
      {/if}
    </div>

    {#if currentNote}
      <Editor
        content={currentNote.content}
        noteId={currentNote.id ?? null}
        onSave={handleSave}
        {saving}
      />
    {:else if notes.length > 0}
      <div class="flex-1 flex items-center justify-center text-gray-400">
        Select a note from the sidebar
      </div>
    {:else}
      <div class="flex-1 flex items-center justify-center text-gray-400">
        No notes yet. Click + to create one.
      </div>
    {/if}
  </div>
</div>
