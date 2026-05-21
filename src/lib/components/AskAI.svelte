<script lang="ts">
  import { getEditorAPI } from '$lib/editorStore'
  import { generateWithAI } from '$lib/api'

  let {
    apiKey,
  }: {
    apiKey: string
  } = $props()

  let dialog: HTMLDialogElement | undefined = $state()
  let prompt = $state('')
  let result = $state('')
  let loading = $state(false)

  async function generate() {
    if (!prompt.trim() || !apiKey) return
    loading = true
    result = ''
    const text = await generateWithAI(prompt, apiKey)
    if (text) result = text
    loading = false
  }

  function insert(type: string) {
    const api = getEditorAPI()
    if (type == "override") {
      api.updateContent(result)
    } else if (type == "append") {
      const md = api.getMarkdown()
      const updatedMd = md + "\n" + result
      api.updateContent(updatedMd)
    }
    dialog?.close()
    prompt = ''
    result = ''
  }

  function handleKeydown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      generate()
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<button
  class="border rounded p-2 bg-green-500 hover:bg-green-600 text-white mr-1 cursor-pointer"
  onclick={() => dialog?.showModal()}
>
  🥂 Ask Ai
</button>

<dialog bind:this={dialog} class="modal">
  <div class="modal-box">
    <p class="text-gray-500 mb-3">Make sure to set your api key first</p>
    <textarea
      bind:value={prompt}
      class="border w-full p-2 resize-none mb-3"
      rows="4"
      placeholder="What's on your mind?"
    ></textarea>

    <div class="flex justify-between gap-2 mb-3">
      <button
        class="border rounded p-2 bg-green-500 hover:bg-green-600 text-white cursor-pointer disabled:opacity-50"
        onclick={generate}
        disabled={loading || !apiKey}
      >
        {loading ? "Generating..." : "Generate"}
      </button>
      <form method="dialog">
        <button class="border rounded p-2 cursor-pointer disabled:opacity-50" disabled={loading}>Close</button>
      </form>
    </div>

    {#if result}
      <div>
        <label for="ai-result" class="font-semibold">AI Generated Markdown:</label>
        <textarea
          id="ai-result"
          class="border w-full p-2 resize-none font-mono bg-gray-100 mt-1 mb-2"
          rows="6"
          bind:value={result}
          readonly
        ></textarea>
        <button
          class="border rounded p-2 bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer"
          onclick={() => insert("override")}
        >
          Override
        </button>
        <button
          class="border rounded p-2 bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer"
          onclick={() => insert("append")}
        >
          Append
        </button>
      </div>
    {/if}
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
