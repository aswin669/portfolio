'use client';

import { useEffect } from 'react';

export default function ServicesPage() {
  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-4');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.service-card').forEach(card => {
      card.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-700');
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <main id="services" className="pt-32 pb-section-gap max-w-container-max mx-auto px-gutter">
        <header className="mb-section-gap">
          <p className="font-mono-label text-mono-label text-secondary uppercase mb-stack-sm tracking-widest">Capabilities</p>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-stack-lg max-w-4xl">Building modern web solutions with the MERN stack.</h1>
          <div className="h-px bg-primary w-24"></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-outline-variant">
          <div className="service-card group p-stack-lg border-r border-b border-outline-variant flex flex-col justify-between aspect-square">
            <div className="flex justify-between items-start mb-stack-lg">
              <span className="font-mono-label text-mono-label text-secondary group-hover:text-surface-variant transition-colors">01</span>
              <span className="material-symbols-outlined service-icon text-primary text-3xl">web_asset</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md mb-stack-md">Web App Development</h3>
              <p className="font-body-md text-secondary group-hover:text-surface-container-highest transition-colors">Dynamic, full-stack web applications built with React JS, Node JS, and MongoDB with a focus on user experience.</p>
            </div>
            <div className="mt-stack-lg flex flex-wrap gap-2">
              <span className="border border-outline-variant px-3 py-1 font-label-caps text-[10px] group-hover:border-on-primary-fixed-variant">REACT JS</span>
              <span className="border border-outline-variant px-3 py-1 font-label-caps text-[10px] group-hover:border-on-primary-fixed-variant">NODE JS</span>
              <span className="border border-outline-variant px-3 py-1 font-label-caps text-[10px] group-hover:border-on-primary-fixed-variant">MONGO DB</span>
            </div>
          </div>

          <div className="service-card group p-stack-lg border-r border-b border-outline-variant flex flex-col justify-between aspect-square">
            <div className="flex justify-between items-start mb-stack-lg">
              <span className="font-mono-label text-mono-label text-secondary group-hover:text-surface-variant transition-colors">02</span>
              <span className="material-symbols-outlined service-icon text-primary text-3xl">terminal</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md mb-stack-md">REST API Development</h3>
              <p className="font-body-md text-secondary group-hover:text-surface-container-highest transition-colors">Secure, scalable RESTful APIs with authentication, validation, and comprehensive documentation using Swagger.</p>
            </div>
            <div className="mt-stack-lg flex flex-wrap gap-2">
              <span className="border border-outline-variant px-3 py-1 font-label-caps text-[10px] group-hover:border-on-primary-fixed-variant">EXPRESS</span>
              <span className="border border-outline-variant px-3 py-1 font-label-caps text-[10px] group-hover:border-on-primary-fixed-variant">FASTIFY</span>
              <span className="border border-outline-variant px-3 py-1 font-label-caps text-[10px] group-hover:border-on-primary-fixed-variant">JWT</span>
            </div>
          </div>

          <div className="service-card group p-stack-lg border-r border-b border-outline-variant flex flex-col justify-between aspect-square">
            <div className="flex justify-between items-start mb-stack-lg">
              <span className="font-mono-label text-mono-label text-secondary group-hover:text-surface-variant transition-colors">03</span>
              <span className="material-symbols-outlined service-icon text-primary text-3xl">database</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md mb-stack-md">Database Design &amp; Management</h3>
              <p className="font-body-md text-secondary group-hover:text-surface-container-highest transition-colors">Efficient database architecture with MongoDB and PostgreSQL, optimized for performance and reliability.</p>
            </div>
            <div className="mt-stack-lg flex flex-wrap gap-2">
              <span className="border border-outline-variant px-3 py-1 font-label-caps text-[10px] group-hover:border-on-primary-fixed-variant">MONGO DB</span>
              <span className="border border-outline-variant px-3 py-1 font-label-caps text-[10px] group-hover:border-on-primary-fixed-variant">POSTGRESQL</span>
              <span className="border border-outline-variant px-3 py-1 font-label-caps text-[10px] group-hover:border-on-primary-fixed-variant">PRISMA</span>
            </div>
          </div>

          <div className="service-card group p-stack-lg border-r border-b border-outline-variant flex flex-col justify-between aspect-square">
            <div className="flex justify-between items-start mb-stack-lg">
              <span className="font-mono-label text-mono-label text-secondary group-hover:text-surface-variant transition-colors">04</span>
              <span className="material-symbols-outlined service-icon text-primary text-3xl">security</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md mb-stack-md">Auth &amp; Authorization Systems</h3>
              <p className="font-body-md text-secondary group-hover:text-surface-container-highest transition-colors">Implementing secure authentication with JWT, role-based access control (RBAC), and protected API routes.</p>
            </div>
            <div className="mt-stack-lg flex flex-wrap gap-2">
              <span className="border border-outline-variant px-3 py-1 font-label-caps text-[10px] group-hover:border-on-primary-fixed-variant">JWT</span>
              <span className="border border-outline-variant px-3 py-1 font-label-caps text-[10px] group-hover:border-on-primary-fixed-variant">RBAC</span>
              <span className="border border-outline-variant px-3 py-1 font-label-caps text-[10px] group-hover:border-on-primary-fixed-variant">OAUTH 2.0</span>
            </div>
          </div>

          <div className="service-card group p-stack-lg border-r border-b border-outline-variant flex flex-col justify-between aspect-square">
            <div className="flex justify-between items-start mb-stack-lg">
              <span className="font-mono-label text-mono-label text-secondary group-hover:text-surface-variant transition-colors">05</span>
              <span className="material-symbols-outlined service-icon text-primary text-3xl">sync_alt</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md mb-stack-md">Third-Party Integrations</h3>
              <p className="font-body-md text-secondary group-hover:text-surface-container-highest transition-colors">Seamless integration of Firebase, Cloudinary, SMTP/email services, and payment processing workflows.</p>
            </div>
            <div className="mt-stack-lg flex flex-wrap gap-2">
              <span className="border border-outline-variant px-3 py-1 font-label-caps text-[10px] group-hover:border-on-primary-fixed-variant">FIREBASE</span>
              <span className="border border-outline-variant px-3 py-1 font-label-caps text-[10px] group-hover:border-on-primary-fixed-variant">CLOUDINARY</span>
              <span className="border border-outline-variant px-3 py-1 font-label-caps text-[10px] group-hover:border-on-primary-fixed-variant">SMTP</span>
            </div>
          </div>

          <div className="service-card group p-stack-lg border-r border-b border-outline-variant flex flex-col justify-between aspect-square">
            <div className="flex justify-between items-start mb-stack-lg">
              <span className="font-mono-label text-mono-label text-secondary group-hover:text-surface-variant transition-colors">06</span>
              <span className="material-symbols-outlined service-icon text-primary text-3xl">speed</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md mb-stack-md">Full-Stack Integration</h3>
              <p className="font-body-md text-secondary group-hover:text-surface-container-highest transition-colors">Connecting frontend and backend seamlessly, ensuring smooth data flow and a cohesive user experience.</p>
            </div>
            <div className="mt-stack-lg flex flex-wrap gap-2">
              <span className="border border-outline-variant px-3 py-1 font-label-caps text-[10px] group-hover:border-on-primary-fixed-variant">REACT JS</span>
              <span className="border border-outline-variant px-3 py-1 font-label-caps text-[10px] group-hover:border-on-primary-fixed-variant">NODE JS</span>
              <span className="border border-outline-variant px-3 py-1 font-label-caps text-[10px] group-hover:border-on-primary-fixed-variant">REST APIS</span>
            </div>
          </div>
        </div>

        <section className="mt-section-gap text-center max-w-2xl mx-auto">
          <h2 className="font-headline-md text-headline-md mb-stack-md">Need a tailored solution?</h2>
          <p className="font-body-lg text-body-lg text-secondary mb-stack-lg">For projects requiring specific technical expertise or long-term architectural consulting, I offer custom engagement models.</p>
          <a className="inline-block border border-primary text-primary px-12 py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all duration-300" href="/contact">Inquire for custom work</a>
        </section>
      </main>

      <footer className="w-full py-stack-lg px-gutter flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto mt-section-gap border-t border-primary bg-surface">
        <div className="font-display-lg text-headline-md text-primary mb-stack-md md:mb-0">ASWIN_S</div>
        <div className="flex flex-col items-center md:items-end">
          <div className="flex space-x-gutter mb-stack-sm">
            <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all" href="https://github.com/aswin669">GitHub</a>
            <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all" href="https://linkedin.com/in/aswin669">LinkedIn</a>
            <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all" href="mailto:Aswinsreedharan669@gmail.com">Email</a>
          </div>
          <p className="font-mono-label text-[10px] text-secondary-fixed uppercase tracking-wider">&copy; 2025 ASWIN S. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </>
  );
}