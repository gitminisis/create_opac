import AdminForm from '@/components/common/admin/form/AdminForm'
import AdminLayout from '@/components/layouts/admin'
import fieldsValue from '@/constants/en/rsvp.json'
import { AdminFormProvider } from '@/providers/AdminFormProvider'
import fields from '@/schema/rsvp.json'
import { SchemaType } from '@/types/schema'

const AdminRSVP = () => {
	return (
		<AdminLayout>
			<AdminFormProvider filepath="constants/en/rsvp.json" schema={fields as SchemaType} data={fieldsValue}>
				<AdminForm />
			</AdminFormProvider>
		</AdminLayout>
	)
}

export default AdminRSVP
