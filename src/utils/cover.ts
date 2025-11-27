import { siteConfig } from '@/config/site'
import { getIndexFromSlugID } from '@/utils/hash'

/**
 * エントリーIDに基づいてカバー画像のURLを取得
 *
 * この関数は記事や投稿のIDからハッシュ値を計算し、
 * サイト設定のバナー配列から対応するカバー画像のURLを返します。
 * 同じIDに対しては常に同じ画像が返されるため、一貫性のある表示が可能です。
 *
 * @param id - エントリーの一意識別子（記事のスラグなど）
 * @returns 対応するカバー画像のURL
 * @throws サイト設定にバナーが設定されていない場合はエラー
 */
export const getCoverImageByID = (id: string): string => {
	// バナー配列の存在チェック
	if (!siteConfig.banners || siteConfig.banners.length === 0) {
		throw new Error('No banners configured in site settings')
	}

	const index = getIndexFromSlugID(id, siteConfig.banners.length)
	return siteConfig.banners[index]
}
