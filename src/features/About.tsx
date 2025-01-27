import React from "react";
import { Card } from "src/components/Card";

interface FAQItem {
  question: string;
  answer: string;
}

const AboutPage: React.FC = () => {
  const faqs: FAQItem[] = [
    {
      question: "How do I get started?",
      answer:
        "Simply sign up using the button at the top right of the screen. You can then customize your profile and start following other users, spaces, or tags.",
    },
    {
      question: "What are Spaces?",
      answer:
        "Spaces are game-specific communities to post into.  Simply type s/ and the space's ID and your post will be delivered to the space as well as the timelines of users who follow it.",
    },
    {
      question: "What Esports do you offer scores and stats for?",
      answer:
        "We currently provide support for League of Legends esports information. We plan to expand to other major esports titles as soon as possible.",
    },
    {
      question: "Do I need an account for Esports?",
      answer:
        "Not necessarily! We'd love for you to make an account, but if you just want to view scores, you can do that without an account.",
    },
  ];

  return (
    <div>
      <Card variant="rounded">
        <div className="prose mx-auto py-4 dark:prose-invert sm:p-6">
          <h1>About Apollo</h1>
          <section>
            <p>
              Apollo is a complete solution for the millions in the gaming and
              esports communities who remain largely under-served. We are a
              gaming social network, media ecosystem, and esports information
              library in one application.
            </p>
          </section>

          <section>
            <h2>FAQ</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>Roadmap</h2>
            <ul>
              <li>More social features!</li>
              <li>Fantasy esports offerings</li>
              <li>Expanded esports coverage into other titles</li>
              <li>Improved search functionality</li>
              <li>Enhanced mobile experience</li>
              <li>Bug fixes and quality-of-life improvements</li>
            </ul>
          </section>

          <section
            className="text-xs text-gray-500 pl-96
           mt-8"
          >
            <a
              href="https://github.com/jacobfranco/apollo-react"
              className="hover:text-gray-700 dark:hover:text-gray-400"
            >
              Source
            </a>
          </section>
        </div>
      </Card>
    </div>
  );
};

export default AboutPage;
