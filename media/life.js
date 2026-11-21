/*
 * "Days full of doing": the School Life tiles.
 *
 * HOW TO ADD MEDIA
 *  1. Upload the file into this media/ folder. On github.com: open the media
 *     folder, then Add file → Upload files, and drag it in.
 *  2. Add a `media` line to a tile below (or copy a whole tile to make a new one).
 *
 *  Photo:            media: { type: 'image',   src: 'media/garden.jpg', alt: 'Children planting beans' }
 *  Photo slideshow:  media: { type: 'image',   src: ['media/a.jpg', 'media/b.png'], alt: 'Clay work' }
 *  Video file:       media: { type: 'video',   src: 'media/assembly.mp4', poster: 'media/assembly.jpg' }
 *  Audio / song:     media: { type: 'audio',   src: 'media/class2-song.mp3' }
 *  YouTube:          media: { type: 'youtube', src: 'https://www.youtube.com/watch?v=VIDEO_ID' }
 *
 *  Supported files: .jpg .jpeg .png .webp .gif · .mp4 .webm · .mp3 .m4a .ogg .wav
 *  Keep each file under 25 MB (GitHub's limit for website uploads). Put longer
 *  videos on YouTube and paste the link instead.
 *
 *  Other options for a tile:
 *    wide: true             makes the tile twice as wide
 *    colors: [from, to]     background gradient, shown behind audio or with no media
 *    art: 'trees' | 'paint' | 'music' | 'wood' | 'sport' | 'story'   built-in illustration
 *
 *  Watch the commas: every tile ends with "},", and every line inside a tile ends with ",".
 */
window.LIFE_TILES = [
  {
    title: 'An acre of trees',
    text: 'Our Karen campus is a living playground for the imagination: climbing, building, exploring and resting under the canopy.',
    wide: true,
    colors: ['#12302a', '#2f5d4f'],
    art: 'trees',
  },
  {
    title: 'Watercolour & art',
    text: 'Wet-on-wet painting, drawing and colour as a language of feeling.',
    colors: ['#e98a7a', '#f2b85b'],
    art: 'paint',
  },
  {
    title: 'Music everywhere',
    text: 'Songs from Kindergarten, recorder and flute, then piano, ukulele and guitar.',
    colors: ['#7cc6d6', '#a08be0'],
    art: 'music',
  },
  {
    title: 'Woodwork & clay',
    text: 'Real tools, real materials, real pride in something made by hand.',
    colors: ['#b5835a', '#f2b85b'],
    art: 'wood',
  },
  {
    title: 'Swimming, sports & games',
    text: 'Athletics, football, cricket, rounders and classic Waldorf games for health and joy.',
    colors: ['#2f5d4f', '#9cc5a1'],
    art: 'sport',
  },
  {
    title: 'Stories, drama & poetry',
    text: 'Fairy tales, fables and legends told by heart, then lived through plays, poems and movement. Watch: “A Call for Imaginative Forces.”',
    wide: true,
    colors: ['#a08be0', '#e98a7a'],
    art: 'story',
    media: { type: 'youtube', src: 'https://www.youtube.com/watch?v=wU-oB7eh3ko' },
  },
];
