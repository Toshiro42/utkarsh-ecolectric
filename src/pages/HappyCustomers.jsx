import { useState } from 'react'
import Navbar from '../components/Navbar'

// All 18 customer photos in public/customers/
const customerPhotos = Array.from(
  { length: 18 },
  (_, index) => `/customers/customer-${index + 1}.jpg`
)

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
          {customerPhotos.map((src, index) => (
            <CustomerPhoto
              key={src}
              src={src}
              index={index}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

function CustomerPhoto({ src, index }) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <img
      className="customer-photo"
      src={src}
      alt={`Utkarsh Ecolectric customer delivery ${index + 1}`}
      onError={() => setVisible(false)}
      loading={index < 6 ? 'eager' : 'lazy'}
    />
  )
}