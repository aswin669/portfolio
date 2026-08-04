'use client';

export default function ResumePage() {
  return (
    <>
      <main className="max-w-container-max mx-auto px-gutter pt-32 pb-section-gap">
        <section className="flex flex-col md:flex-row justify-between items-end mb-section-gap border-b border-primary pb-stack-lg">
          <div className="max-w-2xl">
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-stack-md uppercase">Resume</h1>
            <p className="font-body-lg text-body-lg text-secondary">Self-taught software developer with a focus on MERN stack, experienced in crafting dynamic front-end interfaces and robust back-end solutions.</p>
          </div>
           <div className="mt-stack-lg md:mt-0">
            <a
              href="/Aswin_S_Premium_ATS_Resume.pdf"
              download="Aswin_S_Premium_ATS_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-stack-md bg-primary text-on-primary px-8 py-5 font-label-caps text-label-caps hover:opacity-85 transition-all duration-300"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>download</span>
              DOWNLOAD RESUME
            </a>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-stack-lg md:gap-x-12">
          <aside className="md:col-span-3">
            <div className="sticky top-32 flex flex-col gap-12">
              <div>
                <span className="font-mono-label text-mono-label text-outline block mb-4 uppercase">Identity</span>
                <div className="w-full aspect-square bg-surface-container mb-stack-md overflow-hidden grayscale-hover">
                  <img className="w-full h-full object-cover" src="/hero-image.jpg" />
                </div>
                <h2 className="font-headline-md text-headline-md mb-1 uppercase">ASWIN S</h2>
                <p className="font-mono-label text-mono-label text-secondary uppercase tracking-widest">MERN Stack Developer</p>
              </div>
              <nav className="flex flex-col gap-4">
                <span className="font-mono-label text-mono-label text-outline uppercase">Quick Navigation</span>
                <a className="font-label-caps text-label-caps py-2 border-b border-outline-variant hover:border-primary transition-colors" href="/experience">EXPERIENCE</a>
                <a className="font-label-caps text-label-caps py-2 border-b border-outline-variant hover:border-primary transition-colors" href="/resume#education">EDUCATION</a>
                <a className="font-label-caps text-label-caps py-2 border-b border-outline-variant hover:border-primary transition-colors" href="/tech-stack">TECHNICAL EXPERTISE</a>
                <a className="font-label-caps text-label-caps py-2 border-b border-outline-variant hover:border-primary transition-colors" href="/resume#languages">LANGUAGES</a>
              </nav>
            </div>
          </aside>

          <div className="md:col-span-9 flex flex-col gap-section-gap">
            <section id="skills">
              <div className="flex items-center justify-between mb-12 border-b border-primary pb-4">
                <h3 className="font-headline-md text-headline-md uppercase">Technical Expertise</h3>
                <span className="font-mono-label text-mono-label text-outline">01</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                <div className="bg-surface-container p-stack-lg border border-outline-variant">
                  <span className="font-label-caps text-label-caps text-primary mb-stack-md block">FRONTEND</span>
                  <ul className="font-mono-label text-mono-label flex flex-col gap-2">
                    <li>HTML / CSS / Bootstrap</li>
                    <li>JavaScript / TypeScript</li>
                    <li>React JS</li>
                  </ul>
                </div>
                <div className="bg-primary text-on-primary p-stack-lg border border-primary">
                  <span className="font-label-caps text-label-caps text-on-primary-container mb-stack-md block">BACKEND</span>
                  <ul className="font-mono-label text-mono-label flex flex-col gap-2">
                    <li>Node JS / Express / Fastify</li>
                    <li>TypeScript</li>
                    <li>REST API Development</li>
                  </ul>
                </div>
                <div className="bg-surface-container-high p-stack-lg border border-outline-variant">
                  <span className="font-label-caps text-label-caps text-primary mb-stack-md block">DATABASE &amp; TOOLS</span>
                  <ul className="font-mono-label text-mono-label flex flex-col gap-2">
                    <li>Mongo DB / PostgreSQL</li>
                    <li>Prisma ORM</li>
                    <li>Git / Firebase</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="experience">
              <div className="flex items-center justify-between mb-12 border-b border-primary pb-4">
                <h3 className="font-headline-md text-headline-md uppercase">Career Experience</h3>
                <span className="font-mono-label text-mono-label text-outline">02</span>
              </div>
              <div className="relative pl-12">
                <div className="absolute left-[3.5px] top-0 bottom-0 w-[1px] bg-primary"></div>
                <div className="flex flex-col gap-20">
                  <div className="relative">
                    <div className="absolute -left-[12.5px] top-2 w-4 h-4 bg-primary border-4 border-surface"></div>
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-stack-md">
                      <h4 className="font-headline-md text-headline-md uppercase">Backend Developer &amp; Vibe Coder</h4>
                      <span className="font-mono-label text-mono-label text-secondary uppercase">SEP 2025 — PRESENT // MCABEE DIGITAL</span>
                    </div>
                    <div className="font-body-md text-body-md text-secondary space-y-4 max-w-3xl">
                      <p>Working as a Backend Developer, developing and maintaining scalable and efficient backend applications using Node.js, Fastify, TypeScript, Prisma, and PostgreSQL.</p>
                      <ul className="list-disc list-inside space-y-2 marker:text-primary">
                        <li>Designed and developed RESTful APIs for authentication, user management, appointments, bookings, payments, messaging, notifications, and administrative workflows.</li>
                        <li>Implemented secure authentication and authorization systems using JWT, role-based access control (RBAC), and protected API routes for different user roles.</li>
                        <li>Worked with Prisma ORM and PostgreSQL for database design, relationship management, query optimization, and reliable data handling.</li>
                        <li>Developed modular and maintainable backend architectures with proper separation of routes, controllers, services, repositories, DTOs, validations, and database layers.</li>
                        <li>Integrated third-party services and APIs including Firebase, Cloudinary, SMTP/email services, and payment-related workflows.</li>
                        <li>Built and tested APIs using Swagger/OpenAPI and API testing tools to ensure reliability and consistency.</li>
                        <li>Used AI-assisted development and vibe coding techniques to accelerate software development, generate solutions, debug issues, improve code quality, and rapidly prototype new features.</li>
                        <li>Collaborated on full-stack projects by understanding frontend requirements and building backend APIs that seamlessly integrate with React.js applications.</li>
                        <li>Worked with Git and GitHub for version control, collaborative development, branching, and code management.</li>
                        <li>Troubleshot production and development issues, optimized API performance, and continuously improved application architecture.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[12.5px] top-2 w-4 h-4 bg-primary border-4 border-surface"></div>
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-stack-md">
                      <h4 className="font-headline-md text-headline-md uppercase">MERN Intern</h4>
                      <span className="font-mono-label text-mono-label text-secondary uppercase">JUL 2024 — JAN 2025 // PLUGINS LEARN LTD</span>
                    </div>
                    <div className="font-body-md text-body-md text-secondary space-y-4 max-w-3xl">
                      <p>Gained hands-on experience in frontend and backend development, as well as database management.</p>
                      <ul className="list-disc list-inside space-y-2 marker:text-primary">
                        <li>Developed projects using JavaScript, ReactJS, NodeJS and MongoDB.</li>
                        <li>Worked on full-stack web applications following industry best practices.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <section id="education">
                <div className="flex items-center justify-between mb-12 border-b border-primary pb-4">
                  <h3 className="font-headline-md text-headline-md uppercase">Education</h3>
                  <span className="font-mono-label text-mono-label text-outline">03</span>
                </div>
                <div className="flex flex-col gap-8">
                  <div>
                    <h4 className="font-label-caps text-label-caps uppercase text-primary">Professional Course — MERN Stack</h4>
                    <p className="font-mono-label text-mono-label text-secondary">PluginsLearn // 2025</p>
                  </div>
                  <div>
                    <h4 className="font-label-caps text-label-caps uppercase text-primary">Higher Secondary (Computer Science)</h4>
                    <p className="font-mono-label text-mono-label text-secondary">SKVVHSS // 2015—2017</p>
                  </div>
                  <div>
                    <h4 className="font-label-caps text-label-caps uppercase text-primary">Secondary (SSLC)</h4>
                    <p className="font-mono-label text-mono-label text-secondary">SKVVHSS // 2015</p>
                  </div>
                </div>
              </section>
              <section id="languages">
                <div className="flex items-center justify-between mb-12 border-b border-primary pb-4">
                  <h3 className="font-headline-md text-headline-md uppercase">Languages</h3>
                  <span className="font-mono-label text-mono-label text-outline">04</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="border border-primary px-4 py-2 font-label-caps text-label-caps uppercase">English</div>
                  <div className="border border-outline-variant px-4 py-2 font-label-caps text-label-caps uppercase text-secondary">Tamil</div>
                  <div className="border border-primary px-4 py-2 font-label-caps text-label-caps uppercase">Malayalam</div>
                  <div className="border border-outline-variant px-4 py-2 font-label-caps text-label-caps uppercase text-secondary">Hindi</div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-stack-lg px-gutter flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto mt-section-gap border-t border-primary bg-surface">
        <div className="font-display-lg text-headline-md text-primary mb-stack-lg md:mb-0">ASWIN_S</div>
        <div className="flex gap-8 mb-stack-lg md:mb-0">
          <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all" href="https://github.com/aswin669">GitHub</a>
          <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all" href="https://linkedin.com/in/aswin669">LinkedIn</a>
          <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all" href="mailto:Aswinsreedharan669@gmail.com">Email</a>
        </div>
        <div className="font-mono-label text-mono-label text-secondary text-center md:text-right">&copy; 2025 ASWIN S. ALL RIGHTS RESERVED.</div>
      </footer>
    </>
  );
}