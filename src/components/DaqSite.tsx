import {useState} from 'react';

/**
 * Clone of the DAQ Consulting marketing site (daqconsulting.com).
 * Design tokens mirror the original: paper #f4f3ee / ink #141414 for light
 * sections, #0a0b0c / #eeeeeb for dark sections, Inter + system mono.
 */

const INK_DARK = '#eeeeeb';
const BG_DARK = '#0a0b0c';
const INK_LIGHT = '#141414';
const BG_LIGHT = '#f4f3ee';
const SECONDARY_DARK = '#a5a5a0';
const SECONDARY_LIGHT = '#585854';
const RULE_DARK = '#343434';
const RULE_LIGHT = '#c4c4bf';
const MONO =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';
const SANS = 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif';

const NAV_LINKS = ['Services', 'Outcomes', 'About', 'Careers'];

const CORE_STAGES = [
  {
    n: '01',
    title: 'Ingest',
    body: 'Every source lands raw and immutable. Nothing is lost, nothing is trusted yet.',
  },
  {
    n: '02',
    title: 'Refine',
    body: 'Cleansed, deduplicated, modelled. One schema the whole company can read.',
  },
  {
    n: '03',
    title: 'Serve',
    body: 'Dashboards, models and agents draw from the same governed products.',
  },
  {
    n: '04',
    title: 'Govern',
    body: 'Metadata drives orchestration. Every run is traceable, every change is versioned.',
  },
];

const DATA_PLANE = [
  {
    title: 'Source Systems',
    meta: 'REST / JDBC',
    body: 'Internal databases, external APIs, and IoT streams providing raw data ingestion.',
  },
  {
    title: 'Raw Layer',
    meta: 'Parquet / JSON',
    body: 'Immutable landing zone. Stores history in original format with append-only strategy.',
  },
  {
    title: 'Curated Layer',
    meta: 'Delta Lake',
    body: 'Cleansed, deduplicated, and validated data. Enforces enterprise schema and data quality.',
  },
  {
    title: 'Semantic Layer',
    meta: 'Star Schema',
    body: 'Business-level aggregates and dimensional models optimized for high-performance querying.',
  },
  {
    title: 'Analytics & AI',
    meta: 'BI / API',
    body: 'Dashboards, ML models, and downstream applications consuming trusted data products.',
  },
];

const CONTROL_PLANE = [
  {
    title: 'Metadata Store',
    meta: 'Relational DB',
    body: 'Centralized repository for pipeline configurations, watermarks, and lineage tracking.',
  },
  {
    title: 'Orchestration Engine',
    meta: 'Pipeline Runner',
    body: 'Workflow manager that triggers processing jobs based on metadata and events.',
  },
];

const CAPABILITIES = [
  {
    n: '01',
    title: 'Data Engineering',
    body: 'Reliable batch and streaming pipelines, governed lakehouses, and trusted data for reporting and AI.',
    tags: [
      'Databricks',
      'Microsoft Fabric',
      'Azure Data Factory',
      'dbt',
      'Delta Lake',
    ],
  },
  {
    n: '02',
    title: 'AI Engineering',
    body: 'Production AI systems with permission-aware retrieval, controlled agent workflows, evaluation and observability.',
    tags: ['LLM Agents', 'RAG', 'MCP', 'Evaluation'],
  },
  {
    n: '03',
    title: 'Analytics',
    body: 'One governed semantic model behind every report. Power BI structures that end fragmented business logic for good.',
    tags: [
      'Power BI',
      'Semantic Models',
      'TMDL',
      'DAX',
      'Paginated Reports',
    ],
  },
  {
    n: '04',
    title: 'Migration',
    body: 'AI recovers the intent inside your legacy estate; engineers approve editable Databricks and Power BI artifacts. Evidence travels with every object.',
    tags: [
      'Synapse to Databricks',
      'SSRS to Power BI on Fabric',
      'AI-accelerated',
      'Engineer-approved',
    ],
  },
  {
    n: '05',
    title: 'Managed Services',
    body: 'Reliability as a service. We keep your platforms optimized so you can focus on scale and innovation.',
    tags: ['Observability', 'Cost Optimization', 'SLA Operations', 'Governance'],
  },
];

