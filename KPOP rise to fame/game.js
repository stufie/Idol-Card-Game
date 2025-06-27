let shuffledDeck = [];
let shuffledSupportDeck = [];
let dragged = null;
let currentHighlight = null; // for upgrade highlight on stage cards

// --- Deck Shuffling ---

// Shuffle main deck into shuffledDeck
function shuffleDeck() {
  shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
}

// Shuffle support deck into shuffledSupportDeck
function shuffleSupportDeck() {
  shuffledSupportDeck = [...supportDeck];
  for (let i = shuffledSupportDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledSupportDeck[i], shuffledSupportDeck[j]] = [shuffledSupportDeck[j], shuffledSupportDeck[i]];
  }
}

// Remove all card elements inside a zone (but not other elements)
function clearCards(zone) {
  const cards = zone.querySelectorAll('.card');
  cards.forEach(card => card.remove());
}

// Draw a full hand of normal cards: clears existing cards, then draws `count` cards
function drawCards(targetId, count = 5) {
  const zone = document.getElementById(targetId);
  clearCards(zone);

  if (shuffledDeck.length < count) shuffleDeck();

  for (let i = 0; i < count; i++) {
    const cardText = shuffledDeck.pop();
    const player = targetId.startsWith('player1') ? 'player1' : 'player2';
    const card = createCardElement(cardText, player);
    zone.appendChild(card);
  }

  updateMatchingIdolHighlights(playerFromZone(targetId));
}

// Draw a full hand of support cards: clears existing cards, then draws `count` cards
function drawSupportCards(targetId, count = 3) {
  const zone = document.getElementById(targetId);
  clearCards(zone);

  if (shuffledSupportDeck.length < count) shuffleSupportDeck();

  for (let i = 0; i < count; i++) {
    const cardText = shuffledSupportDeck.pop();
    const player = targetId.startsWith('player1') ? 'player1' : 'player2';
    const card = createCardElement(cardText, player);
    zone.appendChild(card);
  }

  updateMatchingIdolHighlights(playerFromZone(targetId));
}

// Incrementally draw `count` cards without clearing existing cards (normal deck)
function draw(targetId, count = 1) {
  const zone = document.getElementById(targetId);

  if (shuffledDeck.length < count) shuffleDeck();

  for (let i = 0; i < count; i++) {
    const cardText = shuffledDeck.pop();
    const player = targetId.startsWith('player1') ? 'player1' : 'player2';
    const card = createCardElement(cardText, player);
    zone.appendChild(card);
  }

  updateMatchingIdolHighlights(playerFromZone(targetId));
}

// Incrementally draw `count` support cards without clearing existing cards
function drawSupport(targetId, count = 1) {
  const zone = document.getElementById(targetId);

  if (shuffledSupportDeck.length < count) shuffleSupportDeck();

  for (let i = 0; i < count; i++) {
    const cardText = shuffledSupportDeck.pop();
    const player = targetId.startsWith('player1') ? 'player1' : 'player2';
    const card = createCardElement(cardText, player);
    zone.appendChild(card);
  }

  updateMatchingIdolHighlights(playerFromZone(targetId));
}

// --- Helpers ---

function playerFromZone(zoneId) {
  if (!zoneId) return null;
  if (zoneId.startsWith('player1')) return 'player1';
  if (zoneId.startsWith('player2')) return 'player2';
  if (zoneId.endsWith('1')) return 'player1';
  if (zoneId.endsWith('2')) return 'player2';
  return null;
}

// --- Card creation and parsing ---

function createCardElement(cardText, player) {
  const card = document.createElement('div');
  card.className = 'card';
  card.draggable = true;
  card.textContent = cardText;
  card.dataset.player = player;
  card.ondragstart = drag;
  card.ondragover = cardDragOver;
  card.ondragleave = cardDragLeave;
  return card;
}

function parseCard(card) {
  const lines = card.textContent.trim().split('\n');
  
  
console.log(`Card innerText:\n---\n${existingCard.textContent}\n---`);
  
  
  for (const line of lines) {
    const match = line.trim().match(/^(.+?)\s(⭐+)$/);
    if (match) {
      return {
        name: match[1].trim(),
        stars: match[2].length
      };
    }
  }

  return null; // If no line matches
}
// --- Drag & Drop Handlers ---

function drag(ev) {
  dragged = ev.target;
  currentHighlight = null;
  ev.dataTransfer.setData("text/plain", ev.target.id);
}

