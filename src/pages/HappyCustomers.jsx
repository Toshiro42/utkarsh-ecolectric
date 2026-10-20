import { useState } from 'react'
import Navbar from '../components/Navbar'

const customerPhotos = Array.from(
  { length: 102 },
  (_, index) => index + 1
)

const extensions = [
  'jpg',
  'jpeg',
  'png',
  'webp',
  'JPG',
  'JPEG',
  'PNG',
  'WEBP',
]

export default function HappyCustomers() {
  return (
    <div className="min-h-screen bg-wool text-ink">
      <Navbar />

      <main className="happy-customers-page">
        <p className="happy-customers-eyebrow">
          OUR COMMUNITY
        </p>

        <h1>Happy Customers</h1>

        <p className="happy-customers-intro">
          Every delivery marks the beginning of a new journey.
          Thank you for riding with Utkarsh Ecolectric.
        </p>

        <div className="customer-photo-grid">
          {customerPhotos.map((number, index) => (
            <CustomerPhoto
              key={number}
              number={number}
              index={index}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

function CustomerPhoto({ number, index }) {
  const [extensionIndex, setExtensionIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  const src = `/customers/customer-${number}.${extensions[extensionIndex]}`

  return (
    <img
      className="customer-photo"
      src={src}
      alt={`Utkarsh Ecolectric customer delivery ${number}`}
      loading={index < 6 ? 'eager' : 'lazy'}
      onError={() => {
        if (extensionIndex < extensions.length - 1) {
          setExtensionIndex((current) => current + 1)
        } else {
          setVisible(false)
        }
      }}
    />
  )
}