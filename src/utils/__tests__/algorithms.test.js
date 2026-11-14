/**
 * Tests for src/utils/algorithms.js
 *
 * These tests cover the most commonly used utility functions:
 *  - formatDuration
 *  - formatLongDuration
 *  - getCurrentLyricIndex
 *  - adjustTimestamps
 *  - validateTimestamps
 *  - calculateSyncAccuracy
 *
 * They are written with Jest, which is the default test runner in most
 * Create‑React‑App / React projects.
 */

import {
  formatDuration,
  formatLongDuration,
  getCurrentLyricIndex,
  adjustTimestamps,
  validateTimestamps,
  calculateSyncAccuracy,
} from '../../utils/algorithms';

describe('formatDuration', () => {
  test('formats typical seconds correctly', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(5)).toBe('0:05');
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(125)).toBe('2:05');
  });

  test('handles non‑numeric or negative input gracefully', () => {
    expect(formatDuration(NaN)).toBe('0:00');
    expect(formatDuration(-10)).toBe('0:00');
  });
});

describe('formatLongDuration', () => {
  test('formats without hours when < 1 hour', () => {
    expect(formatLongDuration(0)).toBe('0:00');
    expect(formatLongDuration(65)).toBe('1:05');
  });

  test('includes hours when >= 1 hour', () => {
    expect(formatLongDuration(3600)).toBe('1:00:00');
    expect(formatLongDuration(3665)).toBe('1:01:05');
    expect(formatLongDuration(7325)).toBe('2:02:05');
  });

  test('handles invalid input', () => {
    expect(formatLongDuration(NaN)).toBe('0:00:00');
    expect(formatLongDuration(-5)).toBe('0:00:00');
  });
});

describe('getCurrentLyricIndex (binary search)', () => {
  const lyrics = [
    { startTime: 0, text: 'Line 1' },
    { startTime: 5, text: 'Line 2' },
    { startTime: 10, text: 'Line 3' },
    { startTime: 15, text: 'Line 4' },
  ];

  test('returns -1 when list is empty', () => {
    expect(getCurrentLyricIndex([], 3)).toBe(-1);
  });

  test('finds correct index for exact timestamps', () => {
    expect(getCurrentLyricIndex(lyrics, 0)).toBe(0);
    expect(getCurrentLyricIndex(lyrics, 5)).toBe(1);
    expect(getCurrentLyricIndex(lyrics, 15)).toBe(3);
  });

  test('finds the last lyric whose startTime is <= currentTime', () => {
    expect(getCurrentLyricIndex(lyrics, 7)).toBe(1);
    expect(getCurrentLyricIndex(lyrics, 14.9)).toBe(2);
    expect(getCurrentLyricIndex(lyrics, 20)).toBe(3);
  });
});

describe('adjustTimestamps', () => {
  const original = [
    { startTime: 1, endTime: 2, text: 'A' },
    { startTime: 3, endTime: null, text: 'B' },
  ];

  test('adds positive offset', () => {
    const adjusted = adjustTimestamps(original, 2);
    expect(adjusted).toEqual([
      { startTime: 3, endTime: 4, text: 'A' },
      { startTime: 5, endTime: null, text: 'B' },
    ]);
  });

  test('prevents negative timestamps', () => {
    const adjusted = adjustTimestamps(original, -5);
    expect(adjusted).toEqual([
      { startTime: 0, endTime: 0, text: 'A' },
      { startTime: 0, endTime: null, text: 'B' },
    ]);
  });
});

describe('validateTimestamps', () => {
  test('returns valid when timestamps are chronological', () => {
    const good = [
      { startTime: 0 },
      { startTime: 2 },
      { startTime: 5 },
    ];
    expect(validateTimestamps(good)).toEqual({ valid: true });
  });

  test('detects out‑of‑order timestamps', () => {
    const bad = [
      { startTime: 0 },
      { startTime: 5 },
      { startTime: 3 },
    ];
    const result = validateTimestamps(bad);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/Timestamp at index 2/);
    expect(result.index).toBe(2);
  });
});

describe('calculateSyncAccuracy', () => {
  test('returns 100 for perfectly spaced lyrics', () => {
    const perfect = [
      { startTime: 0 },
      { startTime: 2 },
      { startTime: 4 },
      { startTime: 6 },
    ];
    expect(calculateSyncAccuracy(perfect)).toBe(100);
  });

  test('decreases accuracy when intervals vary', () => {
    const varied = [
      { startTime: 0 },
      { startTime: 2 },
      { startTime: 5 }, // larger gap
      { startTime: 6 },
    ];
    const accuracy = calculateSyncAccuracy(varied);
    expect(accuracy).toBeLessThan(100);
    expect(accuracy).toBeGreaterThanOrEqual(0);
  });

  test('handles very small lyric sets gracefully', () => {
    expect(calculateSyncAccuracy([])).toBe(100);
    expect(calculateSyncAccuracy([{ startTime: 0 }])).toBe(100);
  });
});
