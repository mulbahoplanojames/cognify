import { FeatureRequestForm } from '@/components/feature-request/feature-request-form';

export default function FeatureRequestPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Share Your Ideas
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            We value your feedback and ideas. Let us know what features you'd like to see in Cognify!
          </p>
        </div>
      </section>

      {/* Feature Request Form */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-card rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Request a Feature or Share Feedback
          </h2>
          <p className="text-muted-foreground mb-8">
            Your feedback helps us improve Cognify. Please provide as much detail as possible about the feature you're requesting or the feedback you'd like to share.
          </p>
          
          <FeatureRequestForm />
        </div>
      </section>
    </div>
  );
}
