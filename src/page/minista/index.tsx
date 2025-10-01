
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Grid3X3,
    List,
    Search
} from "lucide-react"
import { useState } from "react"
import Layout from "@/components/layouts"

import { useQuery } from "@tanstack/react-query"

import LoadingState from "./LoadingState"
import { AssetSearchResponse, AuthResponse, FileItem } from "./types"
import FileCard from "./FileCard"
import FileDetailModal from "./FileDetailModal"
import { axios } from "@/lib/axios"



export default function Minista() {
    const [searchQuery, setSearchQuery] = useState("")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)


    // Automatically authenticate when component mounts
    const { error: authError, isPending: isAuthLoading } = useQuery<AuthResponse>({
        queryKey: ['minista-login'],
        queryFn: async () => {
            try {
                // Use the autoLogin function from our API service
                const formData = new URLSearchParams();
                formData.append('username', 'Cams.Dev');
                formData.append('password', 'Cams.Dev_12!');
                formData.append('grant_type', 'password');

                const response = await axios.post<AuthResponse>(('/tdr/token'), formData, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });

                // Store token in session storage
                const { access_token, expires_in } = response.data;
                sessionStorage.setItem('auth_token', access_token);

                // Store expiration time
                const expiresAt = new Date();
                expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);
                sessionStorage.setItem('auth_expires', expiresAt.toISOString());

                // Store full auth data
                sessionStorage.setItem('auth_data', JSON.stringify(response.data));

                return response.data;
            } catch (error) {
                console.error('Login failed:', error);
                throw error;
            }
        },
        // Retry 3 times if the request fails
        retry: 3,
    })




    const { data: assetData } = useQuery<AssetSearchResponse>({
        queryKey: ['minista-asset-search'],
        queryFn: async () => {
            const response = await axios.post<AssetSearchResponse>(('/tdr/api/Discover/AssetsSearch'), {
                ClusterSearchKeyword: searchQuery.trim().length > 0 ? searchQuery : "++@",
                ClusterSearchOperator: "regex",
                Filters: [],
                Page: 0,
                PageSize: 24,
                SortedBy: [{ Id: "FileName", Desc: false }],
            }, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`,
                }
            });
            return response.data;
        },
        enabled: !isAuthLoading // Only run this query when authentication is complete
    })

    // Map API response to our file format
    const mapAssetToFile = (asset: AssetSearchResponse['PageItems'][0]) => ({
        id: asset.Uuid,
        name: asset.Name,
        category: asset.Extension?.replace('.', '') || 'Unknown',
        size: `${asset.MbSize} MB`,
        date: new Date(asset.IngestDate).toLocaleDateString(),
        thumbnail: asset.Thumbnail ? `data:image/jpeg;base64,${asset.Thumbnail}` : '/placeholder.png',
        description: asset.Content || asset.Description || 'No description available',
        originalData: asset // Keep the original data for reference
    });



    const openDetail = (file: FileItem) => {
        setSelectedFile(file)
        setIsDetailOpen(true)
    }

    // Map API data to our file format or use mock data if API data is not available
    const files = assetData?.PageItems.map(mapAssetToFile) ?? []

    const filteredFiles = files.filter(
        (file) =>
            file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <Layout>
            {isAuthLoading && (
                <LoadingState />
            )}
            {authError && (
                <div className="max-w-6xl mx-auto px-4 py-2 bg-red-50 border border-red-200 rounded-md mt-2">
                    <p className="text-red-600">Authentication error: {authError instanceof Error ? authError.message : 'Unknown error'}</p>
                </div>
            )}
            {!isAuthLoading && <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b ">
                    <div className="max-w-6xl mx-auto px-4 py-4">


                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                                <h1 className="text-2xl font-bold text-gray-900">Discover</h1>
                                <Badge variant="default" className="text-sm">
                                    {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'}
                                </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant={viewMode === "grid" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search files..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-gray-50 border-gray-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div
                        className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
                    >
                        {filteredFiles.map((file) => (
                            <FileCard
                                key={file.id}
                                file={file}
                                onClick={openDetail}
                                viewMode={viewMode}
                            />
                        ))}
                    </div>
                </div>

                {/* File Detail Modal */}
                {isDetailOpen && selectedFile && (
                    <FileDetailModal
                        file={selectedFile}
                        isOpen={isDetailOpen}
                        onClose={() => setIsDetailOpen(false)}
                    />
                )}
            </div>}
        </Layout>
    )
}
