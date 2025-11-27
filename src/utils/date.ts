/**
 * 日付をYYYY-MM-DD形式の文字列に変換
 *
 * この関数は日本語ロケール（ja-JP）を使用して日付をフォーマットし、
 * スラッシュ区切りからハイフン区切りに変換します。
 * デフォルトでは年-月-日の形式で出力されます。
 *
 * @param date - 変換する日付オブジェクト
 * @param options - 日付フォーマットのオプション（デフォルト: YYYY-MM-DD形式）
 * @returns ハイフン区切りの日付文字列（例: "2024-03-15"）
 *
 * @example
 * ```typescript
 * const date = new Date('2024-03-15')
 * formatDate(date) // "2024-03-15"
 *
 * // カスタムフォーマット
 * formatDate(date, { year: 'numeric', month: 'long', day: 'numeric' })
 * // "2024-3月-15"
 * ```
 */
export const formatDate = (
	date: Date,
	options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}
): string => {
	return date.toLocaleDateString('ja-JP', options).replace(/\//g, '-')
}
