"use client";

import { useState, useEffect, useCallback, useRef, forwardRef } from "react";

/* ────────────────────────── DATA ────────────────────────── */

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
];

interface Project {
  title: string;
  date: string;
  tools: string[];
  problem: string;
  role: string;
  actions: string[];
  outcome: string;
  featured?: boolean;
}

const PROJECTS: Project[] = [
  {
    title: "CUDA-Accelerated Real-Time Object Detection Pipeline",
    date: "Jul 2025",
    tools: ["Python", "YOLOv8", "PyTorch", "OpenCV", "CUDA"],
    problem:
      "Real-time multi-object detection on live video feeds was bottlenecked by CPU-bound inference, making it impractical for latency-sensitive applications.",
    role: "Sole developer — built, profiled, and optimized the inference pipeline.",
    actions: [
      "Built a real-time multi-object detector for live webcam and video streams using YOLOv8 and PyTorch.",
      "Profiled the inference pipeline end-to-end to identify CPU-bound bottlenecks in pre-processing and model inference stages.",
      "Moved inference to GPU via CUDA-enabled PyTorch, reducing per-frame latency compared to CPU-only execution.",
      "Implemented continuous frame capture with configurable confidence thresholds and error handling.",
    ],
    outcome:
      "Reduced per-frame inference latency by moving to GPU execution. [ADD HERE: measured ms/frame on CPU vs GPU]",
    featured: true,
  },
  {
    title: "Blockchain-Based Voting System",
    date: "May 2025",
    tools: ["Solidity", "Ethereum", "React.js", "Node.js", "Express.js", "MongoDB"],
    problem:
      "Traditional voting systems are vulnerable to tampering, duplication, and lack verifiable audit trails.",
    role: "Full-stack developer — designed the smart-contract logic, authentication flows, and verification test suite.",
    actions: [
      "Implemented tamper-resistant vote recording on Ethereum using Solidity smart contracts with immutable state transitions.",
      "Engineered multi-step authentication: national ID verification, OTP-based second factor, and biometric confirmation.",
      "Designed and executed a comprehensive negative-testing suite — duplicate votes, invalid IDs, replay attacks, and out-of-window submissions — all rejected correctly.",
      "Built the voter-facing React UI with real-time status feedback and accessible error states.",
    ],
    outcome:
      "Delivered a verifiably secure voting prototype with 100% rejection rate on all crafted invalid-input test cases. Demonstrates a verification-first engineering mindset.",
  },
  {
    title: "Multi-Agent Retail Assistant",
    date: "Sep 2025",
    tools: ["Python", "LangGraph", "LangChain", "ChromaDB", "FastAPI"],
    problem:
      "Monolithic retail chatbots are fragile — a single failure in order processing can cascade into refund and catalogue features.",
    role: "System architect & developer — designed the agent topology, inter-agent protocols, and fault-isolation strategy.",
    actions: [
      "Designed a modular multi-agent system with three specialized agents (Order, Refund, Catalogue) coordinated by a supervisor agent.",
      "Built each agent as an independently testable and deployable unit with its own state machine and failure-recovery logic.",
      "Implemented vector-similarity retrieval via ChromaDB for catalogue search, enabling sub-second product lookups across 10k+ SKUs.",
      "Exposed the system through a FastAPI gateway with structured request/response schemas.",
    ],
    outcome:
      "Each agent can fail and recover independently without affecting sibling agents — modular, testable, resilient by design.",
  },
];

