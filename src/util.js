import isEmpty from 'lodash/isEmpty'

export const downloadJSON = (data, filename = 'preview-metadata.json') => {
  if (isEmpty(data)) {
    return alert('no data to download')
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
