type EditorAPI = {
  getMarkdown: () => string
  updateContent: (md: string) => void
}

const api: EditorAPI = {
  getMarkdown: () => '',
  updateContent: () => {},
}

export function setEditorAPI(getMarkdown: () => string, updateContent: (md: string) => void) {
  api.getMarkdown = getMarkdown
  api.updateContent = updateContent
}

export function getEditorAPI(): EditorAPI {
  return api
}