const SKILLS: { category: string; items: string[] }[] = [
  {
    category: "Digital Logic",
    items: [
      "Logic Gates", "MUX / Decoders / Adders", "Latches & Flip-Flops",
      "Registers & Counters", "Combinational Circuits", "Sequential Circuits",
    ],
  },
  {
    category: "Systems & Performance",
    items: [
      "Linux / Unix", "Operating Systems", "Computer Networks", "CUDA",
      "Inference Profiling", "Latency Optimization", "Complexity Analysis",
    ],
  },
  { category: "Languages", items: ["C++", "Python", "Java", "JavaScript", "SQL"] },
  { category: "Tools", items: ["Bash", "Git / GitHub", "Docker"] },
  {
    category: "ML & Data",
    items: ["PyTorch", "YOLOv8", "OpenCV", "Scikit-learn", "XGBoost", "Pandas"],
  },
  {
    category: "Backend",
    items: ["FastAPI", "Flask", "Express.js", "PostgreSQL", "MySQL", "MongoDB", "ChromaDB"],
  },
  {
    category: "Testing & Security",
    items: ["Negative & Invalid-Input Testing", "Tamper-Resistant Design", "Secure Auth Flows"],
  },
];

const CERTIFICATIONS = [
  { name: "SAP Certified Back-End Developer, ABAP Cloud", issuer: "SAP", period: "Jun 2026 – Jun 2027" },
  { name: "MongoDB Certified Associate Developer", issuer: "MongoDB" },
  { name: "OCI Foundations Associate", issuer: "Oracle" },
  { name: "Azure Fundamentals (AZ-900)", issuer: "Microsoft" },
];

/* ────────────────────────── ICONS ────────────────────────── */

function SunIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={18} height={18}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={18} height={18}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={22} height={22}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={22} height={22}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={14} height={14}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={14} height={14}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}

/* ────────────────────── PORTFOLIO ────────────────────── */

