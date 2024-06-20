import Layout from '@/components/layouts'
import PageHeader from '@/components/common/PageHeader'
import ViewToggle from '@/components/common/ViewToggle'
import PagePagination from '@/components/common/PagePagination'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useEffect, useState } from 'react'
import useJSONData from '@/hooks/useJSONData'
import SummaryPageAction from './SummaryPageAction'
import SummaryRecords from './SummaryRecord'
import PageAction from '@/components/common/PageAction'
import { SummarySample } from '@/samples'
import useConstants from '@/hooks/useConstants'
import SearchForm from '@/components/common/SearchForm'

const Summary = () => {
	const [mobileFilter, setMobileFilter] = useState(false)

	const { message, home } = useConstants()
	// const { common, pagination } = useJSONData({ defaultData: SummarySample })
	const { common, pagination, backToSummary } = useJSONData({ selector: '#xml_record' })

	if (!common) return <></>
	return (
		<Layout>
			<div className="rounded-sm border border-primary bg-background shadow-md md:shadow-xl h-full flex-col flex w-full my-12">
				<PageAction
					breadcrumbs={[
						{ label: message.home, url: '/' },
						{
							label: message.summaryPage,
							url: backToSummary,
							active: true,
						},
					]}>
					<div className="flex w-full flex-row space-x-2 justify-end">
						{/* <Button>
							<SlidersHorizontal className="mr-2 h-4 w-4" />
							Advanced Search
						</Button> */}
						{/* <Separator orientation="vertical" /> */}
						<SearchForm
							className="w-[450px] m-0"
							inputStyle="text-black"
							searchURL={home.searchURL}
							inputName={'KEYWORD_CLUSTER'}
						/>
						<ViewToggle />
					</div>
				</PageAction>

				<section>
					<div className="mx-auto py-4 sm:py-12  container flex flex-col">
						<PageHeader
							heading={`${common.total_record} ${message.resultsFor.toLowerCase()} "${common.search_statement}"`}
							subHeading={`${message.displaying} ${common.first_record_seq}-${common.last_record_seq} ${message.of} ${common.total_record}`}
						/>
						<div className="mt-8 block lg:hidden">
							<Button
								className="flex cursor-pointer items-center gap-2 border-b "
								onClick={() => setMobileFilter(true)}>
								<span className="font-medium"> Filters & Sorting </span>
								<ChevronRight className="h-4 w-4" />
							</Button>
							<Sheet open={mobileFilter} onOpenChange={setMobileFilter}>
								<SheetContent>
									<SheetHeader>
										<SheetTitle>Filters & Sorting</SheetTitle>
									</SheetHeader>
									<div className="mt-6">
										<SummaryPageAction />
									</div>
								</SheetContent>
							</Sheet>
						</div>

						<div className="mt-4 lg:mt-8 lg:grid lg:grid-cols-4 lg:items-start lg:gap-8 ">
							<div className="hidden space-y-4 lg:block col-span-1">
								<SummaryPageAction />
							</div>
							<div className="col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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

export default Summary