function handleDragEnter(ev) {
  ev.preventDefault();
  if (!dragged) return;

  const dropZone = ev.currentTarget;

  // Optional: You can add logic here to only highlight if drop is allowed

  dropZone.classList.add('dragover');
}






function allowDrop(ev) {
  ev.preventDefault();
  if (!dragged) return;

  const draggedPlayer = dragged.dataset.player;
  const dropZone = ev.currentTarget;
  const dropZoneId = dropZone.id || "";
  const draggedParent = dragged.parentElement;
  const draggedParentId = draggedParent?.id || "";
  const draggedParentClassList = draggedParent?.classList || [];
  const draggedData = parseCard(dragged);
  if (!draggedData) return;

  // Determine which player the drop zone belongs to
  let dropZonePlayer = null;
  if (dropZoneId.includes('1')) dropZonePlayer = 'player1';
  else if (dropZoneId.includes('2')) dropZonePlayer = 'player2';
  else if (dropZone.classList.contains('stage-slot')) {
    const stageParent = dropZone.parentElement;
    if (stageParent?.id.includes('1')) dropZonePlayer = 'player1';
    else if (stageParent?.id.includes('2')) dropZonePlayer = 'player2';
  }
  if (!dropZonePlayer) return;

  // Only allow drops within the same player area
  if (draggedPlayer !== dropZonePlayer) return;

  // Zone flags
  const isTrainingZone = dropZoneId === `${dropZonePlayer}Training`;
  const isHandZone = draggedParentId.endsWith('Hand');
  const draggedFromStageSlot = draggedParentClassList.contains('stage-slot');
  const draggedFromTrainingZone = draggedParentId === `${dropZonePlayer}Training`;
  const dropIsStageSlot = dropZone.classList.contains('stage-slot');

  // Get cards currently in training and stage zones
  const trainingZone = document.getElementById(`${dropZonePlayer}Training`);
  const stageZone = document.getElementById(`${dropZonePlayer}Stage`);
  const trainingCards = Array.from(trainingZone.children).filter(c => c.classList.contains('card'));
  const stageCards = Array.from(stageZone.querySelectorAll('.card'));

  // --- Hand → Training ---
  if (isTrainingZone && isHandZone) {
    console.log(`Attempting Hand → Training drop for card: ${draggedData.name} ⭐${draggedData.stars}`);

    if (trainingCards.some(card => parseCard(card)?.name === draggedData.name)) {
      console.log('Reject: duplicate idol in training');
      return;
    }
    if (trainingCards.length >= 3) {
      console.log('Reject: training room full');
      return;
    }

    if (draggedData.stars === 1) {
      console.log('Allow: ⭐1 card from hand to training');
      dropZone.classList.add('dragover');
      return;
    }

    const validStageMatch = stageCards.some(card => {
      const data = parseCard(card);
      const valid = data && data.name === draggedData.name && data.stars === draggedData.stars - 1;
      if (valid) console.log(`Found valid stage card for upgrade: ${data.name} ⭐${data.stars}`);
      return valid;
    });

    if (validStageMatch) {
      console.log('Allow: higher star card from hand to training because stage has one star less');
      dropZone.classList.add('dragover');
    } else {
      console.log('Reject: no matching stage card with one star less for this idol');
    }
    return;
  }

  // --- Training → Stage ---
 if (dropIsStageSlot && draggedFromTrainingZone) {
  console.log(`Attempting Training → Stage drop for card: ${draggedData.name} ⭐${draggedData.stars}`);

  const existingCard = dropZone.querySelector('.card');

  if (!existingCard) {
    console.log('No existing card in this stage slot');
    if (draggedData.stars === 1) {
      console.log('Allow: placing ⭐1 card on empty stage slot');
      dropZone.classList.add('dragover');
    } else {
      console.log(`Reject: can't place ⭐${draggedData.stars} on empty stage slot`);
    }
    return;
  }

  // ✅ ONLY call parseCard if existingCard is not null
  const existingData = parseCard(existingCard);
  console.log(`Existing stage card: ${existingData?.name} ⭐${existingData?.stars}`);

  if (!existingData) {
    console.log('Reject: existing card could not be parsed');
    return;
  }

  if (existingData.name !== draggedData.name) {
    console.log('Reject: different idols, cannot upgrade');
    return;
  }

  const starDiff = draggedData.stars - existingData.stars;
  console.log(`Star difference: ${starDiff}`);

  if (starDiff === 1) {
    console.log('Allow: upgrading stage card by 1 star');
    dropZone.classList.add('dragover');
  } else {
    console.log(`Reject: can only upgrade one tier at a time. Trying to go from ⭐${existingData.stars} to ⭐${draggedData.stars}`);
  }

  return;
}


  // --- Stage → Training ---
  if (isTrainingZone && draggedFromStageSlot) {
    if (trainingCards.some(card => parseCard(card)?.name === draggedData.name)) {
      console.log('Reject: duplicate idol in training from stage');
      return;
    }
    if (trainingCards.length >= 3) {
      console.log('Reject: training room full from stage');
      return;
    }

    console.log('Allow: stage card to training');
    dropZone.classList.add('dragover');
    return;
  }

  // --- Stage → Stage ---
  if (draggedFromStageSlot && dropIsStageSlot) {
    console.log('Allow: stage to stage slot move');
    dropZone.classList.add('dragover');
    return;
  }

  // --- Training → Training ---
  if (isTrainingZone && draggedFromTrainingZone) {
    console.log('Allow: training to training rearrange');
    dropZone.classList.add('dragover');
    return;
  }

  // --- Block Hand → Stage ---
  if (isHandZone && dropIsStageSlot) {
    console.log('Reject: hand to stage direct move blocked');
    return;
  }
}










