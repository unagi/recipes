/**
 * 調理時間を分単位から人間が読みやすい形式に変換する
 * @param minutes 分単位の時間
 * @returns フォーマットされた文字列（例: "1時間30分"、"45分"）
 */
export function formatCookingTime(minutes: number): string {
  if (minutes < 0) {
    throw new Error('調理時間は0以上である必要があります');
  }

  if (minutes === 0) {
    return '0分';
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}分`;
  }

  if (remainingMinutes === 0) {
    return `${hours}時間`;
  }

  return `${hours}時間${remainingMinutes}分`;
}
