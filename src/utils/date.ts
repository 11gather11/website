export const formatDate = (
	date: Date,
	options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}
): string => {
	return date.toLocaleDateString('ja-JP', options).replace(/\//g, '-')
}
