export default function ExperienceSection() {
  return (
    <section id="experience" className="max-w-container-max mx-auto px-gutter py-section-gap border-t border-outline-variant">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-stack-lg mb-stack-lg">
        <div>
          <span className="font-mono-label text-mono-label uppercase text-secondary">Career</span>
          <h2 className="font-headline-md text-headline-md uppercase mt-2">Professional Experience</h2>
        </div>
        <a className="font-label-caps text-label-caps border-b border-primary pb-1 hover:pb-2 transition-all" href="/experience">
          Full timeline
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <article className="border border-outline-variant p-stack-lg hover:border-primary transition-colors">
          <span className="font-mono-label text-mono-label text-primary">SEP 2025 — PRESENT</span>
          <h3 className="font-headline-md text-headline-md uppercase mt-3 mb-1">Backend Developer &amp; Vibe Coder</h3>
          <p className="font-label-caps text-label-caps text-secondary mb-stack-md">MCABEE DIGITAL</p>
          <p className="font-body-md text-secondary">
            Developing scalable backend apps with Node.js, Fastify, TypeScript, Prisma, and PostgreSQL.
          </p>
        </article>
        <article className="border border-outline-variant p-stack-lg hover:border-primary transition-colors">
          <span className="font-mono-label text-mono-label text-primary">JUL 2024 — JAN 2025</span>
          <h3 className="font-headline-md text-headline-md uppercase mt-3 mb-1">MERN Intern</h3>
          <p className="font-label-caps text-label-caps text-secondary mb-stack-md">PLUGINS LEARN LTD</p>
          <p className="font-body-md text-secondary">
            Hands-on full-stack development with ReactJS, NodeJS, and MongoDB.
          </p>
        </article>
      </div>
    </section>
  );
}
