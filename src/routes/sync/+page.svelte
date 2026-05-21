<script lang="ts">
  import { onMount } from 'svelte'
  import { getAllNotes } from '$lib/db'
  import { showToast } from '$lib/toastStore.svelte'
  import JSZip from 'jszip'
  import pkg from 'file-saver'
const { saveAs } = pkg

  let apiKey = $state('')

  onMount(() => {
    apiKey = localStorage.getItem('gemini_api_key') || ''
  })

  function saveApiKey() {
    localStorage.setItem('gemini_api_key', apiKey)
    showToast('API key saved', 'success')
  }

  async function exportNotes() {
    const notes = await getAllNotes()
    const zip = new JSZip()
    for (const note of notes) {
      zip.file(`${note.title.replace(/[^a-zA-Z0-9_\-]/g, '_')}.md`, note.content)
    }
    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, 'syncinote-export.zip')
    showToast('Notes exported', 'success')
  }

  function handleInputEvent(e: Event) {
    e.preventDefault()
    return false
  }
</script>

<div class="max-w-lg mx-auto p-6 space-y-6">
  <h1 class="text-2xl font-bold">Settings</h1>

  <div class="card bg-base-200 p-4">
    <h2 class="font-semibold mb-2">Gemini API Key</h2>
    <p class="text-sm text-base-content/60 mb-3">
      Required for the AI assistant feature. Get a key from
      <a href="https://aistudio.google.com/apikey" class="link link-primary" target="_blank">
        Google AI Studio
      </a>.
    </p>
    <input
      type="password"
      bind:value={apiKey}
      placeholder="Enter your Gemini API key"
      class="input input-bordered w-full mb-2"
      oncopy={handleInputEvent}
      oncut={handleInputEvent}
    />
    <button class="btn btn-primary btn-sm" onclick={saveApiKey}>Save Key</button>
  </div>

  <div class="card bg-base-200 p-4">
    <h2 class="font-semibold mb-2">Export Notes</h2>
    <p class="text-sm text-base-content/60 mb-3">
      Download all notes as individual markdown files in a ZIP archive.
    </p>
    <button class="btn btn-secondary btn-sm" onclick={exportNotes}>Export as ZIP</button>
  </div>

  <a href="/notes" class="link link-primary">← Back to Notes</a>
</div>