const HERO_CHIPS = ['Structure', 'Governed', 'Scalable', 'Decision-grade'];

function Eyebrow({
  children,
  tone = 'dark',
}: {
  children: React.ReactNode;
  tone?: 'dark' | 'light';
}) {
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: 11,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: tone === 'dark' ? SECONDARY_DARK : SECONDARY_LIGHT,
      }}>
      {children}
    </span>
  );
}

export default function DaqSite() {
  const [sound, setSound] = useState(false);
  const [stage, setStage] = useState(2);
  const [openCap, setOpenCap] = useState(0);

  const allNodes = [...DATA_PLANE, ...CONTROL_PLANE];

  return (
    <div
      style={{
        background: BG_DARK,
        color: INK_DARK,
        fontFamily: SANS,
        minHeight: '100%',
        overflowX: 'hidden',
      }}>
      <style>{`
        .daq-nav-link { position: relative; color: ${SECONDARY_DARK}; text-decoration: none; transition: color .3s cubic-bezier(.22,1,.36,1); }
        .daq-nav-link:hover { color: ${INK_DARK}; }
        .daq-pill { transition: background .3s cubic-bezier(.22,1,.36,1), color .3s cubic-bezier(.22,1,.36,1), border-color .3s; }
        .daq-pill:hover { background: ${INK_DARK}; color: ${BG_DARK}; border-color: ${INK_DARK}; }
        .daq-pill-invert:hover { background: ${INK_LIGHT}; color: ${BG_LIGHT}; border-color: ${INK_LIGHT}; }
        .daq-node { transition: border-color .3s, background .3s; }
        .daq-node:hover { border-color: ${SECONDARY_DARK}; }
        .daq-cap { transition: background .3s; }
        .daq-cap:hover { background: rgba(255,255,255,0.02); }
        .daq-foot-link { color: ${SECONDARY_DARK}; text-decoration: none; transition: color .3s; }
        .daq-foot-link:hover { color: ${INK_DARK}; }
        @media (max-width: 860px) {
          .daq-nav-links, .daq-hero-chips { display: none !important; }
          .daq-grid-4 { grid-template-columns: 1fr 1fr !important; }
          .daq-grid-plane { grid-template-columns: 1fr !important; }
          .daq-foot-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ── Header ─────────────────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          padding: '20px clamp(20px, 5vw, 64px)',
          background: 'rgba(10,11,12,0.82)',
          backdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${RULE_DARK}`,
        }}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: '-0.02em',
            }}>
            DAQ
          </span>
          <Eyebrow>Data &amp; AI</Eyebrow>
        </div>

        <nav
          className="daq-nav-links"
          style={{display: 'flex', alignItems: 'center', gap: 32}}>
          {NAV_LINKS.map((l) => (
            <a
              key={l}
              className="daq-nav-link"
              href={`#${l.toLowerCase()}`}
              style={{fontSize: 14}}>
              {l}
            </a>
          ))}
        </nav>

        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <button
            onClick={() => setSound((s) => !s)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: SECONDARY_DARK,
            }}>
            Sound
            <span style={{color: sound ? INK_DARK : SECONDARY_DARK}}>
              {sound ? 'On' : 'Off'}
            </span>
          </button>
          <a
            className="daq-pill"
            href="#start"
            style={{
              fontSize: 13,
              textDecoration: 'none',
              color: INK_DARK,
              border: `1px solid ${RULE_DARK}`,
              borderRadius: 999,
              padding: '9px 20px',
            }}>
            Start Project
          </a>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section
        style={{
          padding:
            'clamp(72px, 12vh, 140px) clamp(20px, 5vw, 64px) clamp(56px, 9vh, 104px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 40,
        }}>
        <Eyebrow>Data &amp; AI Engineering</Eyebrow>
        <h1
          style={{
            margin: 0,
            fontSize: 'clamp(44px, 9.5vw, 148px)',
            lineHeight: 0.92,
            letterSpacing: '-0.04em',
            fontWeight: 500,
            maxWidth: '18ch',
          }}>
          We Architect
          <br />
          Intelligence.
        </h1>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 32,
            borderTop: `1px solid ${RULE_DARK}`,
            paddingTop: 32,
          }}>
          <p
            style={{
              margin: 0,
              maxWidth: '46ch',
              fontSize: 'clamp(15px, 1.3vw, 18px)',
              lineHeight: 1.6,
              color: SECONDARY_DARK,
            }}>
            Data and AI engineering. We design, build and run the platforms
            behind a company&rsquo;s analytics and AI.
          </p>
          <a
            className="daq-pill"
            href="#core"
            style={{
              fontSize: 14,
              textDecoration: 'none',
              color: INK_DARK,
              border: `1px solid ${RULE_DARK}`,
              borderRadius: 999,
              padding: '14px 28px',
              whiteSpace: 'nowrap',
            }}>
            Explore The Core
          </a>
        </div>
        <div
          className="daq-hero-chips"
          style={{display: 'flex', flexWrap: 'wrap', gap: 10}}>
          {HERO_CHIPS.map((c) => (
            <span
              key={c}
              style={{
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: SECONDARY_DARK,
                border: `1px solid ${RULE_DARK}`,
                borderRadius: 999,
                padding: '7px 14px',
              }}>
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* ── Manifesto (paper) ──────────────────────────────── */}
      <section
        style={{
          background: BG_LIGHT,
          color: INK_LIGHT,
          padding:
            'clamp(80px, 14vh, 168px) clamp(20px, 5vw, 64px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 48,
        }}>
        <Eyebrow tone="light">Manifesto</Eyebrow>
        <h2
          style={{
            margin: 0,
            fontSize: 'clamp(38px, 7vw, 104px)',
            lineHeight: 0.98,
            letterSpacing: '-0.035em',
            fontWeight: 500,
            maxWidth: '20ch',
          }}>
          Intelligence requires Structure.
        </h2>
        <p
          style={{
            margin: 0,
            maxWidth: '34ch',
            marginLeft: 'auto',
            fontSize: 'clamp(20px, 2.6vw, 34px)',
            lineHeight: 1.35,
            letterSpacing: '-0.01em',
            color: INK_LIGHT,
          }}>
          We transform the chaotic ocean of enterprise data into the governed,
          scalable fuel that powers decision-grade AI.
        </p>
      </section>

      {/* ── 01 Neural Core ─────────────────────────────────── */}
      <section
        id="core"
        style={{
          padding: 'clamp(80px, 13vh, 152px) clamp(20px, 5vw, 64px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 56,
        }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 24,
          }}>
          <Eyebrow>01 / System Architecture</Eyebrow>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(34px, 5.4vw, 76px)',
              lineHeight: 1,
              letterSpacing: '-0.035em',
              fontWeight: 500,
            }}>
            The Neural Core.
          </h2>
        </div>

        <div
          className="daq-grid-4"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
            background: RULE_DARK,
            border: `1px solid ${RULE_DARK}`,
          }}>
          {CORE_STAGES.map((s) => (
            <div
              key={s.n}
              style={{
                background: BG_DARK,
                padding: '28px 24px 36px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}>
              <Eyebrow>{s.n}</Eyebrow>
              <h3
                style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                }}>
                {s.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: SECONDARY_DARK,
                }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>

        {/* Platform diagram */}
        <div
          style={{
            border: `1px solid ${RULE_DARK}`,
            padding: 'clamp(20px, 3vw, 40px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
          }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}>
            <Eyebrow>Modern Data Platform</Eyebrow>
            <Eyebrow>Control Plane · Data Plane</Eyebrow>
          </div>

          <div>
            <p
              style={{
                margin: '0 0 14px',
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: SECONDARY_DARK,
              }}>
              Unified Data Plane
            </p>
            <div
              className="daq-grid-plane"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 12,
              }}>
              {DATA_PLANE.map((node, i) => {
                const active = stage === i;
                return (
                  <button
                    key={node.title}
                    className="daq-node"
                    onClick={() => setStage(i)}
                    style={{
                      textAlign: 'left',
                      cursor: 'pointer',
                      background: active ? '#16181a' : 'transparent',
                      border: `1px solid ${active ? SECONDARY_DARK : RULE_DARK}`,
                      color: INK_DARK,
                      padding: '18px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      font: 'inherit',
                    }}>
                    <span style={{fontSize: 15, fontWeight: 500}}>
                      {node.title}
                    </span>
                    <Eyebrow>{node.meta}</Eyebrow>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p
              style={{
                margin: '0 0 14px',
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: SECONDARY_DARK,
              }}>
              Control Plane
            </p>
            <div
              className="daq-grid-plane"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12,
              }}>
              {CONTROL_PLANE.map((node, i) => {
                const idx = DATA_PLANE.length + i;
                const active = stage === idx;
                return (
                  <button
                    key={node.title}
                    className="daq-node"
                    onClick={() => setStage(idx)}
                    style={{
                      textAlign: 'left',
                      cursor: 'pointer',
                      background: active ? '#16181a' : 'transparent',
                      border: `1px solid ${active ? SECONDARY_DARK : RULE_DARK}`,
                      color: INK_DARK,
                      padding: '18px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      font: 'inherit',
                    }}>
                    <span style={{fontSize: 15, fontWeight: 500}}>
                      {node.title}
                    </span>
                    <Eyebrow>{node.meta}</Eyebrow>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              borderTop: `1px solid ${RULE_DARK}`,
              paddingTop: 24,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 24,
            }}>
            <p
              style={{
                margin: 0,
                maxWidth: '62ch',
                fontSize: 15,
                lineHeight: 1.6,
                color: SECONDARY_DARK,
              }}>
              <span style={{color: INK_DARK}}>{allNodes[stage].title}</span>
              {' — '}
              {allNodes[stage].body}
            </p>
            <Eyebrow>Tap a stage to inspect</Eyebrow>
          </div>
        </div>
      </section>

      {/* ── 02 Capabilities ────────────────────────────────── */}
      <section
        id="services"
        style={{
          padding: 'clamp(80px, 13vh, 152px) clamp(20px, 5vw, 64px)',
          borderTop: `1px solid ${RULE_DARK}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 56,
        }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 24,
          }}>
          <Eyebrow>02 / System Capabilities</Eyebrow>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(34px, 5.4vw, 76px)',
              lineHeight: 1,
              letterSpacing: '-0.035em',
              fontWeight: 500,
            }}>
            Engineered for Scale.
          </h2>
        </div>

        <div style={{borderTop: `1px solid ${RULE_DARK}`}}>
          {CAPABILITIES.map((cap, i) => {
            const open = openCap === i;
            return (
              <div
                key={cap.n}
                className="daq-cap"
                style={{borderBottom: `1px solid ${RULE_DARK}`}}>
                <button
                  onClick={() => setOpenCap(open ? -1 : i)}
                  aria-expanded={open}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 24,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: INK_DARK,
                    font: 'inherit',
                    padding: '28px 4px',
                    textAlign: 'left',
                  }}>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 24,
                    }}>
                    <Eyebrow>{cap.n}</Eyebrow>
                    <span
                      style={{
                        fontSize: 'clamp(24px, 3.4vw, 44px)',
                        letterSpacing: '-0.03em',
                        fontWeight: 500,
                        color: open ? INK_DARK : SECONDARY_DARK,
                      }}>
                      {cap.title}
                    </span>
                  </span>
                  <Eyebrow>{open ? 'Close' : 'Explore'}</Eyebrow>
                </button>

                {open && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 32,
                      justifyContent: 'space-between',
                      padding: '0 4px 32px',
                    }}>
                    <p
                      style={{
                        margin: 0,
                        maxWidth: '52ch',
                        fontSize: 'clamp(15px, 1.3vw, 18px)',
                        lineHeight: 1.6,
                        color: SECONDARY_DARK,
                      }}>
                      {cap.body}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 8,
                        alignContent: 'flex-start',
                        maxWidth: 420,
                      }}>
                      {cap.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontFamily: MONO,
                            fontSize: 11,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: SECONDARY_DARK,
                            border: `1px solid ${RULE_DARK}`,
                            borderRadius: 999,
                            padding: '6px 13px',
                          }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Invitation (paper) ─────────────────────────────── */}
      <section
        id="start"
        style={{
          background: BG_LIGHT,
          color: INK_LIGHT,
          padding: 'clamp(80px, 14vh, 168px) clamp(20px, 5vw, 64px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 40,
        }}>
        <h2
          style={{
            margin: 0,
            fontSize: 'clamp(40px, 7.5vw, 112px)',
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
            fontWeight: 500,
            maxWidth: '16ch',
          }}>
          Bring the complexity.
          <br />
          Let&rsquo;s build.
        </h2>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 32,
            borderTop: `1px solid ${RULE_LIGHT}`,
            paddingTop: 32,
          }}>
          <p
            style={{
              margin: 0,
              maxWidth: '44ch',
              fontSize: 'clamp(15px, 1.3vw, 18px)',
              lineHeight: 1.6,
              color: SECONDARY_LIGHT,
            }}>
            Data platforms, analytics and AI. Tell us what needs to work better.
          </p>
          <a
            className="daq-pill daq-pill-invert"
            href="mailto:hello@daqconsulting.com"
            style={{
              fontSize: 15,
              textDecoration: 'none',
              color: INK_LIGHT,
              border: `1px solid ${RULE_LIGHT}`,
              borderRadius: 999,
              padding: '16px 34px',
              whiteSpace: 'nowrap',
            }}>
            Start a project
          </a>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer
        style={{
          padding: 'clamp(64px, 10vh, 112px) clamp(20px, 5vw, 64px) 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 64,
        }}>
        <div
          className="daq-foot-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 40,
          }}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
            <Eyebrow>01 / Services</Eyebrow>
            {CAPABILITIES.map((c) => (
              <a
                key={c.title}
                className="daq-foot-link"
                href="#services"
                style={{fontSize: 15}}>
                {c.title}
              </a>
            ))}
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
            <Eyebrow>02 / Company</Eyebrow>
            {['Outcomes', 'About', 'Careers', 'LinkedIn'].map((l) => (
              <a
                key={l}
                className="daq-foot-link"
                href={`#${l.toLowerCase()}`}
                style={{fontSize: 15}}>
                {l}
              </a>
            ))}
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
            <Eyebrow>03 / DAQ Consulting</Eyebrow>
            <span style={{fontSize: 24, fontWeight: 500}}>
              Intelligence Architects.
            </span>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.6,
                color: SECONDARY_DARK,
              }}>
              Architecting enterprise-grade data platforms and autonomous
              frameworks. We transform raw complexity into pure operational
              intelligence.
            </p>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
            <Eyebrow>04 / Record</Eyebrow>
            <span style={{fontSize: 14, color: SECONDARY_DARK}}>
              © 2026 DAQ Consulting
            </span>
            <a className="daq-foot-link" href="#privacy" style={{fontSize: 14}}>
              Privacy Policy
            </a>
            <a className="daq-foot-link" href="#terms" style={{fontSize: 14}}>
              Terms of Use
            </a>
          </div>
        </div>

        <div
          style={{
            borderTop: `1px solid ${RULE_DARK}`,
            paddingTop: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
          }}>
          <span style={{fontSize: 56, fontWeight: 600, letterSpacing: '-0.04em'}}>
            DAQ
          </span>
          <a className="daq-foot-link" href="#top" style={{fontSize: 14}}>
            Top
          </a>
        </div>
      </footer>
    </div>
  );
}
