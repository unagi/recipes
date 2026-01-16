import { describe, test, expect } from 'vitest';
import { formatCookingTime } from './format';

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
