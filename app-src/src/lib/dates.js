/** Date helpers for the plan's periods and review cadence. */

const DAY = 24 * 60 * 60 * 1000;

/** Today at local midnight, so comparisons ignore the time of day. */
export function today() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function parseDate(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** The period containing `date`, or null when the date falls outside the plan. */
export function periodFor(periods, date = today()) {
  return periods.find((p) => {
    const start = parseDate(p.start);
    const end = parseDate(p.end);
    return start && end && date >= start && date <= end;
  }) ?? null;
}

/**
 * Where `date` sits in the plan when it falls outside every period: 'before'
 * the first, 'after' the last, or null when it is inside one.
 */
export function positionOutside(periods, date = today()) {
  if (!periods.length || periodFor(periods, date)) return null;
  const first = parseDate(periods[0].start);
  const last = parseDate(periods[periods.length - 1].end);
  if (first && date < first) return 'before';
  if (last && date > last) return 'after';
  return null;
}

/** How far through a period `date` is, 0–1. */
export function periodProgress(period, date = today()) {
  const start = parseDate(period.start);
  const end = parseDate(period.end);
  if (!start || !end || end <= start) return 0;
  const span = end - start;
  return Math.min(1, Math.max(0, (date - start) / span));
}

/** Whole days from `date` to the period's end; negative once it has passed. */
export function daysRemaining(period, date = today()) {
  const end = parseDate(period.end);
  if (!end) return null;
  return Math.round((end - date) / DAY);
}

/** Whole days from today until `iso`; negative once it has passed. */
export function daysUntil(iso, date = today()) {
  const target = parseDate(iso);
  if (!target) return null;
  return Math.round((target - date) / DAY);
}

/** '31 Dec 2027' — the plan document's date style. */
export function formatDate(iso) {
  const d = parseDate(iso);
  if (!d) return '—';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
