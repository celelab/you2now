let videoTitle = ''
const [form, input, title, screenshot, route, table, details] = [
  document.getElementById('form'),
  document.getElementById('input-url'),
  document.getElementById('title'),
  document.getElementById('screenshot'),
  document.getElementById('video-link'),
  document.getElementById('table'),
  document.getElementById('details'),
]

const mapCampsFromFormatsOfVideo = ({ url, ...props }) => {
  const [container, button, format, resolution, size, buttonContainer] = [
    document.createElement('tr'),
    document.createElement('a'),
    document.createElement('th'),
    document.createElement('th'),
    document.createElement('th'),
    document.createElement('th'),
  ]

  // Created elements for format details
  button.className = 'btn btn-success'
  const data = JSON.stringify(url)
  button.setAttribute(
    'href',
    `data:${mimeType};charset=utf-8,${encodeURIComponent(data)}`
  )
  button.setAttribute('download', `[you2now] - ${videoTitle}.${props.extname}`)
  button.textContent = 'Descargar'
  button.target = '_blank'
  buttonContainer.append(button)

  format.textContent = props.format
  format.scope = 'row'

  resolution.textContent = props.resolution || ''

  size.textContent = props.size

  // Added elements in container
  ;[format, resolution, size, buttonContainer].forEach((elements) =>
    container.append(elements)
  )

  return container
}

async function videoConvert(e) {
  e?.preventDefault()
  const { value: url } = input
  if (url.length === 0) return Swal.fire('Debe insertar una URL')
  // Cleading view
  const alertConvert = Swal.fire({
    title: 'Procesando video',
    html: 'Espere mientras se convierte el video..',
    showCloseButton: false,
    showCancelButton: false,
    showConfirmButton: false,
  })
  details.classList.add('d-none') // hiden format and details of video
  table.childNodes.forEach((child) => table.removeChild(child)) // Clear format of video

  try {
    // Get video
    const response = await fetch(`/api/download?url=${url}`)
    const video = await response.json()

    // added meta info
    screenshot.src = video.screenshot
    title.textContent = video.title
    route.href = video.url
    videoTitle = video.title

    // formats
    const camps = video.formats.map(mapCampsFromFormatsOfVideo)
    camps.forEach((elements) => table.append(elements))

    // Show format and details of video
    details.classList.remove('d-none')

    // Close loading modal
    alertConvert.close()
  } catch (error) {
    console.error(error)
    Swal.fire(
      'Oops!',
      'Parece que no tienes una buena connexion a internet.\nIntentelo nuevamente mas tarde.',
      'error'
    )
  }
}

form.addEventListener('submit', videoConvert)
input.addEventListener('change', videoConvert)
