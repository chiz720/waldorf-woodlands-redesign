# Waldorf Woodlands: concept redesign

An independent concept redesign of the website for [Waldorf Woodlands School](https://waldorfwoodlands.co.ke/), a Waldorf kindergarten and primary school in Karen, Nairobi. It isn't affiliated with or endorsed by the school. All content comes from the school's public website.

**Live:** https://chiz720.github.io/waldorf-woodlands-redesign/

## Design idea

*Rooted in nature, ready for the future.* The design pairs Waldorf's warm, watercolour feel (soft serif type, a palette of forest, sage, rose and gold) with futuristic touches: an animated aurora, fireflies that move away from the cursor, glass panels and scroll-in animations.

## Sections

- **Hero:** a headline, the key facts (18 months to Class 7, an acre of trees, 115 years of combined Waldorf teaching, founded 2017)
- **Philosophy:** an interactive Head · Heart · Hand diagram and the school's mission
- **The Journey:** Kindergarten, then Classes 1–3, then Classes 4–7, with curriculum and trips
- **Future-ready:** the school's five values (imagination, reason, curiosity, compassion, creativity)
- **School Life:** activity tiles that can show photos, slideshows, videos, audio or YouTube (see below)
- **Teachers:** the five teachers named on the current site
- **Admissions:** a **class finder** that uses the school's 1 Sept – 31 Aug birth-date cut-offs to show which class a child would join, plus a link to the fee structure
- **Practical information:** school day, ages and class sizes, fees, meals, transport, after school, term dates, safety and registration
- **FAQ:** eight common parent questions (after Class 7, national curriculum, reading, assessment, screens, joining, visiting, getting involved)
- **Visit:** contact details, a map, an email link for booking a visit, and the donation link

The visuals are illustrated on purpose. No photos of the children were copied from the school's site. If the school adopts the design, swap in its own photos and remove the concept bar and the `noindex` tag.

## Placeholders for the school to fill in

The Practical information and FAQ sections mark anything the public site doesn't state as **To confirm**. In `index.html` these are `<mark class="tbc">…</mark>`, so search the file for `class="tbc"` to find every one, and replace the whole `<mark>` with the real answer. FAQ text that describes general Waldorf practice is worded as such ("In Waldorf schools…"). The school should check it matches what it actually does.

## Adding photos, video, audio and YouTube to "Days full of doing"

The tiles are listed in `media/life.js`, and the instructions are at the top of that file. You can do all of this on github.com:

1. **Upload the file:** open the `media` folder, click **Add file → Upload files**, and drag in the photo, video or audio file.
2. **Point a tile at it:** open `media/life.js`, click the ✏️ pencil, add a `media` line to a tile, then click **Commit changes**. The site updates within about a minute.

| Kind | Example line | Files |
|---|---|---|
| Photo | `media: { type: 'image', src: 'media/garden.jpg', alt: 'Planting beans' },` | .jpg .png .webp .gif |
| Slideshow | `media: { type: 'image', src: ['media/a.jpg', 'media/b.jpg'] },` | as above |
| Video | `media: { type: 'video', src: 'media/play.mp4', poster: 'media/play.jpg' },` | .mp4 .webm |
| Audio | `media: { type: 'audio', src: 'media/song.mp3' },` | .mp3 .m4a .ogg .wav |
| YouTube | `media: { type: 'youtube', src: 'https://youtu.be/VIDEO_ID' },` | any YouTube link |

- Photos and videos fill the tile. Clicking opens a full-screen viewer. Videos play silently in the tile and with sound in the viewer.
- Audio plays straight from the tile, with a progress bar.
- If a file is missing or misspelt, the tile quietly falls back to its illustration.
- Keep each file under **25 MB**, which is GitHub's limit for uploads on the website. Put longer videos on YouTube.
- Only upload photos and recordings of children with their parents' consent.

**Sample photos:** the tiles currently use public-domain (CC0) placeholder photos in `media/photos/`, each marked with a "Sample photo" tag. Sources are listed in `media/photos/CREDITS.md`. To replace one, upload the school's photo, change the `src`, and delete `sample: true`.

## Tech

Plain HTML, CSS and JavaScript with no build step. Deploy by pushing to GitHub with Pages turned on.
