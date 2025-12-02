import { siteConfig } from '@/config/site'
import { getIndexFromSlugID } from '@/utils/hash'

export const getCoverImageByID = (id: string): string => {
	if (!siteConfig.banners) {
		throw new Error('No banners configured in site settings')
	}

	const index = getIndexFromSlugID(id, siteConfig.banners.length)
	return siteConfig.banners[index]
}
