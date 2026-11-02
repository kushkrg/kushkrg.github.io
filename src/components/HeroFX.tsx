import { useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  animate,
  useInView,
  type Variants,
} from 'framer-motion';

/* ---------------------------------- data --------------------------------- */

const stats = [
  { value: 5, suffix: '+', label: 'Years Experience' },
  { value: 150, suffix: '+', label: 'Tutorials Published' },
  { value: 90, suffix: '+', label: 'Course Videos' },
  { value: 25, suffix: '+', label: 'Tech & Tools' },
];

const chips = [
  { label: 'React', color: '#0090ff', style: { left: '0.5%', top: '15%' }, dur: 5.2 },
  { label: 'Next.js', color: '#1d1d1f', style: { right: '0.5%', top: '11%' }, dur: 6.1 },
  { label: 'Node.js', color: '#30d158', style: { left: '7%', top: '42%' }, dur: 5.7 },
  { label: 'Astro', color: '#ff6482', style: { right: '7%', top: '40%' }, dur: 6.4 },
  { label: 'PHP', color: '#a259ff', style: { left: '2%', bottom: '20%' }, dur: 5.4 },
  { label: 'MongoDB', color: '#ff8a00', style: { right: '2%', bottom: '24%' }, dur: 6.8 },
];

/* -------------------------------- variants ------------------------------- */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const wordWrap: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const word: Variants = {
  hidden: { y: '115%', rotate: 4 },
  show: {
    y: '0%',
    rotate: 0,
    transition: { type: 'spring', stiffness: 210, damping: 26 },
  },
};

/* -------------------------------- components ----------------------------- */

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.25 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.25 });

  return (
    <motion.span
      ref={ref}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * 0.32);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.38);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

function HeadlineWords({
  words,
  className,
}: {
  words: string[];
  className?: string;
}) {
  return (
    <motion.span variants={wordWrap} className={className} style={{ display: 'inline-block' }}>
      {words.map((w, i) => (
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.12em', marginBottom: '-0.12em' }}
        >
          <motion.span variants={word} style={{ display: 'inline-block' }}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* ---------------------------------- hero --------------------------------- */

export default function HeroFX() {
  const heroRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const gx = useSpring(mx, { stiffness: 60, damping: 20 });
  const gy = useSpring(my, { stiffness: 60, damping: 20 });

  return (
    <div
      className="wrap hero-inner"
      ref={heroRef}
      onMouseMove={(e) => {
        const r = heroRef.current?.getBoundingClientRect();
        if (!r) return;
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
    >
      {/* cursor-follow glow */}
      <motion.div className="hero-glow" style={{ x: gx, y: gy }} aria-hidden="true" />

      {/* floating, draggable tech chips */}
      {chips.map((chip, i) => (
        <motion.span
          key={chip.label}
          className="hero-chip"
          style={chip.style as React.CSSProperties}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1, y: [0, -11, 0] }}
          transition={{
            opacity: { delay: 0.9 + i * 0.12, duration: 0.5 },
            scale: { delay: 0.9 + i * 0.12, type: 'spring', stiffness: 260, damping: 17 },
            y: { delay: 1.4 + i * 0.12, duration: chip.dur, repeat: Infinity, ease: 'easeInOut' },
          }}
          drag
          dragConstraints={heroRef}
          dragElastic={0.6}
          whileDrag={{ scale: 1.12, cursor: 'grabbing' }}
          whileHover={{ scale: 1.07 }}
        >
          <span className="chip-dot" style={{ background: chip.color }} />
          {chip.label}
        </motion.span>
      ))}

      <motion.div variants={container} initial="hidden" animate="show" className="hero-content">
        <motion.div variants={item}>
          <span className="badge">Available for freelance &amp; full-time roles</span>
        </motion.div>

        <h1>
          <HeadlineWords words={['Lavkush', 'Kumar']} />
          <br />
          <HeadlineWords words={['Full', 'Stack']} className="grad" />{' '}
          <motion.span variants={item} className="grad serif" style={{ display: 'inline-block' }}>
            Developer
          </motion.span>
        </h1>

        <motion.p variants={item} className="role">
          React · Next.js · PHP · MERN · Android
        </motion.p>

        <motion.p variants={item} className="lede">
          I design and build complete digital products — from pixel-perfect React &amp; Next.js
          front-ends to Strapi, MongoDB &amp; MySQL backends, deployed and shipped end-to-end.
          I also build Android apps, and still craft Webflow, WordPress &amp; Shopify sites when
          that&apos;s the right tool for the job.
        </motion.p>

        <motion.div variants={item} className="hero-actions">
          <Magnetic>
            <a className="btn btn-primary" href="#projects">
              See My Work
            </a>
          </Magnetic>
          <a className="btn btn-pill" href="https://github.com/kushkrg" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a className="btn btn-ghost" href="#contact">
            Get in Touch ›
          </a>
        </motion.div>

        <motion.div variants={item} className="stats">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <div className="num">
                <CountUp value={s.value} suffix={s.suffix} />
              </div>
              <div className="lbl">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
