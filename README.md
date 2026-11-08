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

## YouTube link (optional)

- **Search:** type search words (the title is filled in for you) and click **Find on YouTube**. You see the top 3 videos,
  with **Preview ↗** (opens the video on YouTube) and **Use this** (sets it as the link). **Show 3 more** shows the next 3.
- **Or paste a link** into **YouTube link**: `youtube.com/watch?v=…`, `youtu.be/…`, `/shorts/…`, `/embed/…` and `/live/…` all work.
  Use ✕ to remove it.
- With a link set, every printed page has a QR code and the link at the bottom, and the title in the PDF is clickable.

Without an API key, **Find on YouTube** opens YouTube's own search in a new tab; copy a video link from there and paste it.

### Get a free API key (optional, for search on this page)

1. Open the Google Cloud Console and create a project.
2. Enable **YouTube Data API v3** for it.
3. Go to **Credentials → Create credentials → API key**.
4. Restrict the key: Application restriction **Websites**, with `https://livelybride-faith.github.io/*`;
   API restriction **YouTube Data API v3**.
5. Paste the key into **Settings → YouTube API key** on each device. It is saved only in that browser.

The free quota is about 100 searches a day. Each search and each **Show 3 more** counts as one.

Search results come from YouTube API Services. By using search you agree to the
[YouTube Terms of Service](https://www.youtube.com/t/terms) and the [Google Privacy Policy](https://policies.google.com/privacy).
For a search, the search words and the key go to Google's API; the link and the QR code stay in your browser.
Prefer official uploads (artist, label or church channels). The page only links to videos; it never downloads them.

## Privacy

Everything runs in your browser. Lyrics are not uploaded, stored or sent anywhere, and are gone when you close or reload the page.
The only exception is the optional YouTube search: its search words and your API key go to Google (see above).
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
