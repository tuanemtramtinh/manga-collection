import type { FC } from 'hono/jsx'
import type { Goods, Book } from '../../types.js'

type Props = {
  book: Book
  goods?: Goods
}

const GoodsModal: FC<Props> = ({ book, goods }) => {
  const isEdit = !!goods
  const title = isEdit ? 'Sửa goods' : 'Thêm goods'

  return (
    <dialog id="modal_goods" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box w-full sm:max-w-sm">
        <h3 class="font-bold text-lg">{title}</h3>
        <p class="text-sm text-base-content/50 mb-4">{book.title}</p>

        <form
          method="post"
          {...{
            'hx-post': isEdit ? `/books/${book.id}/goods/${goods!.id}` : `/books/${book.id}/goods`,
            'hx-swap': 'none',
          }}
          class="flex flex-col gap-3"
          id="form_goods"
        >
          {/* Tên goods */}
          <label class="form-control w-full">
            <div class="label"><span class="label-text">Tên goods *</span></div>
            <input
              type="text"
              name="name"
              class="input input-bordered w-full"
              placeholder="Standee Tanjiro"
              value={goods?.name ?? ''}
              required
            />
          </label>

          {/* Loại goods */}
          <label class="form-control w-full">
            <div class="label"><span class="label-text">Loại</span></div>
            <input
              type="text"
              name="type"
              class="input input-bordered w-full"
              placeholder="poster / standee / artbook / figure..."
              value={goods?.type ?? ''}
            />
          </label>

          {/* Link ảnh */}
          <label class="form-control w-full">
            <div class="label"><span class="label-text">Link ảnh</span></div>
            <input
              type="url"
              name="imageUrl"
              class="input input-bordered w-full"
              placeholder="https://..."
              value={goods?.imageUrl ?? ''}
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
                value={goods?.purchaseDate ?? ''}
              />
            </label>

            <label class="form-control w-full">
              <div class="label"><span class="label-text">Giá (₫)</span></div>
              <input
                type="number"
                name="price"
                class="input input-bordered w-full"
                placeholder="120000"
                min="0"
                value={goods?.price ?? ''}
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
                  'hx-delete': `/books/${book.id}/goods/${goods!.id}`,
                  'hx-confirm': 'Xóa goods này?',
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
            <button class="btn btn-primary" type="submit" form="form_goods">
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

export default GoodsModal
