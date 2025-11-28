export const siteConfig = {
	title: 'ggggg',
	subtitle: '11gather11 Official Blog site',
	brandTitle: 'gggg',

	description: '11gather11 Official site',

	site: 'https://11gather11.com/',

	lang: 'ja',

	navigators: [
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
	],

	username: '11gather11',
	copyrightName: '11gather11Works',
	sign: 'a 11gather11Works project',
	avatarUrl: '/images/meoLogo.png',

	socialLinks: [
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
		{
			icon: 'tabler:brand-github',
			link: 'https://github.com/11gather11',
		},
	],

	maxSidebarCategoryChip: 6,
	maxSidebarTagChip: 12,
	maxFooterCategoryChip: 6,
	maxFooterTagChip: 24,

	banners: [
		'/images/banner.png',
		'/images/banner.png',
		'/images/banner.png',
		'/images/banner.png',
		'/images/banner.png',
		'/images/banner.png',
		'/images/banner.png',
		'/images/banner.png',
	],

	bannerStyle: 'LOOP',

	pageSize: 8,
} as const
