const baseURL = "https://deckofcardsapi.com/api/deck";

// 1. Draw a single card
async function drawSingleCard() {
  try {
    const res = await fetch(`${baseURL}/new/draw/?count=1`);
    const data = await res.json();
    const { value, suit } = data.cards[0];
    console.log(`${value.toLowerCase()} of ${suit.toLowerCase()}`);
  } catch (err) {
    console.error("Error drawing single card:", err);
  }
}

// 2. Draw two cards from the same deck
async function drawTwoCards() {
  try {
    const deckRes = await fetch(`${baseURL}/new/shuffle/`);
    const deckData = await deckRes.json();
    const deckId = deckData.deck_id;

    const firstCardRes = await fetch(`${baseURL}/${deckId}/draw/?count=1`);
    const firstCardData = await firstCardRes.json();
    const { value: value1, suit: suit1 } = firstCardData.cards[0];

    const secondCardRes = await fetch(`${baseURL}/${deckId}/draw/?count=1`);
    const secondCardData = await secondCardRes.json();
    const { value: value2, suit: suit2 } = secondCardData.cards[0];

    console.log(`${value1.toLowerCase()} of ${suit1.toLowerCase()}`);
    console.log(`${value2.toLowerCase()} of ${suit2.toLowerCase()}`);
  } catch (err) {
    console.error("Error drawing two cards:", err);
  }
}

// 3. Draw cards dynamically in the browser
async function setup() {
  const button = document.querySelector('button[aria-label="Click to draw a card"]');
  const resetButton = document.getElementById('reset-deck');
  const cardArea = document.getElementById('card-area');

  try {
    const res = await fetch(`${baseURL}/new/shuffle/`);
    const deckData = await res.json();
    let deckId = deckData.deck_id;

    button.style.display = "block";
    button.addEventListener('click', async () => {
      button.disabled = true;
      try {
        const cardRes = await fetch(`${baseURL}/${deckId}/draw/?count=1`);
        const cardData = await cardRes.json();

        const card = cardData.cards[0];
        console.log(`${card.value.toLowerCase()} of ${card.suit.toLowerCase()}`); // Log card details

        const cardImg = document.createElement('img');
        cardImg.src = card.image;
        cardImg.style.transform = `translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) rotate(${Math.random() * 90 - 45}deg)`;
        cardArea.appendChild(cardImg);

        if (cardData.remaining === 0) {
          button.style.display = "none";
          resetButton.style.display = "block";
          alert("No more cards left! Reset the deck to play again.");
        }
      } catch (err) {
        console.error("Error drawing card:", err);
      } finally {
        button.disabled = false;
      }
    });

    resetButton.addEventListener('click', async () => {
      try {
        const res = await fetch(`${baseURL}/new/shuffle/`);
        const data = await res.json();
        deckId = data.deck_id;
        cardArea.innerHTML = "";
        button.style.display = "block";
        resetButton.style.display = "none";
      } catch (err) {
        console.error("Error resetting deck:", err);
      }
    });
  } catch (err) {
    console.error("Error setting up deck:", err);
  }
}

// Call the main functions
drawSingleCard();
drawTwoCards();
setup();
