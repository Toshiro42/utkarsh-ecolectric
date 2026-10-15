import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import logo from '../assets/main logo.png'

const links = [
  { label: 'Home', href: '/' },
  {
    label: 'Location',
    href: 'https://maps.app.goo.gl/DRdkmwQ4G3aa3tjG7',
    external: true,
  },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Happy Customers', href: '/happy-customers' },
]

function NavLink({ item }) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!active) return

    const timer = setTimeout(() => setActive(false), 2000)
    return () => clearTimeout(timer)
  }, [active])

  const classes = `site-nav-link whitespace-nowrap ${active ? 'tap-active' : ''}`

  const handleTap = () => setActive(true)

  if (item.external) {
    return (
      <a
        className={classes}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleTap}
      >
        {item.label}
      </a>
    )
  }

  return (
    <Link
      className={classes}
      to={item.href}
      onClick={handleTap}
    >
      {item.label}
    </Link>
  )
}

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-brand" aria-label="Utkarsh Ecolectric home">
          <img src={logo} alt="Utkarsh Ecolectric" className="site-brand-logo" />
        </Link>

        <nav className="site-navigation" aria-label="Main navigation">
          {links.map((item) => (
            <NavLink key={item.label} item={item} />
          ))}
        </nav>
      </div>
    </header>
  )
}