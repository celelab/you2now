import ytdl from 'ytdl-core'
import bytes from 'bytes'

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

export default async function Handler(request, respose) {
  try {
    const { url } = request.query
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

    return respose.status(201).json(video)
  } catch (error) {
    console.error(error)
    return respose.status(500).json({ error })
  }
}
