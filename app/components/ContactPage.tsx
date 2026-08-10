'use client';

import { useState } from 'react';
import { useSettings } from '@/lib/useSettings';

export default function ContactPage() {
  const s = useSettings();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [validation, setValidation] = useState('');

  const github = s.github_url || 'https://github.com/aswin669';
  const linkedin = s.linkedin_url || 'https://linkedin.com/in/aswin669';
  const email = s.email_address || 'Aswinsreedharan669@gmail.com';
  const siteName = s.site_name || 'ASWIN S';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const emailField = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const subject = (form.elements.namedItem('subject') as HTMLInputElement).value.trim();
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim();
    if (!name || !emailField || !message) { setValidation('Please fill in all required fields.'); return; }
    if (!emailField.includes('@')) { setValidation('Please enter a valid email.'); return; }
    setValidation('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: emailField, subject: subject || 'Portfolio Contact Inquiry', message }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setDone(true);
      form.reset();
      setTimeout(() => setDone(false), 5000);
    } catch {
      setValidation('Failed to send message. Please try again or email directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const socialLinks = [
    { key: 'linkedin', label: 'LinkedIn', href: linkedin },
    { key: 'github', label: 'GitHub', href: github },
    { key: 'email', label: 'Email', href: `mailto:${email}` },
  ];

  return (
    <>
      <main id="contact" className="pt-32 pb-section-gap max-w-container-max mx-auto px-gutter overflow-x-hidden">
        <section className="mb-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-8">
                <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-stack-lg leading-none">
                Let&apos;s Build Something Great Together
              </h1>
              <p className="font-body-lg text-body-lg text-secondary max-w-2xl">
                I am currently open to new opportunities and collaborations. Reach out to discuss how I can help bring your web project to life.
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter border-t border-primary pt-stack-lg">
          <section className="md:col-span-7 pr-0 md:pr-gutter">
            {done && (
              <div className="mb-stack-lg border border-primary bg-surface p-5 font-mono-label text-sm text-primary flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-l-primary shadow-sm">
                <div className="flex items-start sm:items-center gap-3.5">
                  <span className="px-2 py-0.5 bg-primary text-on-primary font-label-caps text-[10px] font-bold tracking-widest uppercase shrink-0">
                    STATUS // 201 OK
                  </span>
                  <div>
                    <p className="font-label-caps text-xs uppercase tracking-wider font-bold text-primary">
                      MESSAGE TRANSMITTED SUCCESSFULLY
                    </p>
                    <p className="text-secondary text-xs mt-0.5">
                      Thank you for reaching out. Your message has been sent to Aswin. Expect a response shortly.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDone(false)}
                  className="font-mono-label text-[11px] uppercase tracking-wider text-secondary hover:text-primary border border-outline-variant px-3 py-1.5 transition-colors shrink-0"
                >
                  DISMISS
                </button>
              </div>
            )}
            <form className="space-y-stack-lg" id="contact-form" onSubmit={handleSubmit}>
              <div className="group relative">
                <label className="font-mono-label text-mono-label text-secondary block mb-2" htmlFor="name">FULL NAME</label>
                <input className="w-full bg-transparent border-none border-b border-outline-variant py-4 px-0 focus:ring-0 focus:outline-none font-body-md text-primary placeholder:text-surface-container-highest transition-all" id="name" name="name" placeholder="John Doe" required type="text" />
                <div className="absolute bottom-0 left-0 h-[1px] bg-primary input-focus-line"></div>
              </div>
              <div className="group relative">
                <label className="font-mono-label text-mono-label text-secondary block mb-2" htmlFor="email">EMAIL ADDRESS</label>
                <input className="w-full bg-transparent border-none border-b border-outline-variant py-4 px-0 focus:ring-0 focus:outline-none font-body-md text-primary placeholder:text-surface-container-highest transition-all" id="email" name="email" placeholder="john@example.com" required type="email" />
                <div className="absolute bottom-0 left-0 h-[1px] bg-primary input-focus-line"></div>
              </div>
              <div className="group relative">
                <label className="font-mono-label text-mono-label text-secondary block mb-2" htmlFor="subject">SUBJECT</label>
                <input className="w-full bg-transparent border-none border-b border-outline-variant py-4 px-0 focus:ring-0 focus:outline-none font-body-md text-primary placeholder:text-surface-container-highest transition-all" id="subject" name="subject" placeholder="Project Inquiry" required type="text" />
                <div className="absolute bottom-0 left-0 h-[1px] bg-primary input-focus-line"></div>
              </div>
              <div className="group relative">
                <label className="font-mono-label text-mono-label text-secondary block mb-2" htmlFor="message">MESSAGE</label>
                <textarea className="w-full bg-transparent border-none border-b border-outline-variant py-4 px-0 focus:ring-0 focus:outline-none font-body-md text-primary placeholder:text-surface-container-highest transition-all resize-none" id="message" name="message" placeholder="Describe your vision..." required rows={4}></textarea>
                <div className="absolute bottom-0 left-0 h-[1px] bg-primary input-focus-line"></div>
              </div>
              {validation && <p className="font-mono-label text-mono-label text-error">{validation}</p>}
              <div className="pt-stack-lg">
                <button className={`w-full md:w-auto px-12 py-5 font-label-caps text-label-caps uppercase transition-all duration-300 disabled:opacity-50 ${done ? 'bg-green-600 text-white' : 'bg-primary text-on-primary hover:opacity-85'}`} type="submit" disabled={submitting}>
                  {done ? '✓ Message Sent Successfully!' : submitting ? 'Sending...' : 'Submit Message'}
                </button>
              </div>
            </form>
          </section>

          <section className="md:col-span-5 md:pl-gutter mt-section-gap md:mt-0">
            <div className="space-y-stack-lg">
              <div className="pb-stack-lg border-b border-outline-variant">
                <h3 className="font-mono-label text-mono-label text-secondary mb-4">CONTACT DETAILS</h3>
                <p className="font-headline-md text-headline-md mb-2">{email}</p>
                <p className="font-body-md text-body-md text-secondary">+91 81570 99669</p>
              </div>
              <div className="pb-stack-lg border-b border-outline-variant">
                <h3 className="font-mono-label text-mono-label text-secondary mb-4">LOCATION</h3>
                <p className="font-body-md text-body-md">Kerala, India — IST (GMT+5:30)</p>
              </div>
              <div>
                <h3 className="font-mono-label text-mono-label text-secondary mb-6">SOCIAL CHANNELS</h3>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((sl) => (
                    <a key={sl.key} className="group flex flex-col justify-between p-stack-lg aspect-square border border-outline-variant hover:border-primary transition-colors" href={sl.href} target="_blank" rel="noopener noreferrer">
                      <span className="material-symbols-outlined text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">north_east</span>
                      <span className="font-label-caps text-label-caps uppercase">{sl.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-section-gap">
          <div className="h-96 w-full border border-primary relative overflow-hidden grayscale">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d502796.22737822185!2d76.12024633465566!3d9.981629555454564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07fc8c2b0efdb5%3A0x8b01ef8e7f0f3f5b!2sKochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
            <div className="absolute bottom-8 left-8 bg-surface p-stack-lg border border-primary z-10">
              <p className="font-mono-label text-mono-label text-primary">KOCHI, KERALA</p>
              <p className="font-body-md text-body-md">9.9312° N, 76.2673° E</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-stack-lg px-gutter flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto mt-section-gap border-t border-primary">
        <div className="font-display-lg text-headline-md text-primary mb-stack-md md:mb-0">{siteName}</div>
        <div className="flex gap-stack-lg mb-stack-md md:mb-0">
          <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all" href={github}>GitHub</a>
          <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all" href={linkedin}>LinkedIn</a>
          <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all" href={`mailto:${email}`}>Email</a>
        </div>
        <div className="font-mono-label text-mono-label text-secondary">&copy; {new Date().getFullYear()} {siteName}. ALL RIGHTS RESERVED.</div>
      </footer>
    </>
  );
}
