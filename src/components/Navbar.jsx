import { Link } from 'react-router-dom'
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
  const classes = 'site-nav-link whitespace-nowrap'

  if (item.external) {
    return (
      <a
        className={classes}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {item.label}
      </a>
    )
  }

  return (
    <Link className={classes} to={item.href}>
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