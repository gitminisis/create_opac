import { Language } from '@/types/lang'
import Dexie, { Table } from 'dexie'

export class ClientLocalDB extends Dexie {
	language!: Table<Language>

	constructor() {
		super('localdb')
		this.version(1).stores({
			language: '++id, code',
		})
	}
}

export const db = new ClientLocalDB()
