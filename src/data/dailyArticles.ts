export type ChallengeType = 'individual' | 'family' | 'social-media';

export interface DailyArticle {
  day: number;
  month: number;
  title: string;
  description: string;
  fullContent?: string;
  externalLink?: string;
  challengeType: ChallengeType;
  isRewardDay?: boolean;
  reward?: {
    title: string;
    message: string;
  };
}

export const dailyArticles: DailyArticle[] = [
  // January
  {
    day: 1,
    month: 1,
    title: "Our Right to Survival",
    description: "Learn about Article 6 (Right to life) - every child's fundamental right to survive and develop.",
    externalLink: "https://www.unicef.org/child-rights-convention/convention-text-childrens-version",
    challengeType: 'individual'
  },
  {
    day: 2,
    month: 1,
    title: "Understanding Child Health Rights",
    description: "Explore children's right to healthcare, nutrition, and a safe  environment environment.",
    externalLink: "https://www.who.int/news-room/fact-sheets/detail/children-s-environmental-health",
    challengeType: 'individual'
  },
  {
    day: 3,
    month: 1,
    title: "Child Development and Nutrition",
    description: "Learn about proper nutrition and development needs for growing children.",
    externalLink: "https://www.unicef.org/nutrition/index_childhood-development.html",
    challengeType: 'individual'
  },
  {
    day: 4,
    month: 1,
    title: "Children's Right to Health",
    description: "Learn about Article 24 - every child's right to healthcare, clean water, and nutritious food.",
    externalLink: "https://www.unicef.org/child-rights-convention/convention-text#health",
    challengeType: 'family'
  },
  {
    day: 5,
    month: 1,
    title: "Protection from Violence",
    description: "Understanding Article 19 - children's right to be safe from all forms of violence and abuse.",
    externalLink: "https://www.unicef.org/protection/violence-against-children",
    challengeType: 'family'
  },
  {
    day: 6,
    month: 1,
    title: "Our Right to Protection",
    description: "Explain Article 19 (Freedom from violence) in simple words (10-12 mins). Then let the child draw, recount, or share it with family.",
    fullContent: "Protection means being safe at home, school, and everywhere. No one should hurt you physically or emotionally.",
    challengeType: 'family'
  },
  {
    day: 7,
    month: 1,
    title: "Our Right to Protection",
    description: "Explain Article 34 (Sexual exploitation) in simple words (10-12 mins). Then let the child draw, recount, or share it with family.",
    fullContent: "Article 34 protects children from sexual exploitation and abuse. Your body belongs to you, and you have the right to say no to any unwanted touch.",
    challengeType: 'family'
  },
  {
    day: 8,
    month: 1,
    title: "Our Rights to Protection",
    description: "Explain Article 32 (Child labor) in simple words (10-12 mins). Then let the child draw, recount, or share it with family.",
    fullContent: "Article 32 protects children from economic exploitation and hazardous work. Children should go to school, not work in dangerous conditions.",
    challengeType: 'family'
  },
  {
    day: 9,
    month: 1,
    title: "Our Rights to Protection",
    description: "Explain Article 33 (Drug abuse) in simple words (10-12 mins). Then let the child draw, recount, or share it with family.",
    fullContent: "Article 33 protects children from illegal drugs. You have the right to be protected from drug use and trafficking.",
    challengeType: 'family'
  },
  {
    day: 10,
    month: 1,
    title: "Our Right to Protection",
    description: "Explain Article 36 (Other forms of exploitation) in simple words (10-12 mins). Then let the child draw, recount, or share it with family.",
    fullContent: "Article 36 protects children from all other forms of exploitation that may harm any aspects of the child's welfare.",
    challengeType: 'family'
  },
  {
    day: 11,
    month: 1,
    title: "Our Rights to Survival",
    description: "Explain Article 27 (Adequate standard of living) in simple words (10-12 mins). Then let the child draw, recount, or share it with family.",
    fullContent: "Article 27 guarantees every child's right to a standard of living adequate for physical, mental, spiritual, moral, and social development.",
    challengeType: 'family'
  },
  {
    day: 12,
    month: 1,
    title: "Our Rights to Survival",
    description: "Explain Article 28 (Right to education) in simple words (10-12 mins). Then let the child draw, recount, or share it with family.",
    fullContent: "Article 28 ensures every child's right to education. Primary education should be free and compulsory for all children.",
    challengeType: 'family'
  },
  {
    day: 13,
    month: 1,
    title: "Our Rights to Development",
    description: "Explain Article 31 (Leisure, play and culture) in simple words (10-12 mins). Then let the child draw, recount, or share it with family.",
    fullContent: "Article 31 recognizes the child's right to rest, leisure, play, and participation in cultural and artistic activities.",
    challengeType: 'family'
  },
  {
    day: 14,
    month: 1,
    title: "Our Right to Protection",
    description: "Explain Article 8 (Preservation of identity) in simple words (10-12 mins). Then let the child draw, recount, or share it with family.",
    fullContent: "Article 8 protects the child's identity including nationality, name, and family relations as recognized by law.",
    challengeType: 'family'
  },
  {
    day: 15,
    month: 1,
    title: "Our Rights to Protection",
    description: "Explain Article 11 (Abduction and non-return) in simple words (10-12 mins). Then let the child draw, recount, or share it with family.",
    fullContent: "Article 11 protects children from being taken away from their country illegally or being prevented from returning.",
    challengeType: 'family'
  },
  {
    day: 16,
    month: 1,
    title: "Our Right to Development",
    description: "Explain Article 13 (Freedom of expression) in simple words (10-12 mins). Then let the child draw, recount, or share it with family.",
    fullContent: "Article 13 guarantees children the right to freedom of expression. This includes the freedom to seek, receive, and share information.",
    challengeType: 'social-media'
  },
  {
    day: 17,
    month: 1,
    title: "Our Right to Protection",
    description: "Explain Article 16 (Right to privacy) in simple words (10-12 mins). Then let the child draw, recount, or share it with family.",
    fullContent: "Article 16 protects children from interference with privacy, family, home, or correspondence, and from attacks on honor and reputation.",
    challengeType: 'social-media'
  },
  {
    day: 18,
    month: 1,
    title: "For Parents",
    description: "Explain Article 18 (Parental responsibilities) in simple words (10-12 mins). Then let the child draw, recount, or share it with family.",
    fullContent: "Article 18 states that parents have joint primary responsibility for raising the child, and the state should support them.",
    challengeType: 'family'
  },
  {
    day: 19,
    month: 1,
    title: "For Parents",
    description: "Explain Article 5 (Parental guidance and child's evolving capacities) in simple words (10-12 mins). Then let the child draw, recount, or share it with family.",
    fullContent: "Article 5 recognizes that parents have the responsibility and right to provide guidance to their children appropriate to their evolving capacities.",
    challengeType: 'family'
  },
  {
    day: 20,
    month: 1,
    title: "Participation",
    description: "Explain Article 12 (Respect for the views of the child) in simple words (10-12 mins). Then let the child draw, recount, or share it with family.",
    fullContent: "Article 12 ensures that children have the right to express their views in all matters affecting them and to have those views taken seriously.",
    challengeType: 'family'
  },
  {
    day: 21,
    month: 1,
    title: "Participation",
    description: "Explain Article 15 (Freedom of association) in simple words (10-12 mins). Then let the child draw, recount, or share it with family.",
    fullContent: "Article 15 guarantees children's rights to freedom of association and peaceful assembly.",
    challengeType: 'social-media'
  },
  {
    day: 22,
    month: 1,
    title: "Be an identity poster maker",
    description: "Can you identify your rights in life? Sketch your poster. You may check Article 7: Right to name, nationality and knowing parents.",
    fullContent: "Create a poster about your identity! Article 7 gives you the right to a name, nationality, and to know your parents. Express yourself creatively!",
    challengeType: 'individual'
  },
  {
    day: 23,
    month: 1,
    title: "Can you share it to your family?",
    description: "Can you identify your rights in life? Sketch your poster. You may check Article 7: Right to name, nationality and knowing parents.",
    fullContent: "Share your identity poster with your family! Discuss why your name, nationality, and family are important to who you are.",
    challengeType: 'family'
  },
  {
    day: 24,
    month: 1,
    title: "Can you share your poster in social media?",
    description: "Can you identify your rights in life? Sketch your poster. You may check Article 7: Right to name, nationality and knowing parents.",
    fullContent: "With your parent's permission, share your poster on social media to teach others about children's rights!",
    challengeType: 'social-media'
  },
  {
    day: 25,
    month: 1,
    title: "Reflect your family",
    description: "Display your family portrait about: Our family is empowered & safe because we know our rights!",
    fullContent: "Create a family portrait showing how your family is empowered and safe because you know your rights. Discuss together!",
    challengeType: 'family'
  },
  {
    day: 26,
    month: 1,
    title: "Display your family portrait about",
    description: "Our family is empowered & safe because we know our rights! (Promote it in social media)",
    fullContent: "Share your family portrait on social media! Help other families learn about children's rights and empowerment.",
    challengeType: 'social-media'
  },
  {
    day: 27,
    month: 1,
    title: "Share the photo of the poster and share",
    description: "Take a photo of your poster and share it in your individual as might help someone (Promote it in social media)",
    fullContent: "Your poster might help someone! Share it on social media to spread awareness about children's rights.",
    challengeType: 'social-media'
  },
  {
    day: 28,
    month: 1,
    title: "Share the photo of the poster and share",
    description: "Take a photo of your poster and share it in your individual as might help someone (Promote it in social media)",
    fullContent: "Continue sharing your knowledge! Your voice matters and can make a difference in other children's lives.",
    challengeType: 'social-media'
  },
  {
    day: 29,
    month: 1,
    title: "Share the photo of the poster and share",
    description: "Take a photo of your poster and share it in your individual as might help someone (Promote it in social media)",
    fullContent: "Keep spreading awareness! Every child deserves to know their rights.",
    challengeType: 'social-media'
  },
  {
    day: 30,
    month: 1,
    title: "REWARD DAY - Gauntlets of Safety",
    description: "Congratulations! You learned your rights for 30 days!",
    fullContent: "🎉 Amazing achievement! You've completed 30 days of learning about your rights!",
    challengeType: 'individual',
    isRewardDay: true,
    reward: {
      title: "Armor part earned: Gauntlets of Safety",
      message: "These gloves give you the power to protect yourself, because you know what is right and fair for you. You now understand your rights and can stand up for yourself!"
    }
  },
  // February - Adding sample data
  {
    day: 1,
    month: 2,
    title: "Our Right to Be Heard",
    description: "Learn about Article 12 - Every child has the right to express their opinion",
    fullContent: "Article 12 ensures children can express their views freely in all matters affecting them. Your voice matters!",
    challengeType: 'individual'
  },
  // ... Continue for all 365 days (abbreviated for brevity)
];

// Helper function to get article for a specific date
export const getArticleForDate = (date: Date): DailyArticle | undefined => {
  const day = date.getDate();
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  return dailyArticles.find(article => article.day === day && article.month === month);
};

// Helper to check if a date is a reward day (30th of any month)
export const isRewardDay = (date: Date): boolean => {
  return date.getDate() === 30;
};
