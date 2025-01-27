import React from "react";
import { Card } from "src/components/Card";
import { Navlinks } from "src/components/Navlinks";

interface PrivacySection {
  title: string;
  content: string[];
}

const PrivacyPage: React.FC = () => {
  const sections: PrivacySection[] = [
    {
      title: "Introduction",
      content: [
        "Last updated: April 25, 2024",
        "This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.",
        "We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.",
      ],
    },
    {
      title: "Definitions",
      content: [
        "• Account: A unique account created for You to access our Service",
        "• Affiliate: An entity that controls, is controlled by or is under common control with a party",
        "• Application: Apollo, the software program provided by the Company",
        "• Company: Apollo Fantasy Inc., located at 5029 Graystone Estates Drive",
        "• Cookies: Small files placed on Your device containing browsing details",
        "• Country: North Carolina, United States",
        "• Personal Data: Information relating to an identified or identifiable individual",
        "• Service: The Application or Website or both",
        "• Website: Apollo, accessible from https://yoapollo.com/",
      ],
    },
    {
      title: "Types of Data Collected",
      content: [
        "Personal Data",
        "While using Our Service, We may collect:",
        "• Email address",
        "• First name and last name",
        "• Phone number",
        "• Address details",
        "",
        "Usage Data",
        "We automatically collect:",
        "• IP address",
        "• Browser type and version",
        "• Pages visited and time spent",
        "• Device information",
        "• Access timestamps",
        "",
        "Mobile Device Data",
        "When using a mobile device, we may collect:",
        "• Device type and ID",
        "• Operating system",
        "• Unique identifiers",
        "• Mobile network information",
      ],
    },
    {
      title: "Use of Your Personal Data",
      content: [
        "We use your data to:",
        "• Provide and maintain our Service",
        "• Manage your account",
        "• Contact you about updates and changes",
        "• Process your transactions",
        "• Improve our service",
        "• Analyze usage patterns",
        "• Detect and prevent fraud",
      ],
    },
    {
      title: "Data Retention",
      content: [
        "We retain your Personal Data only as long as necessary for:",
        "• Providing our services",
        "• Complying with legal obligations",
        "• Resolving disputes",
        "• Enforcing agreements",
      ],
    },
    {
      title: "Data Security",
      content: [
        "We implement reasonable security measures to protect your data, but no method of transmission over the Internet or electronic storage is 100% secure.",
      ],
    },
    {
      title: "GDPR Rights",
      content: [
        "If you are in the EEA, you have these rights:",
        "• Access your data",
        "• Correct your data",
        "• Delete your data",
        "• Object to processing",
        "• Data portability",
        "• Withdraw consent",
      ],
    },
    {
      title: "Cookies Policy",
      content: [
        "We use different types of cookies:",
        "• Essential cookies: Required for basic site functionality",
        "• Functional cookies: Remember your preferences",
        "• Analytics cookies: Help us understand site usage",
        "• Advertising cookies: Deliver relevant ads",
        "",
        "You can control cookies through your browser settings.",
      ],
    },
    {
      title: "Children's Privacy",
      content: [
        "Our Service does not address anyone under 13. We do not knowingly collect data from children under 13.",
        "If you are a parent and discover your child has provided us data, contact us. We will remove such data from our servers.",
      ],
    },
    {
      title: "Changes to Privacy Policy",
      content: [
        "We may update this Privacy Policy periodically. We will notify you of any changes by:",
        "• Posting the new Privacy Policy",
        "• Sending an email notification",
        "• Displaying a notice on our Service",
        "",
        "You should review this Privacy Policy periodically for changes.",
      ],
    },
    {
      title: "Contact Us",
      content: [
        "For questions about this Privacy Policy, contact us:",
        "Email: business@yoapollo.com",
      ],
    },
  ];

  return (
    <div>
      <Card variant="rounded">
        <div className="prose mx-auto py-4 dark:prose-invert sm:p-6">
          <h1>Privacy Policy</h1>

          {sections.map((section, index) => (
            <section key={index} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
              <div className="space-y-2">
                {section.content.map((paragraph, pIndex) => (
                  <p
                    key={pIndex}
                    className={`text-gray-800 dark:text-gray-200 ${
                      paragraph.startsWith("•") ? "ml-4" : ""
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <div className="text-sm text-gray-500 mt-8">
            This Privacy Policy is effective as of April 25, 2024
          </div>
        </div>
      </Card>
      <Navlinks type="homeFooter" />
    </div>
  );
};

export default PrivacyPage;
