'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Twitter, Facebook, Linkedin, Mail, Share2 } from 'lucide-react'
import useConstants from '@/hooks/useConstants'

export default function ShareButton({ url }: { url: string }) {
	const [isOpen, setIsOpen] = useState(false)
	const { message } = useConstants()
	const shareUrl = url
	const shareTitle = 'Check out this page!'

	const shareLinks = [
		{
			name: 'Twitter',
			icon: <Twitter className="w-5 h-5" />,
			url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
		},
		{
			name: 'Facebook',
			icon: <Facebook className="w-5 h-5" />,
			url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
		},
		{
			name: 'LinkedIn',
			icon: <Linkedin className="w-5 h-5" />,
			url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`,
		},
		{
			name: 'Email',
			icon: <Mail className="w-5 h-5" />,
			url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`,
		},
	]

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground group transition-all duration-300">
					<Share2 className="mr-2 h-4 w-4 transition-transform group-hover:rotate-45" />
					{message.shareThisPage}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md rounded">
				<DialogHeader>
					<DialogTitle>Share this page</DialogTitle>
				</DialogHeader>
				<div className="flex justify-center space-x-2">
					{shareLinks.map((link) => (
						<Button
							key={link.name}
							variant="outline"
							size="icon"
							className="w-12 h-12"
							onClick={() => {
								window.open(link.url, '_blank')
								setIsOpen(false)
							}}>
							{link.icon}
							<span className="sr-only">Share on {link.name}</span>
						</Button>
					))}
				</div>
			</DialogContent>
		</Dialog>
	)
}
