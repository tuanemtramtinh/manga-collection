import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import Icon from './Icon.js';
const ImageUpload = ({ name, folder, currentUrl, label = 'Ảnh' }) => {
    const inputId = `file_${name}`;
    const previewId = `preview_${name}`;
    const urlId = `url_${name}`;
    return (_jsxs("div", { class: "form-control w-full", children: [_jsxs("div", { class: "flex items-center justify-between", children: [_jsx("span", { class: "label-text", children: label }), _jsxs("label", { class: "btn btn-outline btn-sm gap-2 cursor-pointer", children: [_jsx(Icon, { name: "Upload", size: 14 }), "Ch\u1ECDn \u1EA3nh", _jsx("input", { type: "file", id: inputId, accept: "image/jpeg,image/png,image/webp,image/gif", class: "hidden" })] })] }), _jsx("div", { id: previewId, class: `mt-2 rounded-lg overflow-hidden border border-base-200 bg-base-200 ${currentUrl ? '' : 'hidden'}`, style: "width:80px;aspect-ratio:2/3;", children: _jsx("img", { id: `img_${name}`, src: currentUrl ?? '', alt: "preview", class: "w-full h-full object-cover" }) }), _jsxs("div", { class: "collapse collapse-arrow border border-base-200 rounded-lg mt-3", children: [_jsx("input", { type: "checkbox", class: "peer" }), _jsx("div", { class: "collapse-title text-xs text-base-content/40 py-2 min-h-0", children: "Ho\u1EB7c d\u00E1n link \u1EA3nh th\u1EE7 c\u00F4ng" }), _jsx("div", { class: "collapse-content px-3 pb-3", children: _jsx("input", { type: "url", class: "input input-bordered input-sm w-full", placeholder: "https://...", "data-url-fallback": urlId }) })] }), _jsx("input", { type: "hidden", id: urlId, name: name, value: currentUrl ?? '' }), _jsx("script", { dangerouslySetInnerHTML: { __html: `
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
      ` } })] }));
};
export default ImageUpload;
