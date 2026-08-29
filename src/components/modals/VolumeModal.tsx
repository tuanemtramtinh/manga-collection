import type { FC } from 'hono/jsx'
import type { Volume, Book } from '../../types.js'

type Props = {
  book: Book
  volume?: Volume
}

const VolumeModal: FC<Props> = ({ book, volume }) => {
  const isEdit = !!volume
  const title = isEdit ? 'Sửa tập truyện' : 'Thêm tập truyện'

  return (
    <dialog id="modal_volume" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box w-full sm:max-w-sm">
        <h3 class="font-bold text-lg">{title}</h3>
        <p class="text-sm text-base-content/50 mb-4">{book.title}</p>

        <form
          method="post"
          {...{
            'hx-post': isEdit ? `/books/${book.id}/volumes/${volume!.id}` : `/books/${book.id}/volumes`,
            'hx-swap': 'none',
          }}
          class="flex flex-col gap-3"
          id="form_volume"
        >
          {/* Số tập */}
          <label class="form-control w-full">
            <div class="label"><span class="label-text">Số tập *</span></div>
            <input
              type="number"
              name="volumeNumber"
              class="input input-bordered w-full"
              placeholder="1"
              min="1"
              value={volume?.volumeNumber ?? ''}
              required
            />
          </label>

          {/* Link ảnh bìa */}
          <label class="form-control w-full">
            <div class="label"><span class="label-text">Link ảnh bìa</span></div>
            <input
              type="url"
              name="coverUrl"
              class="input input-bordered w-full"
              placeholder="https://..."
              value={volume?.coverUrl ?? ''}
            />
            <div class="label">
              <span class="label-text-alt text-base-content/40">
                Không upload được ảnh trực tiếp — dán link từ web
              </span>
            </div>
          </label>

          {/* Ngày mua + Giá */}
          <div class="grid grid-cols-2 gap-3">
            <label class="form-control w-full">
              <div class="label"><span class="label-text">Ngày mua</span></div>
              <input
                type="date"
                name="purchaseDate"
                class="input input-bordered w-full"
                value={volume?.purchaseDate ?? ''}
              />
            </label>

            <label class="form-control w-full">
              <div class="label"><span class="label-text">Giá (₫)</span></div>
              <input
                type="number"
                name="price"
                class="input input-bordered w-full"
                placeholder="35000"
                min="0"
                value={volume?.price ?? ''}
              />
            </label>
          </div>
        </form>

        <div class="flex items-center justify-between mt-5">
          <div>
            {isEdit && (
              <button
                class="btn btn-outline btn-error btn-sm"
                {...{
                  'hx-delete': `/books/${book.id}/volumes/${volume!.id}`,
                  'hx-confirm': 'Xóa tập này?',
                  'hx-swap': 'none',
                }}
              >
                Xóa
              </button>
            )}
          </div>
          <div class="flex gap-2">
            <form method="dialog">
              <button class="btn btn-ghost">Hủy</button>
            </form>
            <button class="btn btn-primary" type="submit" form="form_volume">
              {isEdit ? 'Lưu' : 'Thêm'}
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}

export default VolumeModal
