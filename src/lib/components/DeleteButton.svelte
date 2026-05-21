<script lang="ts">
  let {
    onDelete,
    disabled,
  }: {
    onDelete: () => void
    disabled: boolean
  } = $props()

  let dialog: HTMLDialogElement | undefined = $state()
</script>

<button
  class="border rounded p-2 bg-red-500 hover:bg-red-600 text-white mr-1 cursor-pointer disabled:opacity-50"
  onclick={() => dialog?.showModal()}
  disabled={disabled}
>
  Delete
</button>

<dialog bind:this={dialog} class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Delete Note</h3>
    <p class="py-4">Are you sure you want to delete this note? This action cannot be undone.</p>
    <div class="modal-action">
      <button class="border rounded p-2 cursor-pointer" onclick={() => dialog?.close()}>Cancel</button>
      <button
        class="border rounded p-2 bg-red-500 hover:bg-red-600 text-white cursor-pointer"
        onclick={() => {
          dialog?.close()
          onDelete()
        }}
      >
        Delete
      </button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
