let deck = [
  "Wonyoung ⭐\nPosition: Visual\nInfluence: 80k fans",
  "Wonyoung ⭐⭐\nPosition: Visual\nInfluence: 150k fans",
  "Wonyoung ⭐⭐⭐\nPosition: Visual\nInfluence: 250k fans",
  "Rei ⭐\nPosition: Rap\nInfluence: 60k fans",
  "Rei ⭐⭐\nPosition: Rap\nInfluence: 120k fans",
  "Rei ⭐⭐⭐\nPosition: Rap\nInfluence: 220k fans",
  "Liz ⭐\nPosition: Vocal\nInfluence: 60k fans",
  "Liz ⭐⭐\nPosition: Vocal\nInfluence: 130k fans",
  "Liz ⭐⭐⭐\nPosition: Vocal\nInfluence: 230k fans",
  "Yujin ⭐\nPosition: Dance\nInfluence: 70k fans",
  "Yujin ⭐⭐\nPosition: Dance\nInfluence: 140k fans",
  "Yujin ⭐⭐⭐\nPosition: Dance\nInfluence: 240k fans",
  "Jennie ⭐\nPosition: Rap\nInfluence: 80k fans",
  "Jennie ⭐⭐\nPosition: Rap\nInfluence: 150k fans",
  "Jennie ⭐⭐⭐\nPosition: Rap\nInfluence: 250k fans",
  "Rosé ⭐\nPosition: Vocal\nInfluence: 70k fans",
  "Rosé ⭐⭐\nPosition: Vocal\nInfluence: 130k fans",
  "Rosé ⭐⭐⭐\nPosition: Vocal\nInfluence: 240k fans",
  "Lisa ⭐\nPosition: Dance/Rap\nInfluence: 80k fans",
  "Lisa ⭐⭐\nPosition: Dance/Rap\nInfluence: 150k fans",
  "Lisa ⭐⭐⭐\nPosition: Dance/Rap\nInfluence: 250k fans",
  "Jisoo ⭐\nPosition: Visual/Vocal\nInfluence: 70k fans",
  "Jisoo ⭐⭐\nPosition: Visual/Vocal\nInfluence: 120k fans",
  "Jisoo ⭐⭐⭐\nPosition: Visual/Vocal\nInfluence: 230k fans",
  "Karina ⭐\nPosition: Visual/Dance\nInfluence: 70k fans",
  "Karina ⭐⭐\nPosition: Visual/Dance\nInfluence: 130k fans",
  "Karina ⭐⭐⭐\nPosition: Visual/Dance\nInfluence: 250k fans",
  "Winter ⭐\nPosition: Vocal\nInfluence: 60k fans",
  "Winter ⭐⭐\nPosition: Vocal\nInfluence: 140k fans",
  "Winter ⭐⭐⭐\nPosition: Vocal\nInfluence: 240k fans",
  "Ningning ⭐\nPosition: Vocal\nInfluence: 60k fans",
  "Ningning ⭐⭐\nPosition: Vocal\nInfluence: 130k fans",
  "Ningning ⭐⭐⭐\nPosition: Vocal\nInfluence: 230k fans",
  "Giselle ⭐\nPosition: Rap\nInfluence: 60k fans",
  "Giselle ⭐⭐\nPosition: Rap\nInfluence: 120k fans",
  "Giselle ⭐⭐⭐\nPosition: Rap\nInfluence: 220k fans",
  "Chaewon ⭐\nPosition: Dance\nInfluence: 80k fans",
  "Chaewon ⭐⭐\nPosition: Dance\nInfluence: 150k fans",
  "Chaewon ⭐⭐⭐\nPosition: Dance\nInfluence: 250k fans",
  "Kazuha ⭐\nPosition: Visual\nInfluence: 70k fans",
  "Kazuha ⭐⭐\nPosition: Visual\nInfluence: 140k fans",
  "Kazuha ⭐⭐⭐\nPosition: Visual\nInfluence: 230k fans",
  "Sakura ⭐\nPosition: Rap\nInfluence: 70k fans",
  "Sakura ⭐⭐\nPosition: Rap\nInfluence: 130k fans",
  "Sakura ⭐⭐⭐\nPosition: Rap\nInfluence: 230k fans",
  "Yunjin ⭐\nPosition: Vocal\nInfluence: 70k fans",
  "Yunjin ⭐⭐\nPosition: Vocal\nInfluence: 130k fans",
  "Yunjin ⭐⭐⭐\nPosition: Vocal\nInfluence: 230k fans",
  "Jihyo ⭐\nPosition: Vocal\nInfluence: 70k fans",
  "Jihyo ⭐⭐\nPosition: Vocal\nInfluence: 130k fans",
  "Jihyo ⭐⭐⭐\nPosition: Vocal\nInfluence: 230k fans",
  "Momo ⭐\nPosition: Dance\nInfluence: 80k fans",
  "Momo ⭐⭐\nPosition: Dance\nInfluence: 140k fans",
  "Momo ⭐⭐⭐\nPosition: Dance\nInfluence: 240k fans",
  "Chaeyoung ⭐\nPosition: Rap\nInfluence: 60k fans",
  "Chaeyoung ⭐⭐\nPosition: Rap\nInfluence: 120k fans",
  "Chaeyoung ⭐⭐⭐\nPosition: Rap\nInfluence: 220k fans",
  "Tzuyu ⭐\nPosition: Visual\nInfluence: 80k fans",
  "Tzuyu ⭐⭐\nPosition: Visual\nInfluence: 150k fans",
  "Tzuyu ⭐⭐⭐\nPosition: Visual\nInfluence: 250k fans",
  "Yuna ⭐\nPosition: Visual\nInfluence: 70k fans",
  "Yuna ⭐⭐\nPosition: Visual\nInfluence: 130k fans",
  "Yuna ⭐⭐⭐\nPosition: Visual\nInfluence: 230k fans",
  "Ryujin ⭐\nPosition: Rap/Dance\nInfluence: 70k fans",
  "Ryujin ⭐⭐\nPosition: Rap/Dance\nInfluence: 140k fans",
  "Ryujin ⭐⭐⭐\nPosition: Rap/Dance\nInfluence: 240k fans",
  "Lia ⭐\nPosition: Vocal\nInfluence: 70k fans",
  "Lia ⭐⭐\nPosition: Vocal\nInfluence: 130k fans",
  "Lia ⭐⭐⭐\nPosition: Vocal\nInfluence: 230k fans",
  "Yeji ⭐\nPosition: Dance\nInfluence: 80k fans",
  "Yeji ⭐⭐\nPosition: Dance\nInfluence: 150k fans",
  "Yeji ⭐⭐⭐\nPosition: Dance\nInfluence: 250k fans"
];

