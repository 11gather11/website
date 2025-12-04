import banner from './assets/banners/banner.png'

export const SITE = {
	name: 'My Awesome Website',
	author: '11gather11',
	site: 'https://11gather11.com',
	base: '/',
	trailingSlash: false,
	pageSize: 8,
} as const

export const METADATA = {
	description: 'A blog about awesome things.',
} as const

export const I18N = {
	lang: 'ja',
	dir: 'ltr',
} as const

export const BANNERS = [banner, banner, banner, banner, banner, banner, banner, banner] as const
