# Morrow — Image · Sound · Motion

A portfolio for a photographer / musician / filmmaker. Plain HTML, CSS and JavaScript:
no framework, no build step. It's hosted on Vercel.

## What's inside

| Section | What it does |
| --- | --- |
| **Hero** | The photo is rendered in WebGL so it moves like liquid. It ripples under the cursor and splits its colour channels when you move fast. |
| **Statement** | A single line whose words light up as you scroll. |
| **01 Image** | A gallery that scrolls sideways (native swipe on phones), with a fullscreen viewer: arrow keys, swipe, Esc. |
| **02 Sound** | A music player with a live radial visualizer and a track list. Space bar plays or pauses. |
| **03 Motion** | Film cards. Hover and move the cursor to scrub through frames; click to open a 2.39:1 cinema mode with a timecode. |
| **04 Contact** | A large scrolling "Say hello" banner, email, social links and local time. |

## How to edit it yourself

**Everything lives in one file: `public/js/content.js`.** You never need to open the other files.

### Change text
Edit the words between the quotes: `name`, `tagline`, `statement`, `email`, `socials`.

### Add a photo
1. Export a JPG about 1600px on the long side and put it in `public/media/`.
2. In `content.js`, add a line to `photos`:
   ```js
   { src: "/media/my-photo.jpg", title: "Title", place: "Where", year: "2026" },
   ```
   Lines higher in the list show first. Delete a line to remove a photo.

### Add your music
Put an MP3 in `public/media/`, then add `audio` to the track:
```js
{ title: "My Song", sub: "Single — 2026", duration: 200, cover: "/media/cover.jpg", audio: "/media/my-song.mp3" },
```
A track without `audio` plays a built-in generative placeholder.

### Add a real video
Add `embed` with a Vimeo or YouTube embed URL:
```js
{ title: "My Film", role: "Director", year: "2026", runtime: "3:20", poster: "/media/still.jpg",
  frames: ["/media/still.jpg"], embed: "https://player.vimeo.com/video/123456789" },
```
`frames` are the stills shown when you hover over the card.

### Publish
Commit and push to GitHub. Vercel redeploys on its own in about 20 seconds.
To preview on your own computer first, run `npx serve public` and open the address it prints.

---
Placeholder photography is from [Unsplash](https://unsplash.com/license) (free to use) and was colour-graded for this demo.
Replace it with your own work before launch.