export default function Portfolio() {
  const [dark, setDark] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [expandedProject, setExpandedProject] = useState<number | null>(0); // featured open by default
  const [year, setYear] = useState(2026);
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setYear(new Date().getFullYear());
  }, []);

  const toggleDark = useCallback(() => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }, [dark]);

  /* Scroll spy */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      let current = "";
      for (const l of NAV_LINKS) {
        const el = document.getElementById(l.id);
        if (el && el.offsetTop - 120 <= y) current = l.id;
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Scroll reveal */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = useCallback((el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  }, []);

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[var(--bg)]/85 backdrop-blur-sm border-b border-[var(--border)] transition-colors duration-200" role="navigation" aria-label="Main navigation">
        <div className="max-w-[64rem] mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm font-semibold tracking-tight text-[var(--fg)] cursor-pointer">
            Kshitij Shrivastava
          </button>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={`text-[13px] transition-colors duration-150 ${
                  activeSection === l.id
                    ? "text-accent font-medium"
                    : "text-[var(--fg-secondary)] hover:text-[var(--fg)]"
                }`}
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={toggleDark}
              className="ml-2 p-1.5 rounded-md text-[var(--fg-tertiary)] hover:text-[var(--fg)] transition-colors"
              aria-label="Toggle theme"
              id="theme-toggle"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

          <div className="flex md:hidden items-center">
            <button onClick={toggleDark} className="p-2.5 -mr-1 text-[var(--fg-tertiary)] hover:text-[var(--fg)] transition-colors" aria-label="Toggle theme">
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="p-2.5 text-[var(--fg-tertiary)] hover:text-[var(--fg)] transition-colors" aria-label={mobileMenu ? "Close menu" : "Open menu"} id="mobile-menu-toggle">
              {mobileMenu ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${mobileMenu ? "max-h-80" : "max-h-0"}`}>
          <div className="px-5 pb-4 pt-1 flex flex-col gap-1 border-t border-[var(--border)]">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setMobileMenu(false)}
                className={`py-2 text-sm ${
                  activeSection === l.id ? "text-accent font-medium" : "text-[var(--fg-secondary)]"
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-[64rem] mx-auto px-5 sm:px-8">

        {/* ── Hero ── */}
        <section className="pt-28 pb-16 sm:pt-36 sm:pb-24 border-b border-[var(--border)] relative">
          {/* Subtle engineering grid */}
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 opacity-[0.04] dark:opacity-[0.06] pointer-events-none" aria-hidden>
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {Array.from({ length: 9 }, (_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 25} x2="200" y2={i * 25} stroke="currentColor" strokeWidth="0.5" />
              ))}
              {Array.from({ length: 9 }, (_, i) => (
                <line key={`v${i}`} x1={i * 25} y1="0" x2={i * 25} y2="200" stroke="currentColor" strokeWidth="0.5" />
              ))}
              <rect x="50" y="50" width="100" height="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="3" fill="currentColor" />
            </svg>
          </div>

          <p className="text-[13px] font-medium text-accent tracking-wide uppercase mb-5">
            Silicon / ASIC Design & Verification
          </p>
          <h1 className="text-[2.5rem] sm:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.03em] leading-[1.1] mb-5">
            Kshitij Shrivastava
          </h1>
          <p className="text-[15px] sm:text-base text-[var(--fg-secondary)] leading-[1.7] max-w-[34rem] mb-8">
            CS engineer who thinks in systems and performance — 3+ years of Linux/Unix
            and Python scripting, a solid base in digital logic, building toward RTL design
            and verification for hardware accelerators.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-accent text-white rounded-md hover:bg-accent-hover transition-colors"
              id="hero-cta"
            >
              View projects <ArrowDown />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-[var(--border)] rounded-md text-[var(--fg)] hover:bg-[var(--surface)] transition-colors"
              id="hero-contact"
            >
              Get in touch
            </a>
          </div>
        </section>

        {/* ── About ── */}
        <section id="about" className="py-16 sm:py-20 border-b border-[var(--border)]">
          <div className="reveal" ref={addRef}>
            <div className="grid md:grid-cols-[1fr_280px] gap-12 items-start">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight mb-6">About</h2>
                <p className="text-[15px] leading-[1.7] text-[var(--fg-secondary)]">
                  I&apos;m a <strong className="text-[var(--fg)] font-medium">Computer Science &amp; Engineering</strong> student
                  at Technocrats Institute of Technology, Bhopal (7.5/8 CGPA, graduating 2027).
                  While most CS students stay in software, I&apos;ve gravitated toward hardware-software
                  boundaries — profiling inference pipelines, applying CUDA optimizations, and grounding
                  myself in digital logic from combinational circuits to sequential state machines.
                </p>
                <p className="text-[15px] leading-[1.7] text-[var(--fg-secondary)]">
                  My goal is to grow into RTL design and verification for hardware accelerators, where
                  my systems thinking, performance obsession, and verification mindset converge. I care about
                  building at scale, measurable impact, and designs that are correct by construction.
                </p>
              </div>
              <aside className="space-y-3 text-sm">
                <DetailRow label="Location" value="Bhopal, MP, India" />
                <DetailRow label="Education" value="B.Tech CSE, 2023–2027" />
                <DetailRow label="CGPA" value="7.5 / 8.0" />
                <DetailRow label="Coursework" value="Digital Logic Design, OS, Networks, DSA, DBMS, OOP" />
              </aside>
            </div>
          </div>
        </section>

        {/* ── Projects ── */}
        <section id="projects" className="py-16 sm:py-20 border-b border-[var(--border)]">
          <div className="reveal" ref={addRef}>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Projects</h2>
            <p className="text-sm text-[var(--fg-tertiary)] mb-10">
              Case studies — problem, approach, tools, outcome.
            </p>
          </div>

          {/* Featured project */}
          <div className="reveal mb-10" ref={addRef}>
            <FeaturedProject
              project={PROJECTS[0]}
              expanded={expandedProject === 0}
              onToggle={() => setExpandedProject(expandedProject === 0 ? null : 0)}
            />
          </div>

          {/* Secondary projects */}
          <div className="grid md:grid-cols-2 gap-6">
            {PROJECTS.slice(1).map((p, i) => (
              <div key={i + 1} className="reveal" ref={addRef}>
                <CompactProject
                  project={p}
                  expanded={expandedProject === i + 1}
                  onToggle={() => setExpandedProject(expandedProject === i + 1 ? null : i + 1)}
                  index={i + 1}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Skills ── */}
        <section id="skills" className="py-16 sm:py-20 border-b border-[var(--border)]">
          <div className="reveal" ref={addRef}>
            <h2 className="text-2xl font-bold tracking-tight mb-10">Skills</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
            {SKILLS.map((g, i) => (
              <div key={i} className="reveal" ref={addRef}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-tertiary)] mb-3">
                  {g.category}
                </h3>
                <p className="text-sm text-[var(--fg-secondary)] leading-relaxed">
                  {g.items.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Experience & Education ── */}
        <section id="experience" className="py-16 sm:py-20 border-b border-[var(--border)]">
          <div className="reveal" ref={addRef}>
            <h2 className="text-2xl font-bold tracking-tight mb-10">Experience & Education</h2>
          </div>

          <div className="space-y-8">
            <TimelineRow
              ref={addRef}
              period="2 months"
              title="Junior Backend Developer"
              org="Leap"
              items={[
                "Backend development internship.",
              ]}
            />
            <div className="border-t border-[var(--border)]" />
            <TimelineRow
              ref={addRef}
              period="2023 – 2027"
              title="B.Tech Computer Science & Engineering"
              org="Technocrats Institute of Technology, Bhopal"
              items={[
                "CGPA: 7.5 / 8.0",
                "Coursework: Digital Logic Design, Operating Systems, Computer Networks, DSA, DBMS, OOP",
              ]}
            />
          </div>
        </section>

        {/* ── Certifications ── */}
        <section id="certifications" className="py-16 sm:py-20 border-b border-[var(--border)]">
          <div className="reveal" ref={addRef}>
            <h2 className="text-2xl font-bold tracking-tight mb-8">Certifications</h2>
          </div>
          <ul className="divide-y divide-[var(--border)]">
            {CERTIFICATIONS.map((c, i) => (
              <li key={i} className="reveal flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-3 first:pt-0" ref={addRef}>
                <span className="text-sm font-medium text-[var(--fg)]">{c.name}</span>
                <span className="hidden sm:inline text-[var(--fg-tertiary)]" aria-hidden>—</span>
                <span className="text-xs text-[var(--fg-tertiary)]">
                  {c.issuer}{c.period ? ` · ${c.period}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Contact ── */}
        <section id="contact" className="py-16 sm:py-20">
          <div className="reveal" ref={addRef}>
            <h2 className="text-2xl font-bold tracking-tight mb-3">Contact</h2>
            <p className="text-sm text-[var(--fg-secondary)] mb-8 max-w-md">
              I&apos;m actively seeking Silicon / ASIC Design &amp; Verification roles.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6">
              <a
                href="mailto:kshitijshrivastava05@gmail.com"
                className="text-sm font-medium text-accent hover:underline underline-offset-4"
                id="contact-email-btn"
              >
                kshitijshrivastava05@gmail.com
              </a>
              <span className="hidden sm:inline text-[var(--fg-tertiary)]" aria-hidden>·</span>
              <a
                href="tel:+918827237012"
                className="text-sm text-[var(--fg-secondary)] hover:text-[var(--fg)] transition-colors"
                id="contact-phone-btn"
              >
                +91-8827237012
              </a>
            </div>

            <span
              className="inline-flex items-center gap-2 text-sm text-[var(--fg-tertiary)] cursor-default"
              id="download-resume"
            >
              Resume — coming soon
            </span>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border)] py-8">
        <div className="max-w-[64rem] mx-auto px-5 sm:px-8 flex flex-col sm:flex-row sm:justify-between gap-1 text-xs text-[var(--fg-tertiary)]">
          <span>© {year} Kshitij Shrivastava</span>
          <span>Bhopal, India</span>
        </div>
      </footer>
    </>
  );
}

/* ────────────────── Sub-components ────────────────── */

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 border-b border-[var(--border)] last:border-0">
      <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--fg-tertiary)]">
        {label}
      </span>
      <span className="text-[var(--fg)]">{value}</span>
    </div>
  );
}

function FeaturedProject({
  project,
  expanded,
  onToggle,
}: {
  project: Project;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`border rounded-lg transition-colors duration-200 ${
        expanded ? "border-accent/30" : "border-[var(--border)]"
      }`}
      id="project-card-0"
    >
      <button
        onClick={onToggle}
        className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 group cursor-pointer"
        aria-expanded={expanded}
      >
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-accent">
              Featured
            </span>
            <span className="text-xs text-[var(--fg-tertiary)] font-mono">{project.date}</span>
          </div>
          <h3 className="text-lg font-semibold leading-snug group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          <p className="text-[11px] font-mono text-[var(--fg-tertiary)] mt-3">
            {project.tools.join(" · ")}
          </p>
        </div>
        <svg
          className={`w-4 h-4 mt-1.5 shrink-0 text-[var(--fg-tertiary)] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      <div className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${expanded ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-6 pb-6 pt-5 border-t border-[var(--border)] space-y-5">
          <CaseBlock label="Problem" text={project.problem} />
          <CaseBlock label="My Role" text={project.role} />
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--fg-tertiary)] mb-2">
              Approach
            </h4>
            <ul className="space-y-1.5">
              {project.actions.map((a, i) => (
                <li key={i} className="text-sm text-[var(--fg-secondary)] leading-relaxed pl-4 relative before:content-['–'] before:absolute before:left-0 before:text-[var(--fg-tertiary)]">
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <CaseBlock label="Outcome" text={project.outcome} bold />
        </div>
      </div>
    </div>
  );
}

function CompactProject({
  project,
  expanded,
  onToggle,
  index,
}: {
  project: Project;
  expanded: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div
      className={`border rounded-lg transition-colors duration-200 ${
        expanded ? "border-accent/30" : "border-[var(--border)]"
      }`}
      id={`project-card-${index}`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-start justify-between gap-3 group cursor-pointer"
        aria-expanded={expanded}
      >
        <div>
          <span className="text-xs text-[var(--fg-tertiary)] font-mono">{project.date}</span>
          <h3 className="text-[15px] font-semibold leading-snug mt-1 group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          <p className="text-[11px] font-mono text-[var(--fg-tertiary)] mt-2">
            {project.tools.join(" · ")}
          </p>
        </div>
        <svg
          className={`w-4 h-4 mt-1 shrink-0 text-[var(--fg-tertiary)] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      <div className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${expanded ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-5 pb-5 pt-4 border-t border-[var(--border)] space-y-4">
          <CaseBlock label="Problem" text={project.problem} />
          <CaseBlock label="My Role" text={project.role} />
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--fg-tertiary)] mb-2">
              Approach
            </h4>
            <ul className="space-y-1.5">
              {project.actions.map((a, i) => (
                <li key={i} className="text-sm text-[var(--fg-secondary)] leading-relaxed pl-4 relative before:content-['–'] before:absolute before:left-0 before:text-[var(--fg-tertiary)]">
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <CaseBlock label="Outcome" text={project.outcome} bold />
        </div>
      </div>
    </div>
  );
}

function CaseBlock({ label, text, bold }: { label: string; text: string; bold?: boolean }) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--fg-tertiary)] mb-1">
        {label}
      </h4>
      <p className={`text-sm leading-relaxed ${bold ? "text-[var(--fg)] font-medium" : "text-[var(--fg-secondary)]"}`}>
        {text}
      </p>
    </div>
  );
}

const TimelineRow = forwardRef<HTMLElement, {
  period: string;
  title: string;
  org: string;
  items: string[];
}>(function TimelineRow({ period, title, org, items }, ref) {
  return (
    <div className="reveal grid sm:grid-cols-[140px_1fr] gap-2 sm:gap-8" ref={ref as React.Ref<HTMLDivElement>}>
      <span className="text-xs font-mono text-[var(--fg-tertiary)] pt-0.5">{period}</span>
      <div>
        <h3 className="text-[15px] font-semibold">{title}</h3>
        <p className="text-sm text-[var(--fg-secondary)] mb-2">{org}</p>
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-[var(--fg-secondary)] leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});
