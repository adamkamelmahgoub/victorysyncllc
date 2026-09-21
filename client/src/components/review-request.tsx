import { CLUTCH_REVIEW_URL, GOOGLE_REVIEW_URL } from '@/lib/site-config';

export default function ReviewRequest() {
  return <section aria-labelledby="review-request-heading" className="rounded-lg border border-slate-200 bg-white p-6 text-slate-900">
    <h2 id="review-request-heading" className="text-xl font-semibold">Share your experience</h2>
    <p className="mt-2 text-sm text-slate-600">Worked with VictorySync? Your honest review helps other businesses learn about us.</p>
    <div className="mt-5 flex flex-wrap gap-3">
      <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener nofollow" className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Review us on Google</a>
      <a href={CLUTCH_REVIEW_URL} target="_blank" rel="noopener nofollow" className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50">Review us on Clutch</a>
    </div>
  </section>;
}
