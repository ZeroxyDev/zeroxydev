import { promises as fs } from 'fs'
import fetch from 'node-fetch'
/* import Parser from 'rss-parser' */
// import { ApiClient } from 'twitch'
// import { ClientCredentialsAuthProvider } from 'twitch-auth'

import { PLACEHOLDERS, NUMBER_OF } from './constants.js'

const YOUTUBE_ZEROXYDEV_CHANNEL_PLAYLIST_ID = 'PLZdYOwl1NMadBy2JAW_X57ev7J2rAlo3F'

const {
/*   INSTAGRAM_API_KEY, */
  // TWITCH_API_CLIENT_KEY,
  // TWITCH_API_SECRET_KEY,
  YOUTUBE_API_KEY
} = process.env

/* const INSTAGRAM_USER_ID = '' */

// const authProvider = new ClientCredentialsAuthProvider(TWITCH_API_CLIENT_KEY, TWITCH_API_SECRET_KEY)
// const apiClient = new ApiClient({ authProvider })

/* const parser = new Parser() */

// const getLatestTwitchStream = async () => {
//   const response = await apiClient.kraken.channels.getChannel('zeroxydev')
//   console.log(response)
// }

/* const getPhotosFromInstagram = async () => {
  const response = await fetch(`https://instagram130.p.rapidapi.com/account-medias?userid=${INSTAGRAM_USER_ID}&first=20`, {
    headers: {
      'x-rapidapi-host': 'instagram130.p.rapidapi.com',
      'x-rapidapi-key': INSTAGRAM_API_KEY
    }
  })

  const json = await response.json()

  return json?.edges
} */

const YOUTUBE_API_KEY2 = 'AIzaSyB_Z5D1i3DvNzx-_C9Cny4OgjzYo1CtN48'
const getLatestYoutubeVideos = ({ playListId } = { playListId: YOUTUBE_ZEROXYDEV_CHANNEL_PLAYLIST_ID }) =>
  fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playListId}&maxResults=${NUMBER_OF.VIDEOS}&key=${YOUTUBE_API_KEY2}`
  )
    .then((res) => res.json())
    .then((videos) => videos.items)

/* const generateInstagramHTML = ({ node: { display_url: url, shortcode } }) => `
<a href='https://instagram.com/p/${shortcode}' target='_blank'>
  <img width='20%' src='${url}' alt='Instagram photo' />
</a>` */

const generateYoutubeHTML = ({ title, videoId }) => `
<a href='https://youtu.be/${videoId}' target='_blank'>
  <img width='30%' src='https://img.youtube.com/vi/${videoId}/mqdefault.jpg' alt='${title}' />
</a>`;

(async () => {
  // await getLatestTwitchStream()

  const [template, videos] = await Promise.all([
    fs.readFile('./src/README.md.tpl', { encoding: 'utf-8' }),
    getLatestYoutubeVideos()
  ])


/*   // create latest articles markdown
  const latestArticlesMarkdown = articles
    .slice(0, NUMBER_OF.ARTICLES)
    .map(({ title, link }) => `- [${title}](${link})`)
    .join('\n') */

  // create latest youtube videos channel
  const latestYoutubeVideos = videos
    .map(({ snippet }) => {
      const { title, resourceId } = snippet
      const { videoId } = resourceId
      return generateYoutubeHTML({ videoId, title })
    })
    .join('')

/*   // create latest youtube videos secondary channel
  const latestYoutubeSecondaryChannelVideos = secondaryChannelVideos
    .map(({ snippet }) => {
      const { title, resourceId } = snippet
      const { videoId } = resourceId
      return generateYoutubeHTML({ videoId, title })
    })
    .join('') */

/*   // create latest photos from instagram
  const latestInstagramPhotos = photos
    .slice(0, NUMBER_OF.PHOTOS)
    .map(generateInstagramHTML)
    .join('') */

  // replace all placeholders with info
  const newMarkdown = template
    .replace(PLACEHOLDERS.LATEST_YOUTUBE, latestYoutubeVideos)
/*     .replace(PLACEHOLDERS.LATEST_INSTAGRAM, latestInstagramPhotos) */

  await fs.writeFile('README.md', newMarkdown)
})()