const supportDeckdata = [
 { name: "Training vocals", type: "Training", ip: 10000, req: null },
  { name: "Training dance", type: "Training", ip: 10000, req: null },
  { name: "Training rap", type: "Training", ip: 10000, req: null },

  { name: "Ambassador Promotion", type: "Promotion", ip: 50000, note: "Can only be used on 3 star", req: "3-star only" },
  { name: "Variety show Promotion", type: "Promotion", ip: 30000, note: "Can only be used on 2+ star", req: "2-star or higher" },
  { name: "Interview Promotion", type: "Promotion", ip: 20000, note: "Can only be used on 1 star", req: "1-star only" },
  { name: "Live broadcast Promotion", type: "Promotion", ip: 20000, req: null },
  { name: "Survival show Promotion", type: "Promotion", ip: 50000, note: "Can only be used on 1 star", req: "1-star only" },
  { name: "Viral TikTok Promotion", type: "Promotion", ip: 10000, req: null },
  { name: "Hip pads Promotion", type: "Promotion", ip: 10000, req: null },
  { name: "Plastic surgery Promotion", type: "Promotion", ip: 30000, req: null },

  // Draw
  { name: "Investment", type: "Draw", effect: "Draw 3 cards", req: null },
  { name: "Scout", type: "Draw", effect: "Top 4 cards and choose 2", req: null },
  { name: "Recruit", type: "Draw", effect: "Find card in deck", req: null },

  // Sabotage
  { name: "Bully scandal", type: "Sabotage", effect: "Removes member from stage 2 star and below", req: "2-star or lower", Description: "Use on opponent’s member to remove their debuted idols off their stage" },
  { name: "Drug allegations", type: "Sabotage", ip: -50000, req: null, Description: "use on enemies members and they lose 20k/35k/50k IP"},
  { name: "Dating scandal", type: "Sabotage", ip: -30000, req: null, Description: "use on enemies members and they lose 20k/25k/30k IP" },
  { name: "Hip pad allegation", type: "Sabotage", ip: -20000, req: null, Description: "use on enemies members and they lose 10k/15k/20k IP" },
  { name: "Plastic surgery allegations", type: "Sabotage", ip: -40000, req: null, Description: "if used on visual they lose another 20k IP" }
];

