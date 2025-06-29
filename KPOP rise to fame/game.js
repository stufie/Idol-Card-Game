let shuffledDeck = [];
let shuffledSupportDeck = [];
let dragged = null;
let currentHighlight = null; // for upgrade highlight on stage cards
const upgradedIdols = new Set();
let uniqueIdCounter = 0;
let discardModePlayer = null;

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


function parseCard(cardElement) {
  const lines = cardElement.innerText.split("\n").map(l => l.trim()).filter(Boolean);

  const nameLine = lines.find(l => l.includes('⭐'));
  const positionLine = lines.find(l => l.toLowerCase().startsWith('position:'));
  const influenceLine = lines.find(l => l.toLowerCase().startsWith('influence:'));

  const nameMatch = nameLine?.match(/^(.+?)\s+⭐+/);
  const starsMatch = nameLine?.match(/⭐/g);
  const position = positionLine?.split(':')[1]?.trim() || '';
  const influenceMatch = influenceLine?.match(/(\d+)k/);

  return {
    name: nameMatch?.[1]?.trim() || "",
    stars: starsMatch?.length || 0,
    position: position,
    influence: parseInt(influenceMatch?.[1] || "0")
  };
}







// --- Drag & Drop Handlers ---
function drag(ev) {
  dragged = ev.target;
  currentHighlight = null;

  if (!dragged.id) {
    dragged.id = `card-${uniqueIdCounter++}`;
  }
  ev.dataTransfer.setData("text/plain", dragged.id);
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

  let dropZonePlayer = null;
  if (dropZoneId.includes('1')) dropZonePlayer = 'player1';
  else if (dropZoneId.includes('2')) dropZonePlayer = 'player2';
  else if (dropZone.classList.contains('stage-slot')) {
    const stageParent = dropZone.parentElement;
    if (stageParent?.id.includes('1')) dropZonePlayer = 'player1';
    else if (stageParent?.id.includes('2')) dropZonePlayer = 'player2';
  }
  if (!dropZonePlayer || draggedPlayer !== dropZonePlayer) return;

  const isTrainingZone = dropZoneId === `${dropZonePlayer}Training`;
  const isHandZone = draggedParentId.endsWith('Hand');
  const draggedFromStageSlot = draggedParentClassList.contains('stage-slot');
  const draggedFromTrainingZone = draggedParentId === `${dropZonePlayer}Training`;
  const dropIsStageSlot = dropZone.classList.contains('stage-slot');

  const trainingZone = document.getElementById(`${dropZonePlayer}Training`);
  const stageZone = document.getElementById(`${dropZonePlayer}Stage`);
  const trainingCards = Array.from(trainingZone.children).filter(c => c.classList.contains('card'));
  const stageCards = Array.from(stageZone.querySelectorAll('.card'));

  // --- Hand → Training ---
  if (isTrainingZone && isHandZone) {
    if (trainingCards.some(card => parseCard(card)?.name === draggedData.name)) return;
    if (trainingCards.length >= 3) return;

    if (draggedData.stars === 1) {
      dropZone.classList.add('dragover');
      return;
    }

    const validStageMatch = stageCards.some(card => {
      const data = parseCard(card);
      return data && data.name === draggedData.name && data.stars === draggedData.stars - 1;
    });

    if (validStageMatch) dropZone.classList.add('dragover');
    return;
  }

  // --- Training → Stage Slot ---
  if (dropIsStageSlot && draggedFromTrainingZone) {
    const existingCard = dropZone.querySelector('.card');
    const isCenterSlot = dropZone.id.includes("Center");

    if (isCenterSlot && draggedData.stars < 3) {
      return; // Center slot requires 3-star idol
    }

    if (!existingCard) {
      if (draggedData.stars === 1 || (isCenterSlot && draggedData.stars === 3)) {
        dropZone.classList.add('dragover');
        return;
      }
    }

    if (existingCard) {
      const existingData = parseCard(existingCard);
      if (existingData.name === draggedData.name && draggedData.stars === existingData.stars + 1) {
        dropZone.classList.add('dragover');
        return;
      }
      // Allow swapping any stars here as per your request (except center slot rules)
      if (!isCenterSlot) {
        dropZone.classList.add('dragover');
        return;
      }
    }
  }

  // --- Stage → Training ---
  if (isTrainingZone && draggedFromStageSlot) {
    if (trainingCards.some(card => parseCard(card)?.name === draggedData.name)) return;
    if (trainingCards.length >= 3) return;
    dropZone.classList.add('dragover');
    return;
  }

  // --- Stage → Stage ---
  if (draggedFromStageSlot && dropIsStageSlot) {
    const existingCard = dropZone.querySelector('.card');
    const isCenterSlotDrop = dropZone.id.includes("Center");
    const isCenterSlotDrag = draggedParent.id.includes("Center");

    const draggedStars = draggedData.stars;
    const existingStars = existingCard ? parseCard(existingCard).stars : null;

    if ((isCenterSlotDrop || isCenterSlotDrag) && (draggedStars < 3 || (existingCard && existingStars < 3))) {
      console.warn("Swaps involving Center slot require both idols to be ⭐⭐⭐.");
      return;
    }

    // Always allow drop into empty stage slot
    if (!existingCard) {
      dropZone.classList.add('dragover');
      return;
    }

    const existingData = parseCard(existingCard);
    const starDiff = draggedStars - existingData.stars;
    if ((existingData.name === draggedData.name && starDiff === 1) || (existingData.name !== draggedData.name)) {
      dropZone.classList.add('dragover');
    }
    return;
  }

  // --- Training → Training ---
  if (isTrainingZone && draggedFromTrainingZone) {
    dropZone.classList.add('dragover');
    return;
  }

  // --- Hand → Stage is blocked ---
  if (isHandZone && dropIsStageSlot) return;
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
  if (!draggedData) return;

  let dropZonePlayer = null;
  if (dropZone.id) {
    dropZonePlayer = dropZone.id.includes('1') ? 'player1' : (dropZone.id.includes('2') ? 'player2' : null);
  } else if (dropZone.classList.contains('stage-slot')) {
    const stageZone = dropZone.parentElement;
    dropZonePlayer = stageZone.id.includes('1') ? 'player1' : 'player2';
  }

  if (!dropZonePlayer || draggedPlayer !== dropZonePlayer) {
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

    const slotTypeRaw = slot.id.replace(/player\d/, ''); // e.g. 'Center', 'Vocal'
    const slotType = slotTypeRaw.toLowerCase();

    // For center slot, always treat as matched
    if (slotTypeRaw.toLowerCase() === 'center') {
      slot.classList.add('matched');
      return;
    }

    const positions = (data.position || "").toLowerCase().split('/');
    const positionMatch = positions.some(pos => pos === slotType);
    slot.classList.toggle('matched', positionMatch);
  };

  const clearSlotStyle = (slot) => {
    if (!slot.querySelector('.card')) {
      slot.classList.remove("filled", "maxed", "matched");
    }
  };

  if (isTrainingZone && draggedFromHandZone) {
    const trainingCards = Array.from(trainingZone.children).filter(c => c.classList.contains('card'));
    const stageCards = Array.from(stageZone.querySelectorAll('.card'));
    const hasMatchingLowerStarOnStage = stageCards.some(card => {
      const data = parseCard(card);
      return data && data.name === draggedData.name && data.stars === draggedData.stars - 1;
    });

    if (draggedData.stars !== 1 && !hasMatchingLowerStarOnStage) return clearHighlight(), removeDragOver(ev);
    if (trainingCards.some(card => parseCard(card)?.name === draggedData.name)) return clearHighlight(), removeDragOver(ev);
    if (trainingCards.length >= 3) return clearHighlight(), removeDragOver(ev);

    trainingZone.appendChild(dragged);
    clearHighlight(); removeDragOver(ev);
    updateMatchingIdolHighlights(draggedPlayer);
    updateStageScores();
    return;
  }

  if (dropIsStageSlot && draggedFromTrainingZone) {
    const existingCard = dropZone.querySelector('.card');
    const isCenterSlot = dropZone.id.includes("Center");

    if (isCenterSlot && draggedData.stars < 3) {
      clearHighlight(); removeDragOver(ev);
      return; // Center slot requires 3-star idol
    }

    if (!existingCard) {
      if (draggedData.stars === 1 || (isCenterSlot && draggedData.stars === 3)) {
        dropZone.appendChild(dragged);
        updateSlotStyle(dropZone, draggedData);
        clearHighlight(); removeDragOver(ev);
        updateMatchingIdolHighlights(draggedPlayer);
        updateStageScores();
        return;
      }
    }

    if (existingCard) {
      const existingData = parseCard(existingCard);
      if (existingData.name === draggedData.name && draggedData.stars === existingData.stars + 1) {
        dropZone.replaceChild(dragged, existingCard);
        updateSlotStyle(dropZone, draggedData);

        // Track upgraded idol names globally
        if (draggedData.stars === 3) {
          upgradedIdols.add(draggedData.name);
        }

        clearHighlight(); removeDragOver(ev);
        updateMatchingIdolHighlights(draggedPlayer);
        updateStageScores();
        return;
      }
      // Allow swapping any stars here except center slot rules
      if (!isCenterSlot) {
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
  }

  if (isTrainingZone && draggedFromStageSlot) {
    const trainingCards = Array.from(trainingZone.children).filter(c => c.classList.contains('card'));
    if (trainingCards.some(card => parseCard(card)?.name === draggedData.name)) return clearHighlight(), removeDragOver(ev);
    if (trainingCards.length >= 3) return clearHighlight(), removeDragOver(ev);

    trainingZone.appendChild(dragged);
    clearSlotStyle(draggedParent);
    clearHighlight(); removeDragOver(ev);
    updateMatchingIdolHighlights(draggedPlayer);
    updateStageScores();
    return;
  }

  if (draggedFromStageSlot && dropIsStageSlot) {
    const existingCard = dropZone.querySelector('.card');
    const isCenterSlotDrop = dropZone.id.includes("Center");
    const isCenterSlotDrag = draggedParent.id.includes("Center");

    const draggedStars = draggedData.stars;
    const existingStars = existingCard ? parseCard(existingCard).stars : null;

    if ((isCenterSlotDrop || isCenterSlotDrag) && (draggedStars < 3 || (existingCard && existingStars < 3))) {
      console.warn("Swaps involving Center slot require both idols to be ⭐⭐⭐.");
      clearHighlight(); removeDragOver(ev);
      return;
    }

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
    const starDiff = draggedStars - existingData.stars;
    if (existingData.name === draggedData.name && starDiff === 1) {
      dropZone.replaceChild(dragged, existingCard);
      updateSlotStyle(dropZone, draggedData);
      clearSlotStyle(draggedParent);
      clearHighlight(); removeDragOver(ev);
      updateMatchingIdolHighlights(draggedPlayer);
      updateStageScores();
      return;
    }

    dropZone.replaceChild(dragged, existingCard);
    draggedParent.appendChild(existingCard);
    updateSlotStyle(dropZone, draggedData);
    updateSlotStyle(draggedParent, existingData);
    clearHighlight(); removeDragOver(ev);
    updateMatchingIdolHighlights(draggedPlayer);
    updateStageScores();
    return;
  }

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

  clearHighlight(); removeDragOver(ev);
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



function cleanPush(arr, val) {
  if (!arr.includes(val)) {
    arr.push(val);
    console.log(`Added ${val} to deck`);
  } else {
    console.log(`Skipped duplicate: ${val}`);
  }
}

function toggleDiscardMode(player) {
  const discardBtn = document.getElementById(`${player}DiscardBtn`);

  // If already in discard mode for the same player, confirm discard
  if (discardModePlayer === player) {
    const selectedCards = Array.from(document.querySelectorAll(`.card.selected[data-player="${player}"]`));

    if (selectedCards.length === 0) {
      discardModePlayer = null;
      discardBtn.classList.remove('active-discard');
      discardBtn.textContent = "🗑️ Discard";
      clearCardSelection(player);
      return;
    }

    selectedCards.forEach(card => {
      const cardData = parseCard(card);
      if (!cardData) return;

      const { name, stars } = cardData;
      const parent = card.parentElement;
      const fromStageOrTraining = parent?.classList.contains('stage-slot') || parent?.id.endsWith('Training');

      if (card.classList.contains('support')) {
        cleanPush(supportDeck, name);
      } else {
        if (fromStageOrTraining && upgradedIdols.has(name)) {
          if (stars === 3) {
            cleanPush(deck, `${name} ⭐`);
            cleanPush(deck, `${name} ⭐⭐`);
            cleanPush(deck, `${name} ⭐⭐⭐`);
            upgradedIdols.delete(name);
          } else if (stars === 2) {
            cleanPush(deck, `${name} ⭐`);
            cleanPush(deck, `${name} ⭐⭐`);
            // Leave upgradedIdols entry intact
          } else if (stars === 1) {
            cleanPush(deck, `${name} ⭐`);
          }
        } else {
          cleanPush(deck, `${name} ${'⭐'.repeat(stars)}`);
        }
      }

      if (parent && parent.classList.contains('stage-slot')) {
        parent.classList.remove("filled", "maxed", "matched");
      }

      card.remove();
    });

    discardModePlayer = null;
    discardBtn.classList.remove('active-discard');
    discardBtn.textContent = "🗑️ Discard";
    clearCardSelection(player);
    updateStageScores();
    return;
  }

  // Enter discard mode
  discardModePlayer = player;
  discardBtn.classList.add('active-discard');
  discardBtn.textContent = "✅ Confirm Discard";

  clearCardSelection(player);

  document.querySelectorAll(`.card[data-player="${player}"]`).forEach(card => {
    card.onclick = () => {
      if (discardModePlayer !== player) return;
      card.classList.toggle('selected');
    };
  });
}

function clearCardSelection(player) {
  document.querySelectorAll(`.card.selected[data-player="${player}"]`).forEach(card => {
    card.classList.remove('selected');
    card.onclick = null;
  });
}


// --- Initialize decks and listeners ---
shuffleDeck();
shuffleSupportDeck();

document.addEventListener('DOMContentLoaded', () => {
  attachZoneListeners();
  attachDiscardZoneListeners();
});