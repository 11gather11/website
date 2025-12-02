import type { ImageMetadata } from 'astro'

import { siteConfig } from '@/config/site'
import { getIndexFromSlugID } from '@/utils/hash'

export const getCoverImageByID = (id: string): ImageMetadata => {
	if (!siteConfig.banners) {
		throw new Error('No banners configured in site settings')
	}

	const index = getIndexFromSlugID(id, siteConfig.banners.length)
	return siteConfig.banners[index]
}
