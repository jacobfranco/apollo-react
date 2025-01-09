import { useMemo } from "react";

// Define our possible rule types
export type RuleType = "content" | "account" | "group" | "universal";

// Update the Rule interface to support multiple types
export interface Rule {
  id: string;
  text: string;
  hint: string;
  rule_type: RuleType | RuleType[] | null; // null kept for backward compatibility
}

export const useRules = () => {
  const rules = useMemo<Rule[]>(
    () => [
      // Content-Only Rules - These rules only make sense for content moderation
      {
        id: "1",
        text: "Spam and Engagement Manipulation",
        hint: "Excessive posting, unwanted commercial content, or deliberately manipulating engagement through false pretenses",
        rule_type: "content",
      },
      {
        id: "2",
        text: "Graphic Content",
        hint: "Content showing extreme violence, gore, or explicit injury that may be disturbing",
        rule_type: "content",
      },
      {
        id: "3",
        text: "Intellectual Property Violation",
        hint: "Content that infringes on copyrights, trademarks, or other intellectual property rights",
        rule_type: "content",
      },
      {
        id: "4",
        text: "Privacy Violation",
        hint: "Sharing personal or private information without consent",
        rule_type: "content",
      },
      {
        id: "5",
        text: "Misinformation",
        hint: "Sharing false or misleading information that may cause harm to individuals or society",
        rule_type: "content",
      },

      // Account-Only Rules - These specifically apply to account behavior
      {
        id: "6",
        text: "Profile Violations",
        hint: "Inappropriate profile content, images, or information that violates community guidelines",
        rule_type: "account",
      },
      {
        id: "7",
        text: "Undisclosed Bot Activity",
        hint: "Operating automated accounts without proper disclosure",
        rule_type: "account",
      },

      // Multi-Category Rules - These rules can apply to both content and accounts
      {
        id: "8",
        text: "Hate Speech and Harassment",
        hint: "Content or behavior that promotes hatred, violence, or discrimination against individuals or groups based on protected characteristics",
        rule_type: ["content", "account"],
      },
      {
        id: "9",
        text: "Impersonation",
        hint: "Pretending to be someone else or creating misleading content/accounts with intent to deceive",
        rule_type: ["content", "account"],
      },
      {
        id: "10",
        text: "Scams and Fraud",
        hint: "Attempts to deceive users for personal or financial gain through content or account behavior",
        rule_type: ["content", "account"],
      },
      {
        id: "11",
        text: "Violence and Extremism",
        hint: "Promoting or threatening violence, terrorism, or extreme ideologies through content or account behavior",
        rule_type: ["content", "account"],
      },

      // Group-Specific Rules - These apply to group management
      {
        id: "12",
        text: "Group Guidelines Violation",
        hint: "Violation of specific group rules or community standards",
        rule_type: "group",
      },
      {
        id: "13",
        text: "Group Management Abuse",
        hint: "Misuse of group management powers or inappropriate group settings",
        rule_type: "group",
      },

      // Universal Rules - These apply to all reportable entities
      {
        id: "14",
        text: "Legal Compliance Violation",
        hint: "Violations of applicable laws, regulations, or platform terms of service",
        rule_type: "universal",
      },
      {
        id: "15",
        text: "Platform Manipulation",
        hint: "Technical exploitation of platform features or coordinated abuse",
        rule_type: "universal",
      },

      {
        id: "16",
        text: "Crisis Event Exploitation",
        hint: "Exploiting natural disasters, tragedies, or crisis events inappropriately",
        rule_type: ["content", "account"],
      },
      {
        id: "17",
        text: "Age Restriction Violation",
        hint: "Content or behavior inappropriate for minors or violating age-specific guidelines",
        rule_type: ["content", "account"],
      },
      {
        id: "18",
        text: "Cross-Platform Coordination",
        hint: "Coordinating harmful activities across multiple platforms",
        rule_type: "universal",
      },
      {
        id: "19",
        text: "Other",
        hint: "Other violations not covered by the rules above",
        rule_type: "universal",
      },
    ],
    []
  );

  return { rules };
};