function removeDragOver(ev) {
  if (ev.currentTarget.classList.contains("zone") || ev.currentTarget.classList.contains("stage-slot")) {
    ev.currentTarget.classList.remove("dragover");
  }
  clearHighlight();
}

function cardDragOver(ev) {
  ev.preventDefault();
  if (!dragged) return;

  const hoveredCard = ev.currentTarget;
  if (hoveredCard.dataset.player !== dragged.dataset.player) {
    clearHighlight();
    return;
  }

  const draggedData = parseCard(dragged);
  const hoveredData = parseCard(hoveredCard);
  if (!draggedData || !hoveredData) {
    clearHighlight();
    return;
  }

  if (
    draggedData.name === hoveredData.name &&
    (
      (hoveredData.stars === 1 && draggedData.stars === 2) ||
      (hoveredData.stars === 2 && draggedData.stars === 3)
    )
  ) {
    highlightCard(hoveredCard);
  } else {
    clearHighlight();
  }
}

function cardDragLeave(ev) {
  clearHighlight();
}

function highlightCard(card) {
  if (currentHighlight && currentHighlight !== card) {
    clearHighlight();
  }
  currentHighlight = card;
  card.style.border = "3px solid #007bff";
}

function clearHighlight() {
  if (currentHighlight) {
    currentHighlight.style.border = "1px solid #333";
    currentHighlight = null;
  }
}

