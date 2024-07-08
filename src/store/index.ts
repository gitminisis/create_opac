
import { Cal_event } from '@/components/common/event-calendar/Constants'
import { GenericObject } from '@/lib/record'
import { atom } from 'jotai'

export type ViewType = 'grid' | 'list'
export const viewAtom = atom<ViewType>('grid')
export const pageData = atom<GenericObject | null>(null)

// RSVP Calendar App
export const calendarEvents = atom<Cal_event[]>([])
export const calendarWeekType = atom<boolean>(false)
export const calendarMonthType = atom<boolean>(true)
export const calendarCurrDate = atom<Date>(new Date())