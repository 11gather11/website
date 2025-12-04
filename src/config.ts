import avatar from './assets/avatar.png'
import banner from './assets/banners/banner.png'

const NAVIGATORS = [
	{
		name: 'Home',
		href: '/',
	},
	{
		name: 'Archive',
		href: '/archive',
	},
	{
		name: 'About',
		href: '/about',
	},
] as const

const SOCIAL_LINKS = [
	{
		icon: 'tabler:brand-x',
		link: 'https://x.com/vvvmeovvv',
	},
	{
		icon: 'tabler:brand-youtube',
		link: 'https://youtube.com/@vvvmeovvv',
	},
	{
		icon: 'tabler:brand-twitch',
		link: 'https://twitch.tv/vvvmeovvv',
	},
	{
		icon: 'tabler:brand-discord',
		link: 'https://discord.com/invite/jJkYtgu4HU',
	},
	{
		icon: 'tabler:brand-instagram',
		link: 'https://www.instagram.com/vvvmeovvv',
	},
	{
		icon: 'tabler:brand-tiktok',
		link: 'https://www.tiktok.com/@vvvmeovvv',
	},
] as const

export const SITE = {
	name: 'My Awesome Website',
	author: '11gather11',
	site: 'https://11gather11.com',
	base: '/',
	trailingSlash: false,
	avatar: avatar,
	pageSize: 8,
	maxCategoryCount: 6,
	maxTagCount: 12,
	navigators: NAVIGATORS,
	socialLinks: SOCIAL_LINKS,
	sign: 'a 11gather11 Works project',
} as const

export const METADATA = {
	title: {
		template: '%s | My Awesome Website',
		default: 'My Awesome Website',
	},
	description: 'A blog about awesome things.',
	openGraph: {
		title: 'My Awesome Website',
		type: 'website',
		image: banner,
	},
} as const

export const I18N = {
	lang: 'ja',
	dir: 'ltr',
} as const

export const BANNERS = [banner, banner, banner, banner, banner, banner, banner, banner] as const
