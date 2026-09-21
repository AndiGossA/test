import { useEffect, useState } from 'react';
import { countByPlan, listByPlan } from './data/db.js';
import { seedIfEmpty } from './data/seed.js';
import { daysUntil, formatDate, daysRemaining, periodFor, periodProgress, positionOutside } from './lib/dates.js';

const SCREENS = ['Dashboard', 'Timeline', 'Budget', 'Goals', 'Career', 'Skills', 'Reviews', 'Settings'];

export default function App() {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [screen, setScreen] = useState('Dashboard');
  const [periods, setPeriods] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    (async () => {
      try {
        await seedIfEmpty();
        const [loadedPeriods, vision] = await Promise.all([
          listByPlan('periods'),
          listByPlan('vision'),
        ]);
        const entries = await Promise.all(
          ['financialMilestones', 'personalGoals', 'careerMilestones', 'skillMilestones']
            .map(async (store) => [store, await countByPlan(store)]),
        );
        setPeriods(loadedPeriods);
        setPriorities(vision.filter((v) => v.category === 'Top priority'));
        setCounts(Object.fromEntries(entries));
        setStatus('ready');
      } catch (e) {
        setError(e);
        setStatus('error');
      }
    })();
  }, []);

  if (status === 'loading') return <Shell><p className="lede">Loading your plan…</p></Shell>;

  if (status === 'error') {
    return (
      <Shell>
        <h2>Couldn't open your plan</h2>
        <p className="lede">
          The browser wouldn't open its local database. Private browsing or blocked
          site data will do this — the app keeps everything on this device, so it
          needs storage access.
        </p>
        <pre className="error-detail">{String(error)}</pre>
      </Shell>
    );
  }

  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <a className="wordmark" href="#top"><span className="dot" /> Lifestyle Plan</a>
          <nav className="nav">
            {SCREENS.map((name) => (
              <a
                key={name}
                href={`#${name.toLowerCase()}`}
                className={name === screen ? 'is-current' : undefined}
                onClick={(e) => { e.preventDefault(); setScreen(name); }}
              >
                {name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <main className="wrap app-main" id="top">
        {screen === 'Dashboard' && (
          <Dashboard periods={periods} priorities={priorities} counts={counts} />
        )}
        {screen === 'Timeline' && <Timeline periods={periods} />}
        {!['Dashboard', 'Timeline'].includes(screen) && <Placeholder screen={screen} />}
      </main>
    </>
  );
}

function Shell({ children }) {
  return <main className="wrap app-main">{children}</main>;
}

function Dashboard({ periods, priorities, counts }) {
  const current = periodFor(periods);
  const outside = positionOutside(periods);
  const filled = priorities.filter((p) => p.text.trim());

  return (
    <>
      <div className="section-head">
        <span className="tag">Where you are</span>
        <h2>Dashboard</h2>
        <p>Your current quarter, what you've set as priorities, and what the plan is tracking.</p>
      </div>

      {current ? (
        <div className="card current-quarter">
          <span className="num">{current.label}</span>
          <h3>{current.theme}</h3>
          <Meter value={periodProgress(current)} />
          <p className="meter-caption">
            {Math.round(periodProgress(current) * 100)}% through the quarter ·{' '}
            {daysRemaining(current)} days remaining
          </p>
        </div>
      ) : (
        <div className="card">
          <h3>{outside === 'before' ? 'The plan hasn’t started yet' : 'The plan period has ended'}</h3>
          <p>
            {outside === 'before'
              ? `${periods[0]?.label} begins on ${formatDate(periods[0]?.start)} — ${daysUntil(periods[0]?.start)} days away. Good time to fill in your vision and priorities.`
              : 'Time to review the whole period and plan what comes next.'}
          </p>
        </div>
      )}

      <h3 className="block-heading">Top priorities</h3>
      {filled.length ? (
        <div className="rows">
          {filled.map((p, i) => (
            <div className="row" key={p.id}>
              <div className="row-key">{`0${i + 1}`}</div>
              <div className="row-value">{p.text}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card empty">
          <p>
            No priorities set yet. The plan asks for three for this period — they'll
            pin here once the Dashboard editor lands in the next phase.
          </p>
        </div>
      )}

      <h3 className="block-heading">What the plan is tracking</h3>
      <div className="facts">
        <div className="fact"><div className="n">{counts.financialMilestones ?? 0}</div><div className="l">Financial</div></div>
        <div className="fact"><div className="n">{counts.personalGoals ?? 0}</div><div className="l">Personal</div></div>
        <div className="fact"><div className="n">{counts.careerMilestones ?? 0}</div><div className="l">Career</div></div>
        <div className="fact"><div className="n">{counts.skillMilestones ?? 0}</div><div className="l">Skills</div></div>
      </div>
    </>
  );
}

function Timeline({ periods }) {
  const current = periodFor(periods);
  return (
    <>
      <div className="section-head">
        <span className="tag">The shape of it</span>
        <h2>Five quarters, one direction</h2>
        <p>Q4 2026 through Q4 2027 — {periods.length} quarters from foundation to the annual review.</p>
      </div>
      <div className="rail">
        <div className="rail-steps" style={{ '--rail-count': periods.length }}>
          {periods.map((p) => (
            <div className={`step${p.id === current?.id ? ' is-current' : ''}`} key={p.id}>
              <div className="step-label">{p.label}</div>
              <div className="step-body">{p.theme}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Placeholder({ screen }) {
  return (
    <>
      <div className="section-head">
        <span className="tag">Coming next</span>
        <h2>{screen}</h2>
        <p>
          The data layer behind this screen is seeded and ready — the editing views
          arrive in the next phase.
        </p>
      </div>
    </>
  );
}

function Meter({ value }) {
  const pct = Math.round(value * 100);
  return (
    <div
      className="meter"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progress through the current quarter"
    >
      <span className="meter-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
