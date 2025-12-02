import rss from '@astrojs/rss'
import type { APIContext } from 'astro'

import { METADATA, SITE } from '@/config'
import { getSortedArticles } from '@/utils/articles'

export const GET = async (context: APIContext) => {
	const articles = await getSortedArticles()
	return rss({
		title: SITE.name,
		description: METADATA.description,
		site: context.site ?? SITE.site,
		items: articles.map((article) => ({
			title: article.data.title,
			pubDate: article.data.published,
			description: article.data.description,
			link: `/articles/${article.id}/`,
		})),
		trailingSlash: SITE.trailingSlash,
	})
}
