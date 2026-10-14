import { useEffect, useState } from 'react'

// Add your banner images to public/banners/ using these filenames.
const bannerImages = [
  '/banners/banner-1.jpg',
  '/banners/banner-2.jpg',
  '/banners/banner-3.jpg',
]

export default function PhotoSlideshow() {
  const [availableImages, setAvailableImages] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    Promise.all(
      bannerImages.map((src) => new Promise((resolve) => {
        const image = new Image()
        image.onload = () => resolve(src)
        image.onerror = () => resolve(null)
        image.src = src
      }))
    ).then((results) => {
      if (!cancelled) setAvailableImages(results.filter(Boolean))
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (availableImages.length < 2) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % availableImages.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [availableImages])

  const moveSlide = (direction) => {
    setActiveIndex((current) => (current + direction + availableImages.length) % availableImages.length)
  }

  return (
    <section className="photo-slideshow" aria-label="Utkarsh Ecolectric highlights">
      {availableImages.length > 0 ? (
        <>
          {availableImages.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Utkarsh Ecolectric banner ${index + 1}`}
              className={`slideshow-image ${index === activeIndex ? 'is-active' : ''}`}
              aria-hidden={index !== activeIndex}
            />
          ))}
          {availableImages.length > 1 && (
            <>
              <button className="slideshow-arrow slideshow-arrow-prev" type="button" aria-label="Previous banner" onClick={() => moveSlide(-1)}>‹</button>
              <button className="slideshow-arrow slideshow-arrow-next" type="button" aria-label="Next banner" onClick={() => moveSlide(1)}>›</button>
              <div className="slideshow-dots" aria-label="Choose banner">
                {availableImages.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    className={`slideshow-dot ${index === activeIndex ? 'is-active' : ''}`}
                    aria-label={`Show banner ${index + 1}`}
                    aria-pressed={index === activeIndex}
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="slideshow-placeholder">
          <div className="slideshow-placeholder-copy">
            <p className="slideshow-eyebrow">UTKARSH ECOLECTRIC</p>
            <h1>Ride electric. Ride smarter.</h1>
            <p>Discover your everyday ride.</p>
          </div>
          <div className="slideshow-placeholder-mark" aria-hidden="true">⚡</div>
        </div>
      )}
    </section>
  )
}
