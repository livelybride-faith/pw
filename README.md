# pw: Chinese lyrics with pinyin

A small web page that turns Chinese praise and worship lyrics into a printable PDF:
each phrase in Chinese, with its pinyin directly underneath, sized as large as the page allows.

Live: https://livelybride-faith.github.io/pw/

## How to use

1. Type the song title (Chinese). The title pinyin fills in by itself; you can edit it.
2. Paste the lyrics. Mark sections with `[Verse]`, `[Chorus]`, `[Bridge]`, `主歌` / `副歌` / `桥段`, or verse numbers like `1、`.
   Spaces and Chinese commas split a line into phrases; each phrase gets its own pinyin.
3. Tap any pinyin to correct it. Add words you always want read a certain way under **Settings → My words** (e.g. `祢=nǐ`).
4. Click **Save PDF**.

## Privacy

Everything runs in your browser. Lyrics are not uploaded, stored or sent anywhere, and are gone when you close or reload the page.
Only your settings and "My words" list are kept, in your own browser's storage.
The page downloads its libraries (jsDelivr, cdnjs) and fonts (Google Fonts) when it opens, so those services see a normal page request.

## Song lyrics and copyright

This software does not include, look up or distribute any song lyrics. You supply the text.
Most worship songs are copyrighted. You are responsible for having the right to copy, print or display the lyrics you use
(for example through your church's CCLI or similar license, or the copyright holder's permission).

## No warranty

The pinyin is generated automatically from dictionaries and can be wrong, especially for characters with more than one reading.
Check it before use. The software is provided "as is", without warranty of any kind; see [LICENSE](LICENSE).

## License

MIT, see [LICENSE](LICENSE). Third-party libraries and fonts keep their own licenses; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