function drop(ev) {
  ev.preventDefault();
  if (!dragged) return;

  const draggedPlayer = dragged.dataset.player;
  const dropZone = ev.currentTarget;
  const draggedParent = dragged.parentElement;
  const draggedParentId = draggedParent?.id || "";
  const draggedParentClassList = draggedParent?.classList || [];
  const draggedData = parseCard(dragged);

  let dropZonePlayer = null;
  if (dropZone.id) {
    dropZonePlayer = dropZone.id.includes('1') ? 'player1' : (dropZone.id.includes('2') ? 'player2' : null);
  } else if (dropZone.classList.contains('stage-slot')) {
    const stageZone = dropZone.parentElement;
    dropZonePlayer = stageZone.id.includes('1') ? 'player1' : 'player2';
  }

  if (!dropZonePlayer || draggedPlayer !== dropZonePlayer || !draggedData) {
    clearHighlight();
    removeDragOver(ev);
    return;
  }

  const trainingZone = document.getElementById(`${dropZonePlayer}Training`);
  const stageZone = document.getElementById(`${dropZonePlayer}Stage`);

  const draggedFromStageSlot = draggedParentClassList.contains('stage-slot');
  const draggedFromTrainingZone = draggedParentId === `${draggedPlayer}Training`;
  const draggedFromHandZone = draggedParentId.endsWith('Hand');
  const dropIsStageSlot = dropZone.classList.contains('stage-slot');
  const isTrainingZone = dropZone.id === `${dropZonePlayer}Training`;

  const updateSlotStyle = (slot, data) => {
    slot.classList.add("filled");
    if (data.stars === 3) {
      slot.classList.add("maxed");
    } else {
      slot.classList.remove("maxed");
    }
  };

  const clearSlotStyle = (slot) => {
    if (!slot.querySelector('.card')) {
      slot.classList.remove("filled", "maxed");
    }
  };

  // Hand → Training
  if (isTrainingZone && draggedFromHandZone) {
    const trainingCards = Array.from(trainingZone.children).filter(c => c.classList.contains('card'));
    const stageCards = Array.from(stageZone.querySelectorAll('.card'));
    const stageHasMatch = stageCards.some(card => parseCard(card).name === draggedData.name);

    if (draggedData.stars !== 1 && !stageHasMatch) return clearHighlight(), removeDragOver(ev);
    if (trainingCards.some(card => parseCard(card).name === draggedData.name)) return clearHighlight(), removeDragOver(ev);
    if (trainingCards.length >= 3) return clearHighlight(), removeDragOver(ev);

    trainingZone.appendChild(dragged);
    clearHighlight(); removeDragOver(ev);
    updateMatchingIdolHighlights(draggedPlayer);
    updateStageScores();
    return;
  }

  // Training → Stage Slot
  if (dropIsStageSlot && draggedFromTrainingZone) {
    const existingCard = dropZone.querySelector('.card');
    if (!existingCard && draggedData.stars === 1) {
      dropZone.appendChild(dragged);
      updateSlotStyle(dropZone, draggedData);
      clearHighlight(); removeDragOver(ev);
      updateMatchingIdolHighlights(draggedPlayer);
      updateStageScores();
      return;
    }

    if (existingCard) {
      const existingData = parseCard(existingCard);
      if (existingData.name === draggedData.name && existingData.stars < draggedData.stars) {
        dropZone.replaceChild(dragged, existingCard);
        updateSlotStyle(dropZone, draggedData);
        clearHighlight(); removeDragOver(ev);
        updateMatchingIdolHighlights(draggedPlayer);
        updateStageScores();
        return;
      }
    }
  }

  // Stage Slot → Training
  if (isTrainingZone && draggedFromStageSlot) {
    const trainingCards = Array.from(trainingZone.children).filter(c => c.classList.contains('card'));
    if (trainingCards.some(card => parseCard(card).name === draggedData.name)) return clearHighlight(), removeDragOver(ev);
    if (trainingCards.length >= 3) return clearHighlight(), removeDragOver(ev);

    trainingZone.appendChild(dragged);
    clearSlotStyle(draggedParent);
    clearHighlight(); removeDragOver(ev);
    updateMatchingIdolHighlights(draggedPlayer);
    updateStageScores();
    return;
  }

  // Stage Slot → Stage Slot (swap or upgrade)
  if (draggedFromStageSlot && dropIsStageSlot) {
    const existingCard = dropZone.querySelector('.card');

    if (!existingCard) {
      dropZone.appendChild(dragged);
      updateSlotStyle(dropZone, draggedData);
      clearSlotStyle(draggedParent);
      clearHighlight(); removeDragOver(ev);
      updateMatchingIdolHighlights(draggedPlayer);
      updateStageScores();
      return;
    }

    const existingData = parseCard(existingCard);
    if (existingData.name === draggedData.name && existingData.stars < draggedData.stars) {
      dropZone.replaceChild(dragged, existingCard);
      updateSlotStyle(dropZone, draggedData);
      clearSlotStyle(draggedParent);
      clearHighlight(); removeDragOver(ev);
      updateMatchingIdolHighlights(draggedPlayer);
      updateStageScores();
      return;
    } else {
      dropZone.replaceChild(dragged, existingCard);
      draggedParent.appendChild(existingCard);
      updateSlotStyle(dropZone, draggedData);
      updateSlotStyle(draggedParent, existingData);
      clearHighlight(); removeDragOver(ev);
      updateMatchingIdolHighlights(draggedPlayer);
      updateStageScores();
      return;
    }
  }

  // Training → Training
  if (isTrainingZone && draggedFromTrainingZone) {
    const targetCard = dropZone.querySelector('.card');
    if (!targetCard) {
      dropZone.appendChild(dragged);
    } else {
      dropZone.replaceChild(dragged, targetCard);
      draggedParent.appendChild(targetCard);
    }
    clearHighlight(); removeDragOver(ev);
    updateMatchingIdolHighlights(draggedPlayer);
    updateStageScores();
    return;
  }

  clearHighlight();
  removeDragOver(ev);
}

// --- Highlight matching idols (hand, stage, and training) ---

