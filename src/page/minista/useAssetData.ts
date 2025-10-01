"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/services/api"
import { AuthResponse, AssetSearchResponse, FileItem } from "./types"

export function useAuth() {
    return useQuery<AuthResponse>({
        queryKey: ['minista-login'],
        queryFn: async () => {
            try {
                // Use the autoLogin function from our API service
                const formData = new URLSearchParams();
                formData.append('username', 'Cams.Dev');
                formData.append('password', 'Cams.Dev_12!');
                formData.append('grant_type', 'password');

                const response = await api.post<AuthResponse>(('/token'), formData, {
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
    });
}

export function useAssetSearch(isAuthLoading: boolean) {
    return useQuery<AssetSearchResponse>({
        queryKey: ['minista-asset-search'],
        queryFn: async () => {
            const response = await api.post<AssetSearchResponse>(('/Discover/AssetsSearch'), {
                ClusterSearchKeyword: "++@",
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
    });
}

// Map API response to our file format
export function mapAssetToFile(asset: AssetSearchResponse['PageItems'][0]): FileItem {
    return {
        id: asset.Uuid,
        name: asset.Name,
        category: asset.Extension?.replace('.', '') || 'Unknown',
        size: `${asset.MbSize} MB`,
        date: new Date(asset.IngestDate).toLocaleDateString(),
        thumbnail: asset.Thumbnail ? `data:image/jpeg;base64,${asset.Thumbnail}` : '/placeholder.png',
        description: asset.Content || asset.Description || 'No description available',
        originalData: asset // Keep the original data for reference
    };
}

// Mock data as fallback when API data is not available
export const mockFiles: FileItem[] = [
    {
        id: "1",
        name: "Document 1.pdf",
        category: "PDF",
        size: "2.4 MB",
        date: "2023-01-15",
        thumbnail: "/placeholder.png",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
        id: "2",
        name: "Image 1.jpg",
        category: "Image",
        size: "1.2 MB",
        date: "2023-02-20",
        thumbnail: "/placeholder.png",
        description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
];
