/*
 * Lyrics: pure logic for the lyrics → Chinese + pinyin PDF page.
 * UMD: window.Lyrics in the browser, module.exports in node. No DOM use.
 * Dependencies are passed in: deps = { pinyin, customPinyin, clearCustomDict?, t2s }.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.Lyrics = api;
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const CJK = /\p{Script=Han}/u;
  const TONE_VOWEL = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/;
  const BAD_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
  const SPLIT_PUNCT = /[，,；;]/;
  // Verse number at the start of a line: "1、", "2.", "3)" -> label [Verse N] + the rest as a row.
  const VERSE_NUM = /^(\d{1,2})\s*[、.．)）]\s*(.+)$/;
  // Full-width punctuation in pinyin: ASCII, attached to the previous syllable.
  const PUNCT_MAP = { '，': ',', '。': '.', '！': '!', '？': '?', '；': ';', '：': ':', '、': ',' };

  // Chinese section words -> English names (unbracketed, optional number).
  const CN_LABELS = {
    '主歌': 'Verse',
    '副歌': 'Chorus',
    '前副歌': 'Pre-Chorus',
    '導歌': 'Pre-Chorus',
    '导歌': 'Pre-Chorus',
    '桥段': 'Bridge',
    '橋段': 'Bridge',
    '尾声': 'Ending',
    '尾聲': 'Ending',
    '结尾': 'Ending',
    '結尾': 'Ending',
  };

  // Shorthand names: only accepted inside brackets.
  const SHORTHAND = { V: 'Verse', C: 'Chorus', PC: 'Pre-Chorus', B: 'Bridge' };

  function normalizeLabel(inner) {
    const m = inner.match(/^(.*?)\s*(\d+)$/);
    const base = m ? m[1] : inner;
    const num = m ? m[2] : null;
    let name = CN_LABELS[base];
    if (!name) {
      const key = base.toUpperCase();
      if (Object.prototype.hasOwnProperty.call(SHORTHAND, key)) name = SHORTHAND[key];
    }
    if (!name) return null;
    return num ? `[${name} ${num}]` : `[${name}]`;
  }

  function splitCells(line, autoSplit) {
    let cells = line.split(/\t|\||\s{2,}/).map((c) => c.trim()).filter((c) => c !== '');
    if (cells.length > 1) {
      if (cells.length > 4) {
        cells = cells.slice(0, 3).concat([cells.slice(3).join(' ')]);
      }
      return cells;
    }
    if (autoSplit) {
      const spaces = [];
      for (let i = 0; i < line.length; i++) if (line[i] === ' ') spaces.push(i);
      const mid = line.length / 2;
      if (spaces.length) {
        let best = spaces[0];
        for (const i of spaces) if (Math.abs(i - mid) < Math.abs(best - mid)) best = i;
        const a = line.slice(0, best).trim();
        const b = line.slice(best + 1).trim();
        if (a && b) return [a, b];
      }
      // No spaces: split after the Chinese comma/semicolon nearest the middle (not the last char).
      let best = -1;
      for (let i = 0; i < line.length - 1; i++) {
        if (SPLIT_PUNCT.test(line[i]) && (best < 0 || Math.abs(i + 1 - mid) < Math.abs(best + 1 - mid))) best = i;
      }
      if (best >= 0) {
        const a = line.slice(0, best + 1).trim();
        const b = line.slice(best + 1).trim();
        if (a && b) return [a, b];
      }
    }
    return [line];
  }

  function parse(text, opts) {
    const autoSplit = !(opts && opts.autoSplit === false);
    const items = [];
    const lines = String(text || '').split(/\r?\n/);
    for (const raw of lines) {
      const line = raw.trim();
      if (line === '') {
        const last = items[items.length - 1];
        if (last && last.type === 'row') items.push({ type: 'gap' });
        continue;
      }
      if (!CJK.test(line) && TONE_VOWEL.test(line)) continue; // old pinyin pasted in

      const br = line.match(/^[\[【]\s*(.*?)\s*[\]】]$/);
      if (br && br[1] !== '') {
        const name = normalizeLabel(br[1]);
        items.push({ type: 'label', text: name || `[${br[1]}]` });
        continue;
      }
      const bare = line.match(/^(.*?)\s*(\d+)?$/);
      if (bare && CN_LABELS[bare[1]]) {
        const name = CN_LABELS[bare[1]];
        items.push({ type: 'label', text: bare[2] ? `[${name} ${bare[2]}]` : `[${name}]` });
        continue;
      }
      const vn = line.match(VERSE_NUM);
      if (vn && CJK.test(vn[2])) {
        items.push({ type: 'label', text: `[Verse ${Number(vn[1])}]` });
        items.push({ type: 'row', cells: splitCells(vn[2], autoSplit) });
        continue;
      }
      items.push({ type: 'row', cells: splitCells(line, autoSplit) });
    }
    while (items.length && items[items.length - 1].type === 'gap') items.pop();
    return items;
  }

  function cellPinyin(cell, deps) {
    const s = deps.t2s(cell);
    const out = deps.pinyin(s, { toneType: 'symbol' });
    return String(out)
      .replace(/ *([，。！？；：、]) */g, (m, p) => PUNCT_MAP[p] + ' ')
      .replace(/ +/g, ' ')
      .trim();
  }

  const DEFAULT_DICT = '祢=nǐ\n祂=tā\n降服=xiáng fú';

  function applyDict(dictText, deps) {
    const obj = {};
    for (const raw of String(dictText || '').split(/\r?\n/)) {
      const line = raw.trim();
      if (line === '' || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq <= 0) continue;
      const word = deps.t2s(line.slice(0, eq).trim());
      const pin = line.slice(eq + 1).trim();
      if (word && pin && !BAD_KEYS.has(word) && Object.keys(obj).length < 2000) obj[word] = pin;
    }
    if (deps.clearCustomDict) deps.clearCustomDict('pinyin');
    deps.customPinyin(obj);
    return obj;
  }

  function fitSize(o) {
    const widths = o.colWidths;
    const n = widths.length;
    const sum = widths.reduce((a, b) => a + b, 0);
    const denom = sum + o.gapEm * (n - 1);
    const px = o.contentWidth / denom;
    return Math.min(o.maxPx, Math.max(o.minPx, px));
  }

  function fileName(title, titlePinyin) {
    const base = `${String(title || '').trim()} ${String(titlePinyin || '').trim()}`
      .replace(/[\/\\:*?"<>|\u0000-\u001f\u007f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/^\.+/, '')
      .slice(0, 180)
      .trim();
    return `${base || 'lyrics'}.pdf`;
  }

  return { parse, cellPinyin, applyDict, fitSize, fileName, DEFAULT_DICT };
});
