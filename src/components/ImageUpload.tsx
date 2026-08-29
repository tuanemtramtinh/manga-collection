import type { FC } from 'hono/jsx'
import Icon from './Icon.js'

type Props = {
  name: string
  folder: 'books' | 'volumes' | 'goods' | 'sections'
  currentUrl?: string | null
  label?: string
}

const ImageUpload: FC<Props> = ({ name, folder, currentUrl, label = 'Ảnh' }) => {
  const inputId   = `file_${name}`
  const previewId = `preview_${name}`
  const urlId     = `url_${name}`

  return (
    <div class="form-control w-full">
      {/* Label — Chọn ảnh: justify-between */}
      <div class="flex items-center justify-between">
        <span class="label-text">{label}</span>
        <label class="btn btn-outline btn-sm gap-2 cursor-pointer">
          <Icon name="Upload" size={14} />
          Chọn ảnh
          <input
            type="file"
            id={inputId}
            accept="image/jpeg,image/png,image/webp,image/gif"
            class="hidden"
          />
        </label>
      </div>


      {/* Preview — hiện bên dưới khi có ảnh */}
      <div
        id={previewId}
        class={`mt-2 rounded-lg overflow-hidden border border-base-200 bg-base-200 ${currentUrl ? '' : 'hidden'}`}
        style="width:80px;aspect-ratio:2/3;"
      >
        <img
          id={`img_${name}`}
          src={currentUrl ?? ''}
          alt="preview"
          class="w-full h-full object-cover"
        />
      </div>

      {/* Dán link thủ công — margin top tách biệt */}
      <div class="collapse collapse-arrow border border-base-200 rounded-lg mt-3">
        <input type="checkbox" class="peer" />
        <div class="collapse-title text-xs text-base-content/40 py-2 min-h-0">
          Hoặc dán link ảnh thủ công
        </div>
        <div class="collapse-content px-3 pb-3">
          <input
            type="url"
            class="input input-bordered input-sm w-full"
            placeholder="https://..."
            data-url-fallback={urlId}
          />
        </div>
      </div>

      {/* Hidden input — giá trị submit cùng form */}
      <input type="hidden" id={urlId} name={name} value={currentUrl ?? ''} />

      <script dangerouslySetInnerHTML={{ __html: `
        ;(function() {
          const root      = document.currentScript ? document.currentScript.parentElement : document
          const fileInput  = root.querySelector('#${inputId}')
          const urlInput   = root.querySelector('#${urlId}')
          const preview    = root.querySelector('#${previewId}')
          const previewImg = root.querySelector('#img_${name}')
          const fallback   = root.querySelector('[data-url-fallback="${urlId}"]')

          function showPreview(url) {
            previewImg.src = url
            preview.classList.remove('hidden')
          }

          function resizeImage(file, maxPx) {
            return new Promise(function(resolve) {
              const img = new Image()
              img.onload = function() {
                const scale = Math.min(1, maxPx / Math.max(img.width, img.height))
                const canvas = document.createElement('canvas')
                canvas.width  = Math.round(img.width  * scale)
                canvas.height = Math.round(img.height * scale)
                canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
                canvas.toBlob(function(blob) { resolve(blob) }, file.type, 0.85)
              }
              img.src = URL.createObjectURL(file)
            })
          }

          fileInput.addEventListener('change', async () => {
            const file = fileInput.files[0]
            if (!file) return

            const resized = await resizeImage(file, 1000)
            const fd = new FormData()
            fd.append('file', new File([resized], file.name, { type: file.type }))

            try {
              const res  = await fetch('/upload/${folder}', { method: 'POST', body: fd })
              const data = await res.json()
              if (!res.ok) throw new Error(data.error || 'Upload thất bại')
              urlInput.value = data.url
              showPreview(data.url)
            } catch (err) {
              alert(err.message)
            }
          })

          if (fallback) {
            fallback.addEventListener('input', () => {
              const url = fallback.value.trim()
              urlInput.value = url
              if (url) showPreview(url)
            })
          }
        })()
      ` }} />
    </div>
  )
}

export default ImageUpload
