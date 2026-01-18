import { describe, test, expect } from 'vitest';
import { formatCookingTime, formatPrepTime, formatCategory } from './format';

describe('formatCookingTime', () => {
  describe('正常系', () => {
    test('0分を正しくフォーマットする', () => {
      expect(formatCookingTime(0)).toBe('0分');
    });

    test('60分未満の時間を正しくフォーマットする', () => {
      expect(formatCookingTime(30)).toBe('30分');
      expect(formatCookingTime(45)).toBe('45分');
      expect(formatCookingTime(1)).toBe('1分');
    });

    test('ちょうど1時間をフォーマットする', () => {
      expect(formatCookingTime(60)).toBe('1時間');
    });

    test('1時間以上で端数がない時間をフォーマットする', () => {
      expect(formatCookingTime(120)).toBe('2時間');
      expect(formatCookingTime(180)).toBe('3時間');
    });

    test('1時間以上で端数がある時間をフォーマットする', () => {
      expect(formatCookingTime(90)).toBe('1時間30分');
      expect(formatCookingTime(135)).toBe('2時間15分');
      expect(formatCookingTime(185)).toBe('3時間5分');
    });
  });

  describe('異常系', () => {
    test('負の値を渡すとエラーをスローする', () => {
      expect(() => formatCookingTime(-1)).toThrow('調理時間は0以上である必要があります');
      expect(() => formatCookingTime(-60)).toThrow('調理時間は0以上である必要があります');
    });
  });
});

describe('formatPrepTime', () => {
  describe('正常系', () => {
    test('0分を正しくフォーマットする', () => {
      expect(formatPrepTime(0)).toBe('0分');
    });

    describe('短時間（0-119分）: 機械的表記', () => {
      test('60分未満の時間を正しくフォーマットする', () => {
        expect(formatPrepTime(15)).toBe('15分');
        expect(formatPrepTime(30)).toBe('30分');
        expect(formatPrepTime(45)).toBe('45分');
      });

      test('1時間をフォーマットする', () => {
        expect(formatPrepTime(60)).toBe('1時間');
      });

      test('1時間半をフォーマットする', () => {
        expect(formatPrepTime(90)).toBe('1時間30分');
      });
    });

    describe('中時間（120-359分）: 時間単位', () => {
      test('2時間をフォーマットする', () => {
        expect(formatPrepTime(120)).toBe('2時間');
      });

      test('3時間をフォーマットする', () => {
        expect(formatPrepTime(180)).toBe('3時間');
      });

      test('端数がある時間は「程度」を付ける', () => {
        expect(formatPrepTime(150)).toBe('2時間30分程度');
        expect(formatPrepTime(195)).toBe('3時間15分程度');
      });

      test('境界値（359分）を正しく処理する', () => {
        expect(formatPrepTime(359)).toBe('5時間59分程度');
      });
    });

    describe('長時間（360-720分）: 慣用表現', () => {
      test('360-479分は「半日程度」', () => {
        expect(formatPrepTime(360)).toBe('半日程度');
        expect(formatPrepTime(420)).toBe('半日程度');
        expect(formatPrepTime(479)).toBe('半日程度');
      });

      test('480-720分は「一晩」', () => {
        expect(formatPrepTime(480)).toBe('一晩');
        expect(formatPrepTime(600)).toBe('一晩');
        expect(formatPrepTime(720)).toBe('一晩');
      });
    });

    describe('超長時間（721分以上）: 日単位', () => {
      test('721-1439分は「半日～1日」', () => {
        expect(formatPrepTime(721)).toBe('半日～1日');
        expect(formatPrepTime(1000)).toBe('半日～1日');
        expect(formatPrepTime(1439)).toBe('半日～1日');
      });

      test('1440分は「1日」', () => {
        expect(formatPrepTime(1440)).toBe('1日');
      });

      test('1441-2879分は「1-2日程度」', () => {
        expect(formatPrepTime(1441)).toBe('1-2日程度');
        expect(formatPrepTime(2000)).toBe('1-2日程度');
        expect(formatPrepTime(2879)).toBe('1-2日程度');
      });

      test('2880-4319分は「2-3日程度」', () => {
        expect(formatPrepTime(2880)).toBe('2-3日程度');
        expect(formatPrepTime(3600)).toBe('2-3日程度');
        expect(formatPrepTime(4319)).toBe('2-3日程度');
      });

      test('4320-10079分は「N日程度」または「3日-1週間」', () => {
        expect(formatPrepTime(4320)).toBe('3日程度');
        expect(formatPrepTime(5760)).toBe('4日程度');
        expect(formatPrepTime(7200)).toBe('5日程度');
        expect(formatPrepTime(8640)).toBe('6日程度');
      });

      test('10080分は「1週間」', () => {
        expect(formatPrepTime(10080)).toBe('1週間');
      });

      test('10080分以上は「N週間程度」', () => {
        expect(formatPrepTime(20160)).toBe('2週間程度');
        expect(formatPrepTime(30240)).toBe('3週間程度');
      });
    });

    describe('実際のレシピデータでの検証', () => {
      test('スープカレーの下準備（30分）', () => {
        expect(formatPrepTime(30)).toBe('30分');
      });

      test('味噌ホルモン漬けの漬け込み時間（720分=12時間）', () => {
        expect(formatPrepTime(720)).toBe('一晩');
      });

      test('ベーコンの漬け込み時間（1440分=24時間）', () => {
        expect(formatPrepTime(1440)).toBe('1日');
      });
    });
  });

  describe('異常系', () => {
    test('負の値を渡すとエラーをスローする', () => {
      expect(() => formatPrepTime(-1)).toThrow('準備時間は0以上である必要があります');
      expect(() => formatPrepTime(-720)).toThrow('準備時間は0以上である必要があります');
    });
  });
});

describe('formatCategory', () => {
  test('カテゴリIDを日本語に変換する', () => {
    expect(formatCategory('japanese')).toBe('和食');
    expect(formatCategory('western')).toBe('洋食');
    expect(formatCategory('chinese')).toBe('中華');
    expect(formatCategory('ethnic')).toBe('エスニック');
    expect(formatCategory('sauce')).toBe('タレ');
    expect(formatCategory('prep-base')).toBe('仕込み・ベース');
  });

  test('未定義のカテゴリはそのまま返す', () => {
    expect(formatCategory('unknown')).toBe('unknown');
  });
});
