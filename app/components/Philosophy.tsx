export default function Philosophy() {
  return (
    <section id="philosophy" className="bg-primary text-on-primary py-section-gap px-gutter text-center overflow-hidden relative">
      <div className="max-w-4xl mx-auto relative z-10">
        <span className="font-mono-label text-mono-label uppercase tracking-widest mb-stack-lg block opacity-60">Manifesto</span>
        <blockquote className="font-display-lg text-headline-md md:text-display-lg-mobile lg:text-[64px] leading-tight mb-stack-lg italic">
          &quot;Code is not just about making things work. It is about making things work well, with clarity and purpose.&quot;
        </blockquote>
        <p className="font-label-caps text-label-caps tracking-[0.2em] uppercase opacity-80">&mdash; MERN Stack Developer</p>
      </div>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="grid grid-cols-12 h-full w-full">
          <div className="border-r border-on-primary"></div><div className="border-r border-on-primary"></div><div className="border-r border-on-primary"></div><div className="border-r border-on-primary"></div><div className="border-r border-on-primary"></div><div className="border-r border-on-primary"></div><div className="border-r border-on-primary"></div><div className="border-r border-on-primary"></div><div className="border-r border-on-primary"></div><div className="border-r border-on-primary"></div><div className="border-r border-on-primary"></div><div className="border-r border-on-primary"></div>
        </div>
      </div>
    </section>
  );
}