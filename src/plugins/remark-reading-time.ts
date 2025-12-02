import type { Root } from 'mdast'
// biome-ignore lint/suspicious/noShadowRestrictedNames: <toString from mdast-util-to-string>
import { toString } from 'mdast-util-to-string'
import getReadingTime from 'reading-time'
import type { VFile } from 'vfile'

/**
 * Remark プラグイン: 記事の読み取り時間を計算してfrontmatterに追加
 *
 * @returns Remark変換関数
 *
 * @remarks
 * - `minutes`: 読み取り時間（分）、最低1分
 * - `words`: 総単語数
 */
const remarkReadingTime = () => {
	return (tree: Root, file: VFile): void => {
		const textOnPage = toString(tree)
		const readingTime = getReadingTime(textOnPage)

		// Astro の data 構造に安全にアクセス
		if (!file.data.astro) {
			file.data.astro = { frontmatter: {} }
		}

		if (!file.data.astro.frontmatter) {
			file.data.astro.frontmatter = {}
		}

		file.data.astro.frontmatter.minutes = Math.max(1, Math.round(readingTime.minutes))
		file.data.astro.frontmatter.words = readingTime.words
	}
}

export default remarkReadingTime
