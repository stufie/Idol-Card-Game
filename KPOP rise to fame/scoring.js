// Assumes deck cards are strings like:
// "IdolName\nInfluence: 30k\nPosition: Vocal\n..."

// Build lookup from deck array: name => { influence: number, positions: [string] }
const influenceLookup = {};
deck.forEach(card => {
  const lines = card.split("\n");
  const nameLine = lines[0];
  let influence = 0;
  let positions = [];

  lines.forEach(line => {
    if (line.startsWith("Position:")) {
      // Positions might be slash separated: "Visual/Dance"
      const posPart = line.slice(9).trim(); // after "Position:"
      positions = posPart.split("/").map(p => p.trim());
    }
    if (line.startsWith("Influence:")) {
      const match = line.match(/(\d+)[kK]/);
      if (match) {
        influence = parseInt(match[1]) * 1000;
      }
    }
  });

  influenceLookup[nameLine.trim().toLowerCase()] = { influence, positions };
});

function updateStageScores() {
  let player1Influence = 0;
  let player1Bonus = 0;
  let player2Influence = 0;
  let player2Bonus = 0;

  const positionBonusValues = {
    Vocal: 20000,
    Rap: 20000,
    Dance: 15000,
    Visual: 15000,
    Center: 30000,
  };

  // Helper to process player stage slots
  function processPlayer(playerNum) {
    const stageSlots = document.querySelectorAll(`#player${playerNum}Stage .stage-slot`);
    let totalInfluence = 0;
    let totalBonus = 0;

    stageSlots.forEach(slot => {
      const card = slot.querySelector(".card");
      if (!card) return;

      // Card's nameLine (first line)
      const cardText = card.textContent.trim();
      const nameLine = cardText.split("\n")[0];
      const lookupName = nameLine.trim().toLowerCase();

      // Lookup influence and positions
      const data = influenceLookup[lookupName];
      if (!data) {
        console.warn("No influence data for card name:", lookupName);
        return;
      }

      totalInfluence += data.influence;

      // Determine slot position from slot.id (like player1Vocal => Vocal)
      const slotId = slot.id;
      const slotPos = slotId.replace(`player${playerNum}`, "");

      // Bonus for Center slot is automatic
      if (slotPos === "Center") {
        totalBonus += positionBonusValues.Center;
      } else {
        if (data.positions.includes(slotPos)) {
          totalBonus += positionBonusValues[slotPos] || 0;
        }
      }
    });

    return { totalInfluence, totalBonus };
  }

  // Calculate for both players
  const p1 = processPlayer(1);
  const p2 = processPlayer(2);

  player1Influence = p1.totalInfluence;
  player1Bonus = p1.totalBonus;
  player2Influence = p2.totalInfluence;
  player2Bonus = p2.totalBonus;

  // Convert to k and integer display
  function toK(n) {
    return Math.round(n / 1000);
  }

  const p1InfluenceK = toK(player1Influence);
  const p1BonusK = toK(player1Bonus);
  const p1FanbaseK = p1InfluenceK + p1BonusK;

  const p2InfluenceK = toK(player2Influence);
  const p2BonusK = toK(player2Bonus);
  const p2FanbaseK = p2InfluenceK + p2BonusK;

  // Update UI
  document.getElementById("player1Score").textContent =
    `Influence: ${p1InfluenceK}k fans     Bonus: ${p1BonusK}k fans        Fanbase: ${p1FanbaseK}k fans`;

  document.getElementById("player2Score").textContent =
     `Influence: ${p2InfluenceK}k fans     Bonus: ${p2BonusK}k fans        Fanbase: ${p2FanbaseK}k fans`;
}

// Run once at start or call after every move that affects stage cards
updateStageScores();
