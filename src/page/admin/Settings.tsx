import AdminForm from '@/components/common/admin/form/AdminForm'
import FormField from '@/components/common/admin/input/FormField'
import AdminLayout from '@/components/layouts/admin'
import { default as enValues } from '@/constants/en/config.json'
import { useAdminForm } from '@/hooks/useAdminForm'
import { isSupportedImageExtension } from '@/lib/tdr'
import { AdminFormProvider } from '@/providers/AdminFormProvider'
import fields from '@/schema/home.json'
import { SchemaType } from '@/types/schema'
const AdminSettings = () => {
	return (
		<AdminLayout>
			<AdminFormProvider data={enValues} schema={fields as SchemaType} filepath="constants/en/config.json">
				<AdminForm>
					<Form />
				</AdminForm>
			</AdminFormProvider>
		</AdminLayout>
	)
}

const Form = () => {
	const fieldsValue = enValues
	const { handleChange } = useAdminForm()

	return (
		<div className="flex gap-4 flex-col">
			<FormField type="text" field={'Site name'} value={fieldsValue.siteName} onChange={(e) => handleChange(['siteName'], e)} />

			<div className="flex flex-col">
				<FormField
					type="image"
					field={'Site logo'}
					value={fieldsValue.logo}
					onChange={(e) => handleChange(['logo'], e)}
					onTDRAssetsSelect={(files) => {
						if (files.length > 0) {
							const file = files[0]
							handleChange(['logo'], isSupportedImageExtension(file.Extension) ? file.Access : file.Thumbnail)
						}
					}}
				/>
			</div>
		</div>
	)
}
export default AdminSettings
