import type { ImageMetadata } from 'astro'

import { BANNERS } from '@/config'
import { getIndexFromSlugID } from '@/utils/hash'

export const getCoverImageByID = (id: string): ImageMetadata => {
	if (!BANNERS) {
		throw new Error('No banners configured in site settings')
	}

	const index = getIndexFromSlugID(id, BANNERS.length)
	return BANNERS[index]
}
