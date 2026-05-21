import Dexie, { type Table } from 'dexie'
import type { Note } from './types'

class NotesDatabase extends Dexie {
  notes!: Table<Note, number>

  constructor() {
    super('syncinote')
    this.version(1).stores({
      notes: '++id, title, created_at, updated_at',
    })
  }
}

export const db = new NotesDatabase()

export async function getAllNotes(): Promise<Note[]> {
  return (await db.notes.orderBy('updated_at').toArray()).toReversed()
}

export async function createNote(): Promise<Note> {
  const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  const id = await db.notes.add({
    title: 'New Note',
    content: `# Welcome to SynciNote! 
    - Start writing your thoughts here...
    `,
    created_at: now,
    updated_at: now,
  })
  return (await db.notes.get(id))!
}

export async function saveNote(note: Note): Promise<void> {
  const now = new Date().toLocaleString()
  await db.notes.update(note.id!, {
    title: note.title,
    content: note.content,
    updated_at: now,
  })
}

export async function deleteNote(id: number): Promise<void> {
  await db.notes.delete(id)
}

export async function getNoteCount(): Promise<number> {
  return db.notes.count()
}
