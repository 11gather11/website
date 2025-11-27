export type SiteConfig = {
	title: string
	subtitle: string
	brandTitle: string

	description: string

	site: string

	lang: string

	navigators: { name: string; href: string }[]

	username: string
	copyrightName: string
	sign: string
	avatarUrl: string

	socialLinks: { icon: string; link: string }[]

	maxSidebarCategoryChip: number
	maxSidebarTagChip: number
	maxFooterCategoryChip: number
	maxFooterTagChip: number

	banners: string[]

	slugMode: 'HASH' | 'RAW'
	slugLength: number

	bannerStyle: 'LOOP'

	pageSize: number
}
