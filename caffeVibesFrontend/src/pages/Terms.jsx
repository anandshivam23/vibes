import React from 'react';

export default function Terms() {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-display font-bold text-text-main mb-6">Terms & Conditions</h1>
      <div className="bg-surface border border-surface-hover p-8 rounded-2xl shadow-xl space-y-8">
        <section>
          <h2 className="text-2xl font-display font-bold text-text-main mb-4">1. Acceptance of Terms</h2>
          <p className="text-text-muted leading-relaxed">
            By accessing and using Caffe Vibes, you accept and agree to be bound by the terms and provision of this agreement.
            If you do not agree to abide by these terms, please do not use this service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-text-main mb-4">2. Community Guidelines</h2>
          <p className="text-text-muted leading-relaxed">
            Caffe Vibes is a welcoming community for coffee lovers. We expect all users to treat each other with respect.
            Any form of harassment, hate speech, or inappropriate imagery will result in immediate account termination.
            Keep the content focused on coffee, café culture, and positive vibes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-text-main mb-4">3. Content Ownership</h2>
          <p className="text-text-muted leading-relaxed">
            You retain all rights to the videos, images, and text you upload to Caffe Vibes. By posting content, you grant us a non-exclusive,
            royalty-free license to display, distribute, and promote your content within the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold text-text-main mb-4">4. Privacy & Data</h2>
          <p className="text-text-muted leading-relaxed">
            Your privacy is important to us. We securely store your profile information and do not sell your personal data to third parties.
            Authentic interactions are the cornerstone of our platform.
          </p>
        </section>
      </div>
    </div>
  );
}
