import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as storage from './storage.js';

function setupStorage() {
  let store = {};
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(key => store[key] || null),
      setItem: vi.fn((key, val) => { store[key] = val; }),
      removeItem: vi.fn(key => { delete store[key]; }),
      clear: vi.fn(() => { store = {}; })
    },
    writable: true
  });
}

describe('storage.js', () => {
  beforeEach(() => {
    setupStorage();
    window.localStorage.clear();
  });

  it('getSubmissions returns [] if nothing stored', () => {
    expect(storage.getSubmissions()).toEqual([]);
  });

  it('addSubmission and getSubmissions work', () => {
    const sub = { id: '1', name: 'A', email: 'a@b.com', mobile: '1234567890', department: 'HR', status: 'pending' };
    storage.addSubmission(sub);
    expect(storage.getSubmissions()).toEqual([sub]);
  });

  it('saveSubmissions overwrites all', () => {
    const arr = [
      { id: '1', name: 'A', email: 'a@b.com', mobile: '1234567890', department: 'HR', status: 'pending' },
      { id: '2', name: 'B', email: 'b@b.com', mobile: '1234567891', department: 'IT', status: 'approved' }
    ];
    storage.saveSubmissions(arr);
    expect(storage.getSubmissions()).toEqual(arr);
  });

  it('updateSubmission updates fields', () => {
    const sub = { id: '1', name: 'A', email: 'a@b.com', mobile: '1234567890', department: 'HR', status: 'pending' };
    storage.addSubmission(sub);
    const updated = { name: 'A2', status: 'approved' };
    const result = storage.updateSubmission('1', updated);
    expect(result).toBe(true);
    const got = storage.getSubmissions()[0];
    expect(got.name).toBe('A2');
    expect(got.status).toBe('approved');
    expect(got.email).toBe('a@b.com');
  });

  it('updateSubmission returns false if not found', () => {
    expect(storage.updateSubmission('notfound', { name: 'X' })).toBe(false);
  });

  it('deleteSubmission removes by id', () => {
    const sub1 = { id: '1', name: 'A', email: 'a@b.com', mobile: '1234567890', department: 'HR', status: 'pending' };
    const sub2 = { id: '2', name: 'B', email: 'b@b.com', mobile: '1234567891', department: 'IT', status: 'approved' };
    storage.saveSubmissions([sub1, sub2]);
    const result = storage.deleteSubmission('1');
    expect(result).toBe(true);
    expect(storage.getSubmissions()).toEqual([sub2]);
  });

  it('deleteSubmission returns false if not found', () => {
    expect(storage.deleteSubmission('notfound')).toBe(false);
  });

  it('isEmailDuplicate detects duplicates (case-insensitive)', () => {
    const sub = { id: '1', name: 'A', email: 'a@b.com', mobile: '1234567890', department: 'HR', status: 'pending' };
    storage.addSubmission(sub);
    expect(storage.isEmailDuplicate('a@b.com')).toBe(true);
    expect(storage.isEmailDuplicate('A@B.COM')).toBe(true);
    expect(storage.isEmailDuplicate('other@b.com')).toBe(false);
  });

  it('isEmailDuplicate excludes id when provided', () => {
    const sub = { id: '1', name: 'A', email: 'a@b.com', mobile: '1234567890', department: 'HR', status: 'pending' };
    storage.addSubmission(sub);
    expect(storage.isEmailDuplicate('a@b.com', '1')).toBe(false);
    expect(storage.isEmailDuplicate('a@b.com', '2')).toBe(true);
  });

  it('getSubmissions returns [] and clears corrupted data', () => {
    window.localStorage.setItem('hirehub_submissions', 'not-json');
    expect(storage.getSubmissions()).toEqual([]);
    expect(window.localStorage.getItem('hirehub_submissions')).toBe(null);
  });

  it('getSubmissions returns [] if not an array', () => {
    window.localStorage.setItem('hirehub_submissions', '{"foo":1}');
    expect(storage.getSubmissions()).toEqual([]);
  });

  it('saveSubmissions handles errors gracefully', () => {
    // Simulate quota exceeded
    window.localStorage.setItem = vi.fn(() => { throw new Error('quota'); });
    expect(() => storage.saveSubmissions([{ id: '1' }])).not.toThrow();
  });
});