function updateMatchingIdolHighlights() {
  const zones = ['Hand', 'Stage', 'Training'];
  const idolStats = {}; // { idolName: { player1: Set, player2: Set } }

  // 1) Build the stats map
  ['player1', 'player2'].forEach(player => {
    zones.forEach(zone => {
      const container = document.getElementById(player + zone);
      if (!container) return;
      container.querySelectorAll('.card').forEach(card => {
        const data = parseCard(card);
        if (!data) return;
        if (!idolStats[data.name]) {
          idolStats[data.name] = { player1: new Set(), player2: new Set() };
        }
        idolStats[data.name][player].add(data.stars);
      });
    });
  });

  // 2) Iterate every card and apply the correct color
  document.querySelectorAll('.card').forEach(card => {
    const data = parseCard(card);
    if (!data) return;
    const stats = idolStats[data.name];
    // safety check
    if (!stats) {
      card.style.backgroundColor = '';
      return;
    }

    const bothPlayersHave = stats.player1.size > 0 && stats.player2.size > 0;
    const p1HasMultipleStars = stats.player1.size > 1;
    const p2HasMultipleStars = stats.player2.size > 1;
    const owner = card.dataset.player;

    if (bothPlayersHave) {
      // Faint red if both players have this idol at all
      card.style.backgroundColor = '#ffe5e5';
    } else if (owner === 'player1' && p1HasMultipleStars) {
      // Faint blue if player1 has multiple star-levels of this idol
      card.style.backgroundColor = '#edf6fd';
    } else if (owner === 'player2' && p2HasMultipleStars) {
      // Faint blue if player2 has multiple star-levels of this idol
      card.style.backgroundColor = '#edf6fd';
    } else {
      // Otherwise clear
      card.style.backgroundColor = '';
    }
  });
}

// --- Attach drag/drop listeners ---

function attachZoneListeners() {
  ['player1Training', 'player2Training', 'player1Hand', 'player2Hand'].forEach(id => {
    const zone = document.getElementById(id);
    if (!zone) return;
    zone.addEventListener('dragenter', handleDragEnter);
    zone.addEventListener('dragover', allowDrop);
    zone.addEventListener('drop', drop);
    zone.addEventListener('dragleave', removeDragOver);
  });

  // Stage slots listeners
  document.querySelectorAll('.stage-slot').forEach(slot => {
    slot.addEventListener('dragenter', handleDragEnter);
    slot.addEventListener('dragover', allowDrop);
    slot.addEventListener('drop', drop);
    slot.addEventListener('dragleave', removeDragOver);
  });

  refreshStageListeners();
}

// Refresh drag/drop listeners on cards currently on the stage
function refreshStageListeners() {
  document.querySelectorAll('#player1Stage .card, #player2Stage .card').forEach(card => {
    card.removeEventListener('dragover', cardDragOver);
    card.removeEventListener('dragleave', cardDragLeave);
    card.removeEventListener('drop', drop);

    card.addEventListener('dragover', cardDragOver);
    card.addEventListener('dragleave', cardDragLeave);
    card.addEventListener('drop', drop);
  });
}

// Discard drop handler
function onDiscardDrop(ev) {
  ev.preventDefault();
  ev.currentTarget.classList.remove('dragover');

  if (!dragged || !dragged.parentNode) {
    console.warn('No valid dragged element to discard');
    return;
  }

  const cardData = parseCard(dragged);
  if (!cardData) {
    console.warn('Failed to parse card data');
    return;
  }

  // random insertion helper
  const randomIndex = (deckArray) => Math.floor(Math.random() * (deckArray.length + 1));

  if (dragged.classList.contains('support')) {
    supportDeck.splice(randomIndex(supportDeck), 0, cardData);
  } else {
    deck.splice(randomIndex(deck), 0, `${cardData.name} ${'⭐'.repeat(cardData.stars)}`);
  }

  // Clear slot styles if discarded from a stage slot
  const parent = dragged.parentElement;
  if (parent && parent.classList.contains('stage-slot')) {
    parent.classList.remove("filled", "maxed");
  }

  dragged.remove();
  dragged = null;
}

// Attach listeners to both discard zones
function attachDiscardZoneListeners() {
  ['discardLeft', 'discardRight'].forEach(id => {
    const zone = document.getElementById(id);
    if (!zone) return;
    zone.addEventListener('dragenter', handleDragEnter);
    zone.addEventListener('dragover', allowDrop);
    zone.addEventListener('drop', onDiscardDrop);
    zone.addEventListener('dragleave', removeDragOver);
  });
}

// --- Initialize decks and listeners ---
shuffleDeck();
shuffleSupportDeck();

document.addEventListener('DOMContentLoaded', () => {
  attachZoneListeners();
  attachDiscardZoneListeners();
});
