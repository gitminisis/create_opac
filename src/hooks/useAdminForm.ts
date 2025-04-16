import { AdminFormContext } from '@/providers/AdminFormProvider'
import { useContext } from 'react'

export const useAdminForm = () => {
	const context = useContext(AdminFormContext)
	if (context === undefined) {
		throw new Error('useAdminForm must be used within an AdminFormProvider')
	}
	return context
}
