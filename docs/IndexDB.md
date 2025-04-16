## Local Browser IndexDB using Dexie.js

## Add a new model to the database

-   Define a new model under `@/types/` directory.

Example: `lang.ts`

```ts
export type LanguageCode = 'EN' | 'FR'
export interface Language {
	id?: string
	code: LanguageCode
}
export const ENGLISH_CODE = 'EN'
export const FRENCH_CODE = 'FR'
```

-   Add new model to the local db class

```ts
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
```
