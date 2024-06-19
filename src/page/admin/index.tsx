import AdminLayout from '@/components/layouts/admin'
import useLocation from '@/hooks/useLocation'
import AdminForm from './AdminForm'

const Admin = () => {
	const params = useLocation()
	const page = params?.get('page')
	return (
		<AdminLayout>
			<AdminForm />
		</AdminLayout>
	)
}

export default Admin
