import AdminForm from '@/components/common/admin/form/AdminForm'
import AdminLayout from '@/components/layouts/admin'
import fieldsValue from '@/constants/en/message.json'
import { AdminFormProvider } from '@/providers/AdminFormProvider'
import fields from '@/schema/message.json'
import { SchemaType } from '@/types/schema'

const AdminMessage = () => {
	return (
		<AdminLayout>
			<AdminFormProvider
				data={fieldsValue}
				schema={fields as SchemaType}
				filepath="constants/en/message.json">
				<AdminForm />
			</AdminFormProvider>
		</AdminLayout>
	)
}

export default AdminMessage
