;(function() {
  function initImageViewers() {
    if (typeof Viewer === 'undefined') return

    document.querySelectorAll('[data-viewer-image="true"]').forEach(image => {
      if (image.dataset.viewerInitialized === 'true') return
      image.dataset.viewerInitialized = 'true'

      new Viewer(image, {
        button: true,
        navbar: false,
        title: true,
        tooltip: true,
        movable: true,
        zoomable: true,
        rotatable: true,
        scalable: true,
      })
    })
  }

  initImageViewers()
  document.addEventListener('DOMContentLoaded', initImageViewers)
})()
