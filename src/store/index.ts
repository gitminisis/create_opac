import { Cal_event } from './Constants'
import { GenericObject } from '@/lib/record'
import { atom } from 'jotai'

export type ViewType = 'grid' | 'list'
export const viewAtom = atom<ViewType>('grid')

export const pageData = atom<GenericObject | null>(null)
export const calendarEvents = atom<Cal_event[]>([])
export const landingPageClick = atom<boolean>(true)