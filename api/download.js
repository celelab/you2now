const { config } = require('dotenv')
const morgan = require('morgan')
const cors = require('cors')
const app = require('express')()
const ytdl = require('ytdl-core')
const bytes = require('bytes')

config()
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const mapVideoFromYoutubeToUser = ({
  bitrate,
  qualityLabel: resolution,
  url,
  mimeType
}) => {
  const format = mimeType.split('/')[0]
  const size = bytes(bitrate)
  const extname = format === 'video' ? 'mp4' : 'mp3'
  return { mimeType, size, resolution, url, format, extname }
}

app.get('/download', async (req, res) => {
  try {
    const { url } = req.query
    const videoID = await ytdl.getURLVideoID(url)
    const metInfo = await ytdl.getInfo(url)
    const formats = metInfo.formats
      .filter(({ container: format }) => format === 'mp4')
      .map(mapVideoFromYoutubeToUser)
      .sort((a, b) => a.resolution - b.resolution)

    const { title } = metInfo.videoDetails

    const video = {
      url: `https://youtube.com/embed/${videoID}`,
      screenshot: `https://img.youtube.com/vi/${videoID}/0.jpg`,
      title,
      formats
    }

    return res.status(201).json(video)
  } catch (error) {
    console.error(error)
    res.status(500).send({ error })
  }
})

module.exports = app
