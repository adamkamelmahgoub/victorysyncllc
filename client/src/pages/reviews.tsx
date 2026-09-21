import { useSeo } from '@/hooks/useSeo';
import ReviewRequest from '@/components/review-request';
import ClutchWidget from '@/components/clutch-widget';

export default function Reviews() {
  useSeo({ title: 'Reviews | VictorySync', description: 'Share your experience working with VictorySync on Google or Clutch.' });
  return <div className="min-h-screen bg-slate-50 py-20">
    <div className="mx-auto max-w-4xl space-y-8 px-5 sm:px-8">
      <header>
        <h1 className="text-4xl font-bold text-slate-900">VictorySync reviews</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">We welcome honest feedback from everyone who has worked with our team. Share your experience on the platform you prefer.</p>
      </header>
      <ReviewRequest />
      <ClutchWidget key="reviews-clutch" />
    </div>
  </div>;
}
