export default function Services() {
  return (
    <section id="services" className="max-w-container-max mx-auto px-gutter py-section-gap">
      <div className="flex flex-col md:flex-row gap-stack-lg">
        <div className="md:w-1/3">
          <span className="font-mono-label text-mono-label uppercase text-secondary">03 / Offerings</span>
          <h2 className="font-headline-md text-headline-md mt-4 uppercase">Expertise &amp; Services</h2>
        </div>
        <div className="md:w-2/3 divide-y divide-outline-variant border-t border-b border-outline-variant">
          <div className="py-stack-lg group hover:bg-surface-container-low transition-all px-4">
            <div className="flex justify-between items-center cursor-pointer">
              <div>
                <h3 className="font-headline-md text-headline-md text-[24px] uppercase mb-2">Full-Stack Web Development</h3>
                <p className="text-secondary font-body-md max-w-xl">End-to-end web applications built with React JS, Node JS, and MongoDB — from concept to deployment.</p>
              </div>
              <span className="material-symbols-outlined group-hover:rotate-45 transition-transform">add</span>
            </div>
          </div>
          <div className="py-stack-lg group hover:bg-surface-container-low transition-all px-4">
            <div className="flex justify-between items-center cursor-pointer">
              <div>
                <h3 className="font-headline-md text-headline-md text-[24px] uppercase mb-2">REST API Development</h3>
                <p className="text-secondary font-body-md max-w-xl">Secure and scalable RESTful APIs with JWT authentication, role-based access control, and Swagger documentation.</p>
              </div>
              <span className="material-symbols-outlined group-hover:rotate-45 transition-transform">add</span>
            </div>
          </div>
          <div className="py-stack-lg group hover:bg-surface-container-low transition-all px-4">
            <div className="flex justify-between items-center cursor-pointer">
              <div>
                <h3 className="font-headline-md text-headline-md text-[24px] uppercase mb-2">Database Design &amp; Management</h3>
                <p className="text-secondary font-body-md max-w-xl">Efficient database architecture with MongoDB, PostgreSQL, and Prisma ORM for reliable data handling and query optimization.</p>
              </div>
              <span className="material-symbols-outlined group-hover:rotate-45 transition-transform">add</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}