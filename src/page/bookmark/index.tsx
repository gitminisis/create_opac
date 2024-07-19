import Layout from '@/components/layouts'
import PageHeader from '@/components/common/PageHeader'
import ViewToggle from '@/components/common/ViewToggle'
import PagePagination from '@/components/common/PagePagination'
import useJSONData from '@/hooks/useJSONData'
import PageAction from '@/components/common/PageAction'
import useConstants from '@/hooks/useConstants'
import SearchForm from '@/components/common/SearchForm'
import SummaryRecords from '../summary/SummaryRecord'
import { Button } from '@/components/ui/button'
import { removeAllBookmarks } from '@/lib/bookmark'

const Bookmark = () => {
	const { message } = useConstants()
	const { common, pagination, backToSummary, records } = useJSONData({ selector: '#xml_record' })

	return (
		<Layout>
			<div className="rounded-sm border border-primary bg-background shadow-md md:shadow-xl h-full flex-col flex w-full my-12">
				<PageAction
					breadcrumbs={[
						{ label: message.home, url: '/' },
						{
							label: message.bookmarkPage,
							url: backToSummary,
							active: true,
						},
					]}>
					<div className="flex w-full flex-row space-x-2 justify-end">
						<SearchForm
							className="w-[450px] m-0"
							inputStyle="text-black"
							inputName={'KEYWORD_CLUSTER'}
						/>
						<ViewToggle />
					</div>
				</PageAction>

				<section>
					<div className="mx-auto py-4 sm:py-12 container flex flex-col">
						<div className={'w-full flex justify-between'}>
							<PageHeader heading={`${common.total_record} bookmarked item(s)`} />
							<Button onClick={() => removeAllBookmarks(records)}>
								{message.removeALL}
							</Button>
						</div>
						<div className="mt-4 lg:mt-8 lg:grid lg:grid-cols-4 lg:items-start lg:gap-8 ">
							<div className="col-span-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
								<SummaryRecords />
							</div>
							{pagination?.a && pagination.a.length > 0 && (
								<div className="col-span-4 mt-4">
									<PagePagination
										items={pagination.a.map((item) => ({
											url: item._href,
											active: item.b !== undefined,
										}))}
										renderItem={(_, index) => (
											<span key={index}>{index + 1}</span>
										)}
									/>
								</div>
							)}
						</div>
					</div>
				</section>
			</div>
		</Layout>
	)
}

export default Bookmark
