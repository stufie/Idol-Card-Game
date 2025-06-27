const influenceLookup = {};

deck.forEach(card => {
  const lines = card.split("\n");
  const nameLine = lines[0];
  const influenceLine = lines.find(line => line.includes("Influence:"));
  if (influenceLine) {
    const match = influenceLine.match(/(\d+)[kK]/);
    if (match) {
      influenceLookup[nameLine] = parseInt(match[1]) * 1000;
    }
  }
});

function updateStageScores() {
  let player1Score = 0;
  let player2Score = 0;

  const p1Slots = document.querySelectorAll("#player1Stage .stage-slot");
  const p2Slots = document.querySelectorAll("#player2Stage .stage-slot");

  p1Slots.forEach(slot => {
    const card = slot.querySelector(".card");
    if (card) {
      const nameLine = card.textContent.split("\n")[0];
      if (influenceLookup[nameLine]) {
        player1Score += influenceLookup[nameLine];
      }
    }
  });

  p2Slots.forEach(slot => {
    const card = slot.querySelector(".card");
    if (card) {
      const nameLine = card.textContent.split("\n")[0];
      if (influenceLookup[nameLine]) {
        player2Score += influenceLookup[nameLine];
      }
    }
  });

  // Convert raw scores to k notation (divide by 1000)
  const player1ScoreK = (player1Score / 1000).toFixed(0); // no decimals, integer k value
  const player2ScoreK = (player2Score / 1000).toFixed(0);

document.getElementById("player1Score").textContent = `Influence: ${player1ScoreK}k fans`;
document.getElementById("player2Score").textContent = `Influence: ${player2ScoreK}k fans`;
  
}

updateStageScores();