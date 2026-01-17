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

/**
 * 準備時間を分単位から料理レシピで慣用的な表現に変換する
 * 短時間は機械的表記、長時間は「一晩」「半日程度」などの慣用表現を使用
 *
 * @param minutes 分単位の準備時間
 * @returns フォーマットされた文字列（例: "30分"、"一晩"、"2-3日程度"）
 *
 * @example
 * formatPrepTime(30)    // => "30分"
 * formatPrepTime(720)   // => "一晩"
 * formatPrepTime(1440)  // => "1日"
 * formatPrepTime(2880)  // => "2-3日程度"
 */
export function formatPrepTime(minutes: number): string {
  if (minutes < 0) {
    throw new Error('準備時間は0以上である必要があります');
  }

  if (minutes === 0) {
    return '0分';
  }

  // 0-119分: 機械的表記（分・時間単位）
  if (minutes < 120) {
    return formatCookingTime(minutes);
  }

  // 120-359分 (2-5.9時間): 時間単位
  if (minutes < 360) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours}時間`;
    }

    // 端数がある場合は「程度」を付ける
    return `${hours}時間${remainingMinutes}分程度`;
  }

  // 360-479分 (6-7.9時間): 半日程度
  if (minutes < 480) {
    return '半日程度';
  }

  // 480-720分 (8-12時間): 一晩
  if (minutes <= 720) {
    return '一晩';
  }

  // 721-1439分 (12.1-23.9時間): 半日～1日
  if (minutes < 1440) {
    return '半日～1日';
  }

  // 1440-2879分 (24-47.9時間): 1日または1-2日程度
  if (minutes < 2880) {
    // ちょうど1日（1440分）の場合のみ「1日」、それ以外は「1-2日程度」
    if (minutes === 1440) {
      return '1日';
    }
    return '1-2日程度';
  }

  // 2880-4319分 (48-71.9時間): 2-3日程度
  if (minutes < 4320) {
    return '2-3日程度';
  }

  // 4320-10079分 (72時間-7日未満): 3日-1週間
  if (minutes < 10080) {
    const days = Math.floor(minutes / 1440);
    if (days < 7) {
      return `${days}日程度`;
    }
    return '3日-1週間';
  }

  // 10080分以上 (7日以上): 1週間以上
  const weeks = Math.floor(minutes / 10080);
  if (weeks === 1) {
    return '1週間';
  }

  return `${weeks}週間程度`;
}

/**
 * カテゴリIDを日本語表記に変換する
 *
 * @param category カテゴリID
 * @returns 日本語のカテゴリ名
 *
 * @example
 * formatCategory('japanese')          // => "和食"
 * formatCategory('preserved-sauces')  // => "保存食・タレ"
 */
export function formatCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    japanese: '和食',
    western: '洋食',
    chinese: '中華',
    ethnic: 'エスニック',
    'preserved-sauces': '保存食・タレ',
  };

  return categoryMap[category] ?? category;
}
