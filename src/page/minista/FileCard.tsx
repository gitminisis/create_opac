"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Share,
    Bookmark,
    Download,
    Eye,
    Calendar,
    MoreHorizontal,
} from "lucide-react"
import { FileItem } from "./types"

interface FileCardProps {
    file: FileItem
    onClick: (file: FileItem) => void
    viewMode: "grid" | "list"
}

export default function FileCard({ file, onClick, viewMode }: FileCardProps) {
    return (
        <Card
            key={file.id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white cursor-pointer"
            onClick={() => onClick(file)}
        >
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                                {file.category.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-sm text-gray-900">MINISIS Inc</p>
                            <p className="text-xs text-gray-500 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {file.date}
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="relative aspect-square bg-gray-100">
                    <img 
                        src={file.thumbnail || "/placeholder.svg"} 
                        alt={file.name} 
                        className="object-cover w-full h-full" 
                    />
                    <div className="absolute top-2 right-2">
                        <Badge className="bg-blue-100 text-blue-800">{file.category}</Badge>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {file.size}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-4">
                {/* Action Buttons */}
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={(e) => e.stopPropagation()}>
                            <Share className="w-5 h-5 text-gray-600" />
                        </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={(e) => e.stopPropagation()}>
                            <Eye className="w-4 h-4 text-gray-600" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={(e) => e.stopPropagation()}>
                            <Download className="w-4 h-4 text-gray-600" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={(e) => e.stopPropagation()}>
                            <Bookmark className="w-5 h-5 text-gray-600" />
                        </Button>
                    </div>
                </div>

                {/* File Info */}
                <div className="w-full text-left space-y-2">
                    <p className="font-medium text-sm text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{file.description}</p>
                </div>
            </CardFooter>
        </Card>
    )
}
