import type { FC } from 'hono/jsx'
import { SPINE_COLORS, STATUS_LABELS } from '../../types.js'
import type { Book } from '../../types.js'
import ImageUpload from '../ImageUpload.js'

type Props = {
  book?: Book // undefined = add mode, defined = edit mode
}

const BookModal: FC<Props> = ({ book }) => {
  const isEdit = !!book
  const title = isEdit ? 'Sửa bộ truyện' : 'Thêm bộ truyện'

  return (
    <dialog id="modal_book" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box w-full sm:max-w-md">
        <h3 class="font-bold text-lg mb-4">{title}</h3>

        {/* Quick search — only show on add mode */}
        {!isEdit && (
          <div class="mb-5 relative mt-1">
            <label class="form-control w-full">
              <div class="label">
                <span class="label-text">Tìm nhanh</span>
                <span class="label-text-alt text-base-content/40">Nên tìm bằng tên tiếng Anh hoặc Nhật</span>
              </div>
              <input
                type="search"
                id="book-search-input"
                placeholder="Tìm nhanh tên manga..."
                class="input input-bordered w-full mt-1"
                autocomplete="off"
              />
            </label>
            <div id="book-search-results" class="absolute left-0 right-0 z-50 flex flex-col overflow-y-auto rounded-lg border border-base-200 bg-base-100 shadow-lg" style="max-height:220px;display:none;top:calc(100% + 6px);"></div>
          </div>
        )}

        <form
          method="post"
          action={isEdit ? `/books/${book!.id}` : '/books'}
          class="flex flex-col gap-3"
          id="form_book"
        >
          {/* Ảnh bìa */}
          <ImageUpload name="coverUrl" folder="books" currentUrl={book?.coverUrl} label="Ảnh bìa" />

          {/* Tên truyện */}
          <label class="form-control w-full">
            <div class="label"><span class="label-text">Tên truyện *</span></div>
            <input
              type="text"
              name="title"
              class="input input-bordered w-full"
              placeholder="Nhập tên bộ truyện"
              value={book?.title ?? ''}
              required
            />
          </label>

          {/* Tác giả */}
          <label class="form-control w-full">
            <div class="label"><span class="label-text">Tác giả</span></div>
            <input
              type="text"
              name="author"
              class="input input-bordered w-full"
              placeholder="Tên tác giả"
              value={book?.author ?? ''}
            />
          </label>

          {/* Số tập + Trạng thái */}
          <div class="grid grid-cols-2 gap-3">
            <label class="form-control w-full">
              <div class="label"><span class="label-text">Tổng số tập</span></div>
              <input
                type="number"
                name="totalVolumes"
                class="input input-bordered w-full"
                placeholder="0"
                min="0"
                value={book?.totalVolumes ?? ''}
              />
            </label>

            <label class="form-control w-full">
              <div class="label"><span class="label-text">Trạng thái</span></div>
              <select name="status" class="select select-bordered w-full">
                {(Object.entries(STATUS_LABELS) as [keyof typeof STATUS_LABELS, string][]).map(([value, label]) => (
                  <option value={value} selected={book?.status === value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Màu gáy sách */}
          <div class="form-control">
            <div class="label"><span class="label-text">Màu gáy sách</span></div>
            <div class="flex gap-2 flex-wrap" id="color_swatches">
              {SPINE_COLORS.map(color => (
                <label class="cursor-pointer" title={color.name}>
                  <input
                    type="radio"
                    name="color"
                    value={color.value}
                    class="sr-only"
                    checked={book?.color === color.value || (!book && color.value === '#2563eb')}
                  />
                  <div
                    class="w-7 h-7 rounded-full border-2 transition-all"
                    style={`background-color:${color.value};border-color:${(book?.color === color.value || (!book && color.value === '#2563eb')) ? 'white' : 'transparent'};box-shadow:${(book?.color === color.value || (!book && color.value === '#2563eb')) ? '0 0 0 2px ' + color.value : 'none'};`}
                    data-swatch={color.value}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Ghi chú — chỉ hiện khi edit */}
          {isEdit && (
            <label class="form-control w-full">
              <div class="label"><span class="label-text">Ghi chú</span></div>
              <textarea
                name="notes"
                class="textarea textarea-bordered w-full"
                placeholder="Ghi chú thêm..."
                rows={2}
              >
                {book?.notes ?? ''}
              </textarea>
            </label>
          )}
        </form>

        {/* Actions */}
        <div class="flex items-center justify-between mt-5">
          <div>
            {isEdit && (
              <button
                class="btn btn-outline btn-error btn-sm"
                data-delete-url={`/books/${book!.id}`}
                data-delete-confirm="Xóa bộ truyện này?"
                data-delete-redirect="/"
              >Xóa</button>
            )}
          </div>

          <div class="flex gap-2">
            <form method="dialog">
              <button class="btn btn-ghost">Hủy</button>
            </form>
            <button class="btn btn-primary" type="submit" form="form_book">
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

export default BookModal
