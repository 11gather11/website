import rss from '@astrojs/rss'
import type { APIContext } from 'astro'

import { siteConfig } from '@/config/site'
import { getSortedArticles } from '@/utils/articles'

export const GET = async (context: APIContext) => {
	const articles = await getSortedArticles()
	return rss({
		title: siteConfig.title,
		description: siteConfig.subtitle,
		site: context.site ?? 'https://blog.vvvmeovvv.com',
		items: articles.map((article) => ({
			title: article.data.title,
			pubDate: article.data.published,
			description: article.data.description,
			link: `/articles/${article.id}/`,
		})),
		stylesheet: '/rss/styles.xsl',
	})
}
