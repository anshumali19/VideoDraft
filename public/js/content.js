/* ==========================================================================
   CONTENT — the only file you need to edit to update the site.
   --------------------------------------------------------------------------
   • Text:   change anything between the quotes.
   • Photos: drop a .jpg into /public/media and add a line to `photos`.
   • Music:  add an `audio: "/media/your-song.mp3"` to a track to play your
             real file. Without it, the built-in generative "patch" plays.
   • Films:  add `embed: "https://player.vimeo.com/video/123456789"` (or a
             YouTube embed URL) to play a real video. Without it, the film
             plays as a cinematic slideshow of its `frames`.
   Save, commit, push — Vercel redeploys automatically.
   ========================================================================== */

window.SITE = {
  name: "Morrow",
  tagline: "Image · Sound · Motion",
  location: "Based somewhere between frames",
  statement: "I make pictures you can hear and music you can see.",
  email: "hello@morrow.studio",
  timezone: "America/New_York",
  socials: [
    { label: "Instagram", url: "https://instagram.com/" },
    { label: "SoundCloud", url: "https://soundcloud.com/" },
    { label: "Vimeo", url: "https://vimeo.com/" },
    { label: "Bandcamp", url: "https://bandcamp.com/" }
  ],

  /* ---------------- PHOTOGRAPHS ---------------- */
  photos: [
    { src: "/media/p01.jpg", title: "Breath of the Pines", place: "Olympic Peninsula", year: "2025" },
    { src: "/media/p05.jpg", title: "Undertow",            place: "Aerial, Atlantic",   year: "2025" },
    { src: "/media/p03.jpg", title: "The Last Tree",       place: "Lake Wānaka",       year: "2024" },
    { src: "/media/p07.jpg", title: "Mira",                place: "Studio, 85mm",      year: "2025" },
    { src: "/media/p06.jpg", title: "Above Everything",    place: "Dolomites",         year: "2024" },
    { src: "/media/p04.jpg", title: "Long Way Home",       place: "Valley of Fire",    year: "2024" },
    { src: "/media/p10.jpg", title: "Drift",               place: "Night, f/1.4",      year: "2025" },
    { src: "/media/p11.jpg", title: "Porthole",            place: "Lisbon",            year: "2023" },
    { src: "/media/p08.jpg", title: "Cold Light",          place: "Alps, 3am",         year: "2024" },
    { src: "/media/p02.jpg", title: "Watcher",             place: "Self, timer",       year: "2025" },
    { src: "/media/p09.jpg", title: "Brick & Leather",     place: "Brooklyn",          year: "2023" },
    { src: "/media/p12.jpg", title: "Golden Grid",         place: "Manhattan",         year: "2024" },
    { src: "/media/p13.jpg", title: "Falling Quietly",     place: "Multnomah",         year: "2023" },
    { src: "/media/p14.jpg", title: "Rush",                place: "5th Avenue",        year: "2024" }
  ],

  /* ---------------- MUSIC ----------------
     patch options: "drift" | "pulse" | "glass" | "night"  (generative)
     or set audio: "/media/track.mp3" to use a real recording.            */
  tracks: [
    { title: "Low Tide Radio", sub: "Single — 2025",          duration: 168, cover: "/media/m01.jpg", patch: "pulse", bpm: 112, key: 0 },
    { title: "Polaroid Weather", sub: "Ambient, from 'Frames'", duration: 196, cover: "/media/m04.jpg", patch: "drift", bpm: 72,  key: 5 },
    { title: "Glass Hours",      sub: "Score — 'Cold Light'",  duration: 152, cover: "/media/m05.jpg", patch: "glass", bpm: 90,  key: 2 },
    { title: "After the Encore", sub: "Live set excerpt",      duration: 210, cover: "/media/m02.jpg", patch: "night", bpm: 124, key: 9 }
  ],

  /* ---------------- FILMS ---------------- */
  films: [
    { title: "Projector Dreams", role: "Director / DP", year: "2025", runtime: "3:12", poster: "/media/v01.jpg",
      frames: ["/media/v01.jpg", "/media/p10.jpg", "/media/p08.jpg", "/media/p03.jpg"], track: 1 },
    { title: "Empty Rows",       role: "Short film",    year: "2025", runtime: "6:40", poster: "/media/v02.jpg",
      frames: ["/media/v02.jpg", "/media/p11.jpg", "/media/p09.jpg", "/media/p14.jpg"], track: 2 },
    { title: "Take Seven",       role: "Music video",   year: "2024", runtime: "2:58", poster: "/media/v03.jpg",
      frames: ["/media/v03.jpg", "/media/p04.jpg", "/media/p06.jpg", "/media/p02.jpg"], track: 0 },
    { title: "Signal Room",      role: "Edit / Colour", year: "2024", runtime: "1:30", poster: "/media/v04.jpg",
      frames: ["/media/v04.jpg", "/media/m03.jpg", "/media/p12.jpg", "/media/p05.jpg"], track: 3 },
    { title: "Lights Out Tour",  role: "Live capture",  year: "2025", runtime: "4:05", poster: "/media/v05.jpg",
      frames: ["/media/v05.jpg", "/media/m01.jpg", "/media/v06.jpg", "/media/m02.jpg"], track: 3 },
    { title: "Crowd Noise",      role: "Documentary",   year: "2023", runtime: "12:20", poster: "/media/v06.jpg",
      frames: ["/media/v06.jpg", "/media/p01.jpg", "/media/p13.jpg", "/media/p07.jpg"], track: 0 }
  ]
};
