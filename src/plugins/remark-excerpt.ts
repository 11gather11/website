import type { Root } from 'mdast'
// biome-ignore lint/suspicious/noShadowRestrictedNames: <toString from mdast-util-to-string>
import { toString } from 'mdast-util-to-string'
import type { VFile } from 'vfile'

/**
 * Remark プラグイン: 最初の段落を記事の要約として抽出
 *
 * @returns Remark変換関数
 */
const remarkExcerpt = () => {
	return (tree: Root, file: VFile): void => {
		let excerpt = ''

		// 最初の段落を検索
		for (const node of tree.children) {
			if (node.type !== 'paragraph') {
				continue
			}
			excerpt = toString(node)
			break
		}

		// 安全にfrontmatterにアクセス
		if (!file.data) {
			file.data = {}
		}

		if (!file.data.astro) {
			file.data.astro = { frontmatter: {} }
		}

		if (!file.data.astro.frontmatter) {
			file.data.astro.frontmatter = {}
		}

		file.data.astro.frontmatter.excerpt = excerpt
	}
}

export default remarkExcerpt
