'use client';

import { useEffect, useState } from 'react';

export default function About() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.querySelectorAll('.achievement-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        const span = card.querySelector('span');
        if (span) span.style.opacity = '1';
      });
      card.addEventListener('mouseleave', () => {
        const span = card.querySelector('span');
        if (span) span.style.opacity = '0.6';
      });
    });
  }, []);

  return (
    <main id="about" className="max-w-container-max mx-auto px-gutter pt-24 sm:pt-32 md:pt-40 pb-section-gap">
      <section className="mb-section-gap">
        <div className="flex flex-col md:flex-row gap-stack-lg items-start md:items-end justify-between border-b border-primary pb-10">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg uppercase leading-none">About Me</h1>
          <div className="flex flex-col items-start md:items-end">
            <p className="font-mono-label text-mono-label uppercase tracking-widest text-secondary">Location: Kerala / India</p>
            <p className="font-mono-label text-mono-label uppercase tracking-widest text-secondary">Specialization: MERN Stack Developer</p>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
        <div className="md:col-span-7 space-y-stack-lg">
          <div className="border-l-4 border-primary pl-stack-lg">
            <p className="font-body-lg text-body-lg text-on-surface">
              I am a self-taught software developer with a strong focus on the MERN stack. I specialize in building dynamic, user-centric web applications with clean architecture and seamless user experiences.
            </p>
          </div>
          <p className="font-body-md text-body-md text-secondary leading-relaxed">
            My journey into software development began with a deep curiosity for how web applications work. Through self-directed learning and hands-on project development, I have gained extensive experience in crafting responsive front-end interfaces using ReactJS and building robust back-end systems with NodeJS and MongoDB.
          </p>
          <p className="font-body-md text-body-md text-secondary leading-relaxed">
            I am passionate about creating solutions that are not only functional but also intuitive and enjoyable to use. Every project I take on is an opportunity to learn, grow, and deliver the best possible outcome. I thrive in collaborative environments and am always eager to take on new challenges.
          </p>
          <div className="pt-stack-lg">
            <div className="inline-block border border-primary px-stack-md py-stack-sm font-label-caps text-label-caps uppercase">
              Core Principles: Clean Code, User Focus, Continuous Learning
            </div>
          </div>
        </div>
        <div className="md:col-span-5 relative group">
          <div className="aspect-[4/5] border border-outline-variant overflow-hidden">
            <img className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105" data-alt="A professional, high-contrast black and white portrait of a modern software engineer in a minimalist architectural studio. The person is looking thoughtfully slightly off-camera. The lighting is dramatic and crisp, emphasizing sharp lines and geometric shadows. The background is a clean white wall with a single industrial beam. The aesthetic is sophisticated, technical, and purely monochrome." src="/hero-image.jpg" />
          </div>
          <div className="absolute -bottom-4 -right-4 bg-primary text-on-primary p-stack-md hidden md:block">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>architecture</span>
          </div>
        </div>
      </section>
      <section className="mt-section-gap grid grid-cols-2 md:grid-cols-4 gap-0 border border-primary">
        <div className="achievement-card p-stack-lg border-r border-b md:border-b-0 md:border-r border-primary flex flex-col justify-between aspect-square md:aspect-auto h-48 md:h-64">
          <span className="font-mono-label text-mono-label uppercase opacity-60">Experience</span>
          <div>
            <h3 className="font-display-lg text-headline-md md:text-5xl leading-none">2+</h3>
            <p className="font-label-caps text-label-caps uppercase mt-2">Years Active</p>
          </div>
        </div>
        <div className="achievement-card p-stack-lg border-b md:border-b-0 md:border-r border-primary flex flex-col justify-between h-48 md:h-64">
          <span className="font-mono-label text-mono-label uppercase opacity-60">Projects</span>
          <div>
            <h3 className="font-display-lg text-headline-md md:text-5xl leading-none">10+</h3>
            <p className="font-label-caps text-label-caps uppercase mt-2">Built &amp; Deployed</p>
          </div>
        </div>
        <div className="achievement-card p-stack-lg border-r border-primary flex flex-col justify-between h-48 md:h-64">
          <span className="font-mono-label text-mono-label uppercase opacity-60">Stack</span>
          <div>
            <h3 className="font-display-lg text-headline-md md:text-5xl leading-none">10+</h3>
            <p className="font-label-caps text-label-caps uppercase mt-2">Technologies</p>
          </div>
        </div>
        <div className="achievement-card p-stack-lg flex flex-col justify-between h-48 md:h-64">
          <span className="font-mono-label text-mono-label uppercase opacity-60">Focus</span>
          <div>
            <h3 className="font-display-lg text-headline-md md:text-5xl leading-none">MERN</h3>
            <p className="font-label-caps text-label-caps uppercase mt-2">Full Stack</p>
          </div>
        </div>
      </section>
      <section className="mt-stack-lg py-stack-lg border-b border-outline-variant overflow-hidden whitespace-nowrap">
        <div className="flex items-center gap-10 animate-marquee">
          <span className="font-mono-label text-secondary uppercase">HTML</span>
          <span className="material-symbols-outlined text-outline-variant">square</span>
          <span className="font-mono-label text-secondary uppercase">CSS</span>
          <span className="material-symbols-outlined text-outline-variant">square</span>
          <span className="font-mono-label text-secondary uppercase">Bootstrap</span>
          <span className="material-symbols-outlined text-outline-variant">square</span>
          <span className="font-mono-label text-secondary uppercase">JavaScript</span>
          <span className="material-symbols-outlined text-outline-variant">square</span>
          <span className="font-mono-label text-secondary uppercase">React JS</span>
          <span className="material-symbols-outlined text-outline-variant">square</span>
          <span className="font-mono-label text-secondary uppercase">Node JS</span>
          <span className="material-symbols-outlined text-outline-variant">square</span>
          <span className="font-mono-label text-secondary uppercase">Mongo DB</span>
          <span className="material-symbols-outlined text-outline-variant">square</span>
          <span className="font-mono-label text-secondary uppercase">TypeScript</span>
        </div>
      </section>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </main>
  );
}