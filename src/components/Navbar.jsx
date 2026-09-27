import { useState } from 'react'
import logo from '../assets/main logo.png'

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER

    const links = [
        { label: 'Home', href: '/' },
        { label: 'Location', href: 'https://maps.app.goo.gl/DRdkmwQ4G3aa3tjG7' },
        { label: 'Contact Us', href: '/contact' },
    ]

    return (
        <>
            <header className="sticky top-0 z-50 bg-wool border-b border-thread">
                <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
                    <span className="site-logo-wrapper">
                        <img src={logo} alt="Utkarsh Ecolectric" className="site-logo" />
                        <span className="site-wordmark font-display text-lg font-bold text-ink tracking-wide">
                            UTKARSH <span className="text-madder">ECOLECTRIC</span>
                        </span>
                    </span>

                    <nav className="hidden md:flex items-center gap-8">
                        {links.map((l) => (
                            <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="font-body text-sm font-medium text-ink/80 hover:text-madder transition-colors">{l.label}</a>
                        ))}
                    </nav>

                    <button onClick={() => setOpen(true)} className="md:hidden text-ink text-2xl leading-none" aria-label="Open menu">☰</button>
                </div>
            </header>

            {open && (
                <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setOpen(false)} />
            )}

            <div className={`fixed top-0 right-0 h-full w-64 bg-wool border-l border-thread z-50 transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-end p-4">
                    <button onClick={() => setOpen(false)} className="text-ink text-2xl leading-none" aria-label="Close menu">×</button>
                </div>
                <nav className="flex flex-col gap-1 px-5">
                    {links.map((l) => (
                        <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined} onClick={() => setOpen(false)} className="font-body text-base font-medium text-ink py-3 border-b border-thread">{l.label}</a>
                    ))}
                </nav>
            </div>
        </>
    )
}