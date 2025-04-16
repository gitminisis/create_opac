export const HighlightText = ({ text, highlights }: { text: string; highlights: string[] }) => {
	if (!highlights.length) return <p className="text-foreground">{text}</p>

	// Create a regex pattern from the highlight words with word boundaries
	const regex = new RegExp(`\\b(${highlights.join('|')})\\b`, 'gi')

	// Split the text by the regex matches and include the matches
	let lastIndex = 0
	let match

	// Create an array to store the text parts and matched words
	const textArray = []

	// Use exec to iterate through all matches
	while ((match = regex.exec(text)) !== null) {
		// Add the text before the match
		if (match.index > lastIndex) {
			textArray.push({
				text: text.substring(lastIndex, match.index),
				isHighlight: false,
			})
		}

		// Add the matched word
		textArray.push({
			text: match[0],
			isHighlight: true,
		})

		lastIndex = match.index + match[0].length
	}

	// Add any remaining text after the last match
	if (lastIndex < text.length) {
		textArray.push({
			text: text.substring(lastIndex),
			isHighlight: false,
		})
	}

	return (
		<p className="text-foreground">
			{textArray.map((part, index) =>
				part.isHighlight ? (
					<span key={index} className="bg-foreground text-background px-1 rounded">
						{part.text}
					</span>
				) : (
					part.text
				)
			)}
		</p>
	)
}
