import React from "react";
import { Card } from "src/components/Card";

const ContactPage: React.FC = () => {
  return (
    <div>
      <Card variant="rounded">
        <div className="prose mx-auto py-4 dark:prose-invert sm:p-6">
          <h1>Contact Us</h1>

          <section>
            <h2>Support</h2>
            <div className="space-y-4">
              <div>
                <p>For bug reports, suggestions, and general inquiries:</p>
                <a
                  href="mailto:business@apollo.now"
                  className="text-primary-600 dark:text-accent-blue hover:underline"
                >
                  business@apollo.now
                </a>
              </div>

              <div>
                <h3>Investor Relations</h3>
                <a
                  href="mailto:jordan@apollo.now"
                  className="text-primary-600 dark:text-accent-blue hover:underline"
                >
                  jordan@apollo.now
                </a>
              </div>
            </div>
          </section>
        </div>
      </Card>
    </div>
  );
};

export default ContactPage;
