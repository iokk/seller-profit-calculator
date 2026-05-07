import html2canvas from 'html2canvas'

export function useScreenshot() {
  async function capture(element: HTMLElement) {
    return html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true
    })
  }

  async function downloadElementAsImage(element: HTMLElement, filename = 'price-explanation.png') {
    const canvas = await capture(element)
    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  async function copyElementAsImage(element: HTMLElement) {
    const canvas = await capture(element)
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))

    if (!blob || !navigator.clipboard || typeof ClipboardItem === 'undefined') {
      throw new Error('当前浏览器不支持复制图片，请使用下载截图。')
    }

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob
      })
    ])
  }

  return {
    downloadElementAsImage,
    copyElementAsImage
  }
}
