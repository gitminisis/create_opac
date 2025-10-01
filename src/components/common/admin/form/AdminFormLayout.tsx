import AdminLayout from '@/components/layouts/admin'
import TabsWrapper from '@/components/common/admin/layout/TabsWrapper'
import { TabsContent } from '@/components/ui/tabs'
import { AdminFormProvider } from '@/providers/AdminFormProvider'
import { SchemaType } from '@/types/schema'
import AdminForm from './AdminForm'
type AdminFormLayoutProps = {
	enData: any // Replace with appropriate type if known
	frData: any // Replace with appropriate type if known
	schema: SchemaType // Assuming you have a type for the schema
	enFilepath: string
	frFilepath: string
	FormComponent: (props: { lang: 'en' | 'fr' }) => JSX.Element // FormComponent expects a lang prop
	enablePreview?: boolean
}
const AdminFormLayout = ({ enData, frData, schema, enFilepath, frFilepath, FormComponent, enablePreview = false }: AdminFormLayoutProps) => {
	return (
		<AdminLayout>
			<TabsWrapper>
				<TabsContent value="en">
					<AdminFormProvider data={enData} schema={schema} filepath={enFilepath}>
						<AdminForm enablePreview={enablePreview}>
							<FormComponent lang="en" />
						</AdminForm>
					</AdminFormProvider>
				</TabsContent>
				<TabsContent value="fr">
					<AdminFormProvider data={frData} schema={schema} filepath={frFilepath}>
						<AdminForm enablePreview={enablePreview}>
							<FormComponent lang="fr" />
						</AdminForm>
					</AdminFormProvider>
				</TabsContent>
			</TabsWrapper>
		</AdminLayout>
	)
}

export default AdminFormLayout