const supportDeck = [
  "Training vocals\nType: Training\n+10k IP",
  "Training dance\nType: Training\n+10k IP",
  "Training rap\nType: Training\n+10k IP",

  "Ambassador\nType: Promotion (only on ⭐⭐⭐)\n+50k IP",
  "Variety show\nType: Promotion (only on ⭐⭐ or higher)\n+30k IP",
  "Interview\nType: Promotion (only on ⭐)\n+20k IP",
  "Live broadcast\nType: Promotion\n+20k IP",
  "Survival show\nType: Promotion (only on ⭐)\n+50k IP",
  "Viral TikTok\nType: Promotion\n+10k IP",
  "Hip pads\nType: Promotion\n+10k IP",
  "Plastic surgery\nType: Promotion\n+30k IP",

  "Investment\nType: Draw\nDraw 3 cards",
  "Scout\nType: Draw\nTop 4 cards, choose 2",
  "Recruit\nType: Draw\nSearch deck for any card",

  "Bully scandal\nType: Sabotage\nRemove member from stage (⭐ or ⭐⭐ only)",
  "Drug allegations\nType: Sabotage\n-50k IP",
  "Dating scandal\nType: Sabotage\n-30k IP",
  "Hip pad allegation\nType: Sabotage\n-20k IP",
  "Plastic surgery allegations\nType: Sabotage\n-40k IP",
  "Beat the Allegations\nType: Counter \Clears an idols name so that all negative influence negates",
  

  "YG\nType: Entertainment Company\nBLACKPINK MEMBERS +30k EACH",
  "JYP\nType: Entertainment Company\nTWICE AND ITZY MEMBERS +20k EACH",
  "STARSHIP\nType: Entertainment Company\nWONYOUNG +50k, IVE MEMBERS +20k EACH",
  "SM\nType: Entertainment Company\nAESPA MEMBERS +20k EACH",
  "HYBE (SOURCE MUSIC)\nType: Entertainment Company\nLESSERAFIM MEMBERS +20k EACH",

  "ELEVEN\nType: Song\nIVE MEMBERS +10k EACH",
  "DALLA DALLA\nType: Song\nITZY MEMBERS +10k EACH",
  "LIKE OOH AHH\nType: Song\nTWICE MEMBERS +10k EACH",
  "BOOMBAYAH\nType: Song\nBLACKPINK MEMBERS +10k EACH",
  "BLACK MAMBA\nType: Song\nAESPA MEMBERS +10k EACH",
  "FEARLESS\nType: Song\nLESSERAFIM MEMBERS +10k EACH (only 1 per member counted)"
];

const groupLookup = {
  Wonyoung:   "STARSHIP - IVE",
  Rei:        "STARSHIP - IVE",
  Liz:        "STARSHIP - IVE",
  Yujin:      "STARSHIP - IVE",
  Jennie:     "YG - BLACKPINK",
  Rosé:       "YG - BLACKPINK",
  Lisa:       "YG - BLACKPINK",
  Jisoo:      "YG - BLACKPINK",
  Karina:     "SM entertainment - aespa",
  Winter:     "SM entertainment - aespa",
  Ningning:   "SM entertainment - aespa",
  Giselle:    "SM entertainment - aespa",
  Chaewon:    "HYBE - LE SSERAFIM",
  Kazuha:     "HYBE - LE SSERAFIM",
  Sakura:     "HYBE - LE SSERAFIM",
  Yunjin:     "HYBE - LE SSERAFIM",
  Jihyo:      "JYP - TWICE",
  Momo:       "JYP - TWICE",
  Chaeyoung:  "JYP - TWICE",
  Tzuyu:      "JYP - TWICE",
  Yuna:       "JYP - ITZY",
  Ryujin:     "JYP - ITZY",
  Lia:        "JYP - ITZY",
  Yeji:       "JYP - ITZY"
};

deck = deck.map(cardText => {
  const lines = cardText.split("\n");
  const firstLine = lines[0];
  // strip off the star emojis to get the name key
  const name = firstLine.replace(/\s⭐+$/, "");
  const group = groupLookup[name] || "Unknown";
  return [
    firstLine,
    `${group}`,  // ← inserted here
    ...lines.slice(1)   // the original Position / Influence / etc
  ].join("\n");
});

// Now `deck` itself includes the extra Group line, and you can go on
// to call shuffleDeck(), createCardElement(), parseCard(), etc., exactly as before.
console.log(deck[0]);
console.log(deck[1]);

