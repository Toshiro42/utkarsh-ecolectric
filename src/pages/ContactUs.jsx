import Navbar from '../components/Navbar'
import { FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa'

export default function ContactUs() {
    const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER
    const email = import.meta.env.VITE_CONTACT_EMAIL
    const phoneDisplay = import.meta.env.VITE_CONTACT_PHONE_DISPLAY

    return (
        <div className="min-h-screen bg-wool text-ink">
            <Navbar />

            <div className="max-w-2xl mx-auto px-5 pt-14 pb-20">
                <p className="text-madder text-xs font-body font-bold tracking-[0.2em] uppercase mb-2">
                    Get in touch
                </p>
                <h1 className="font-display text-3xl sm:text-4xl font-bold mb-10">
                    Contact Us
                </h1>

                <div className="flex flex-col gap-4">
                    <a
                        href={`https://wa.me/${waNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 bg-mustard border border-thread rounded-stitch p-5 hover:border-madder transition-colors"
                    >
                        <FaWhatsapp className="text-2xl text-madder shrink-0" />
                        <div>
                            <p className="font-body text-sm text-sage">WhatsApp</p>
                            <p className="font-body text-base font-medium">{phoneDisplay}</p>
                        </div>
                    </a>

                    <a
                        href={`tel:${waNumber}`}
                        className="flex items-center gap-4 bg-mustard border border-thread rounded-stitch p-5 hover:border-madder transition-colors"
                    >
                        <FaPhone className="text-2xl text-madder shrink-0" />
                        <div>
                            <p className="font-body text-sm text-sage">Call</p>
                            <p className="font-body text-base font-medium">{phoneDisplay}</p>
                        </div>
                    </a>

                    <a
                        href={`mailto:${email}`}
                        className="flex items-center gap-4 bg-mustard border border-thread rounded-stitch p-5 hover:border-madder transition-colors"
                    >
                        <FaEnvelope className="text-2xl text-madder shrink-0" />
                        <div>
                            <p className="font-body text-sm text-sage">Email</p>
                            <p className="font-body text-base font-medium">{email}</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    )
}