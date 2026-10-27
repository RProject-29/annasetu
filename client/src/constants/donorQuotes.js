// 10 Inspiring Hunger Relief & Food Rescue Quotes
// Randomly selected on each user visit to motivate donors
export const DONOR_INSPIRATIONAL_QUOTES = [
  "Your one donation can feed hundreds of hungry souls tonight.",
  "Food saved from waste is dignity restored to an empty plate.",
  "No one in our city should sleep on an empty stomach when surplus exists.",
  "A single plate of wholesome food can spark a child's bright smile.",
  "Be the bridge between banquet surplus and shelter hunger.",
  "Annadanam is the greatest gift — every morsel shared counts.",
  "Feeding one person might not change the world, but it changes the world for that one person.",
  "Surplus food is not waste; it is a blessing waiting to reach someone in need.",
  "Small acts of compassion create ripples of hope across our community.",
  "Your generosity today ensures no innocent child sleeps hungry tonight."
];

// Helper to pick a random quote
export const getRandomDonorQuote = () => {
  const index = Math.floor(Math.random() * DONOR_INSPIRATIONAL_QUOTES.length);
  return DONOR_INSPIRATIONAL_QUOTES[index];
};
