export default function TechStack() {
  return (
    <section id="skills" className="max-w-container-max mx-auto px-gutter py-section-gap border-b border-outline-variant">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
        <div className="lg:col-span-1">
          <span className="font-mono-label text-mono-label uppercase text-secondary">02 / Technical Core</span>
          <h2 className="font-headline-md text-headline-md mt-4 uppercase">Advanced Tech Stack</h2>
          <p className="mt-stack-md text-secondary max-w-xs">I leverage the modern web ecosystem to build resilient, distributed systems that scale with your business needs.</p>
        </div>
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-gutter">
          <div className="border border-outline-variant p-gutter flex flex-col items-center text-center hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[48px] mb-4">terminal</span>
            <h4 className="font-label-caps text-label-caps">FRONTEND</h4>
            <p className="text-secondary text-[11px] font-mono-label mt-2">React JS / Bootstrap</p>
          </div>
          <div className="border border-outline-variant p-gutter flex flex-col items-center text-center hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[48px] mb-4">settings_ethernet</span>
            <h4 className="font-label-caps text-label-caps">BACKEND</h4>
            <p className="text-secondary text-[11px] font-mono-label mt-2">Node.js / Express / Fastify</p>
          </div>
          <div className="border border-outline-variant p-gutter flex flex-col items-center text-center hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[48px] mb-4">database</span>
            <h4 className="font-label-caps text-label-caps">DATABASE</h4>
            <p className="text-secondary text-[11px] font-mono-label mt-2">MongoDB / PostgreSQL</p>
          </div>
          <div className="border border-outline-variant p-gutter flex flex-col items-center text-center hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[48px] mb-4">cloud</span>
            <h4 className="font-label-caps text-label-caps">TOOLS</h4>
            <p className="text-secondary text-[11px] font-mono-label mt-2">Git / Prisma / Firebase</p>
          </div>
        </div>
      </div>
    </section>
  );
}