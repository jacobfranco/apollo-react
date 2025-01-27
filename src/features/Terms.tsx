import React from "react";
import { Card } from "src/components/Card";

const TermsPage: React.FC = () => {
  const sections = [
    {
      title: "Apollo Prerogatives",
      content: [
        "Apollo reserves the right to:",
        "• Terminate any account for any reason, even if the offending account does not strictly violate any previously outlined site rules. Apollo's Site Rules can be modified due to any behavior not previously enumerated, so any offense not specifically stated to be forbidden can be regarded as the impetus for a future rule change",
        "• Terminate any account subsequently created by a user after receiving a suspension or termination",
      ],
    },
    {
      title: "Bot Policy",
      content: [
        "Automated accounts not formally disclosed as bots to Apollo are forbidden and will be terminated with no possibility of review.",
      ],
    },
    {
      title: "Adult Content Restrictions",
      content: [
        "Adult content is defined here as any material depicting nudity or sexual acts, and is mostly prohibited. The following are prohibited on Apollo:",
        "• Material that is ostensibly pornographic in nature, unless it satisfies all of the following conditions:",
        "  - Has some connection to video games or gaming media (eg: cosplays)",
        "  - Marked as sensitive content",
        "  - Not posted to any Spaces or Hashtags",
        "• Any observably pornographic material in response to another user's post, including promotion of adult content",
        "• Obscene and graphic cartoons, manga, drawings, etc. deemed excessive or extreme – does not apply to all art depicting nudity/sexual acts",
        "• Any depictions of illegal sexual acts (eg: sexual violence and CEI), including AI-generated content",
        "• Unsolicited adult material in direct messages, including:",
        "  - Pornographic content",
        "  - Unwarranted sexual advances",
        "",
        "For additional clarity, the following adult content is allowed on Apollo:",
        "• Tasteful nudity relevant to gaming (eg: fanart) not disqualified from stipulations outlined in the prohibited content section",
        "• In-game captures of mods displaying nudity or adult content, unless overly offensive/illegal",
        "• Cosplays that contain nudity, so long as they accurately depict the character (eg: Malenia, Goddess of Rot, from Elden Ring)",
        "• External links to other websites that host adult content (eg: Onlyfans), but limited to:",
        "  - User bios",
        "  - Posts with no Hashtags AND are not in any Spaces",
        "  - Clearly denoted as adult content",
        "",
        "Any violation of the adult content restrictions are subject to account termination.",
      ],
    },
    {
      title: "Violence, Gore, and Sensitive Content",
      content: [
        "Any depiction of real-world violence, gore, or death is strictly prohibited. Apollo's nature as a gaming app makes this stipulation straightforward and violations will result in content removal and/or account closure",
      ],
    },
    {
      title: "Hate Speech and Bigotry",
      content: [
        "Hate speech, including slurs, threats, incitement of violence, or other language that can be interpreted as hateful towards any demographic, are subject to disciplinary action",
        "• Slurs – derogatory terms aimed at other users based off interaction context, including the identity of the involved parties. Aggressive or repeated violations can result in account closure subject to Apollo's discretion",
        "• Targeted threats – threats based off identity are strictly prohibited, even if there is no apparent possibility of the act being carried out. Based on severity, action can range from warnings to law enforcement contact",
        "• Incitement of violence – strictly prohibited, with action ranging from account closure to law enforcement contact",
        "• Any other hateful or bigoted language – all posts and accounts with significant or repeated violations are subject to removal and law enforcement contact",
      ],
    },
    {
      title: "Brigading",
      content: [
        "Encouraging other users to threaten, intimidate, or doxx other users, or engaging in any similar conduct, is strictly prohibited on Apollo",
      ],
    },
    {
      title: "Engagement Baiting",
      content: [
        "Rage Baiting:",
        "Any post clearly trying to garner attention by rage baiting is subject to removal; rage bait unrelated to gaming can result in account review leading to account suspension or termination",
      ],
    },
    {
      title: "Political Discourse",
      content: [
        "• While Apollo is gaming-related by nature, sometimes politics and gaming overlap and it is not fair to censor any free speech (as long as it is protected by the First Amendment, which Hate Speech and Threats are not)",
        "• Political discourse unrelated to gaming is not condoned by Apollo, but users can do as they like, so long as they abide by all other Terms of Service and Rules",
        "• Apollo reserves the right to terminate any account, regardless of political affiliation, and account termination in no way reflects the beliefs of the company, other than adherence to our Terms of Service",
        "• Political-themed accounts, with no tangible relation to gaming, will be terminated",
      ],
    },
    {
      title: "Harassment Policy",
      content: [
        "• Users may not use Apollo to harass, threaten, intimidate, or doxx other users, or engage in any similar conduct",
        "• This includes inciting others to participate in the aforementioned behaviors",
        "• Disciplinary action ranges from warning to account termination and contact with legal authorities, depending on severity",
      ],
    },
    {
      title: "Copyright and Intellectual Property",
      content: [
        "Users must adhere to copyright laws and are prohibited from posting content that infringes on others' intellectual property rights. Violations will be subject to post removal and account review. Repeat violations may result in account termination.",
      ],
    },
    {
      title: "Fantasy Contest Rules",
      content: [
        "• Follow the rules and guidelines of the league, including any draft or scoring rules",
        "• Do not engage in unsportsmanlike behavior or attempt to gain an unfair advantage",
        "• Do not cheat, manipulate the system, or engage in any other unethical behavior",
        "• Respect all other site rules when participating in fantasy contests",
      ],
    },
    {
      title: "Refund Policy",
      content: [
        "• Refunds can be issued through request to participants ONLY IF a Contest has not started OR if a selected Player on a Roster did not participate in a Match after previously being scheduled to do so, and the Roster was set prior to any announced change on that Player's status by the organization they are employed by, regardless of their displayed availability on Apollo",
        "• Refunds will be credited back to the original payment method used at the time of purchase",
        "• Refunds will not be granted for any reason other than those outlined above, and by registering on Apollo, all users agree that they are solely responsible for all losses incurred that are ineligible for refund",
      ],
    },
    {
      title: "General User Responsibilities",
      content: [
        "By using Apollo, users agree to:",
        "• Provide accurate and truthful information when creating accounts or engaging with the platform",
        "• Maintain the confidentiality of their account credentials and notify Apollo immediately of any unauthorized access",
        "• Comply with all applicable local, state, national, and international laws and regulations while using the platform",
        "• Use the platform in good faith and refrain from engaging in behavior that could harm Apollo, its users, or its services",
      ],
    },
    {
      title: "Third-Party Links and Content",
      content: [
        "Users posting links to third-party websites or content are solely responsible for ensuring that such links or content comply with Apollo's rules and applicable laws. Apollo is not responsible for any harm caused by third-party links.",
      ],
    },
    {
      title: "Ownership and Licensing of User Content",
      content: [
        "By posting content on Apollo, users retain ownership of their original content but grant Apollo a non-exclusive, royalty-free, worldwide, perpetual, and irrevocable license to use, display, reproduce, modify, adapt, and distribute the content as necessary to operate and promote the platform.",
        "• This license ends when the user deletes their content or account, except where the content has been shared with others who have not deleted it or where Apollo is legally required to retain it.",
      ],
    },
    {
      title: "Content Violation Process",
      content: [
        "Apollo reserves the right to remove any content that violates the rules outlined in this document. Users will be notified of content removal and may appeal the decision within 14 days by contacting support. Appeals will be reviewed by Apollo within 30 days.",
      ],
    },
    {
      title: "Repeat Offender Policy",
      content: [
        "Accounts with repeated violations of the content rules will be permanently banned without the possibility of appeal.",
      ],
    },
    {
      title: "Disclaimer of Liability",
      content: [
        'Apollo provides its services "as is" and "as available" without any warranties, express or implied. Apollo does not guarantee uninterrupted or error-free operation of the platform and is not liable for:',
        "• Service interruptions, data loss, or errors caused by technical failures, user actions, or external factors",
        "• Content posted by users, including violations of copyright, intellectual property, or other rights",
        "• Third-party actions, including malicious links or external website behavior",
      ],
    },
    {
      title: "Regional and Age-Based Restrictions",
      content: [
        "Apollo's services are intended for users aged 16 years or older. Users under the age of 18 must have parental or guardian consent to use the platform. Certain features of Apollo may not be available in specific regions due to local laws and regulations.",
      ],
    },
    {
      title: "Account Ownership and Transferability",
      content: [
        "Accounts created on Apollo are personal to the user and cannot be transferred or sold to another individual or entity. Apollo retains the right to manage, modify, or delete accounts as necessary to comply with legal obligations or enforce site rules.",
      ],
    },
    {
      title: "Data Management Upon Account Termination",
      content: [
        "• Upon account termination (voluntary or otherwise), Apollo will delete or anonymize user data in accordance with its Privacy Policy, except where retention is required by law",
        "• Users may request access to data associated with their account prior to termination, subject to verification of identity and compliance with applicable laws",
      ],
    },
    {
      title: "Account Recovery",
      content: [
        "Users whose accounts are suspended or terminated may contact support to initiate a recovery request. Apollo will evaluate recovery requests on a case-by-case basis and reserves the right to deny recovery if a significant rule violation has occurred",
      ],
    },
  ];

  return (
    <div>
      <Card variant="rounded">
        <div className="prose mx-auto py-4 dark:prose-invert sm:p-6">
          <h1>Terms of Service</h1>

          <div className="text-sm mb-6">Last updated: January 26, 2025</div>

          {sections.map((section, index) => (
            <section key={index} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
              <div className="space-y-2">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-gray-800 dark:text-gray-200">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TermsPage;
