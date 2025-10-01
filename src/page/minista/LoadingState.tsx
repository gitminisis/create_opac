import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Grid3X3, List, Search } from "lucide-react"

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-32" />
              <Badge variant="secondary" className="text-sm">
                <Skeleton className="h-4 w-16" />
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" disabled>
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <Card key={index} className="overflow-hidden bg-white animate-pulse">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="w-6 h-6 rounded" />
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="relative aspect-square bg-gray-100">
                  <Skeleton className="w-full h-full" />
                  <div className="absolute top-2 right-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Skeleton className="h-5 w-12 rounded" />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-3 pt-4">
                {/* Action Buttons Skeleton */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-5 h-5 rounded" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="w-4 h-4 rounded" />
                    <Skeleton className="w-4 h-4 rounded" />
                    <Skeleton className="w-5 h-5 rounded" />
                  </div>
                </div>

                {/* File Info Skeleton */}
                <div className="w-full text-left space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
