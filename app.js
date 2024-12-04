const baseURL = "https://deckofcardsapi.com/api/deck";

// Utility function to display errors
function displayError(message) {
  const errorDiv = document.getElementById('error');
  if (errorDiv) {
    errorDiv.innerHTML = `<p style="color: red;">${message}</p>`;
  }
}

// 1. Draw a single card
function drawSingleCard(deckId, cardArea, button, drawTwoButton, resetButton) {
  fetch(`${baseURL}/${deckId}/draw/?count=1`)
    .then(response => response.json())
    .then(cardData => {
      if (cardData.remaining === 0) {
        button.style.display = "none";
        drawTwoButton.style.display = "none";
        resetButton.style.display = "block";
        alert("No more cards left! Reset the deck to play again.");
        return;
      }

      const card = cardData.cards[0];
      console.log(`${card.value.toLowerCase()} of ${card.suit.toLowerCase()}`);

      // Create and display the card
      const cardImg = document.createElement('img');
      cardImg.src = card.image;
      cardImg.style.transform = `translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) rotate(${Math.random() * 90 - 45}deg)`;
      cardArea.appendChild(cardImg);
    })
    .catch(() => displayError("Error drawing single card. Please check your connection."));
}

// 2. Draw two cards
function drawTwoCards(deckId, cardArea, button, drawTwoButton, resetButton) {
  Promise.all([
    fetch(`${baseURL}/${deckId}/draw/?count=1`).then(res => res.json()),
    fetch(`${baseURL}/${deckId}/draw/?count=1`).then(res => res.json()),
  ])
    .then(([firstCardData, secondCardData]) => {
      if (firstCardData.remaining === 0 || secondCardData.remaining === 0) {
        button.style.display = "none";
        drawTwoButton.style.display = "none";
        resetButton.style.display = "block";
        alert("No more cards left! Reset the deck to play again.");
        return;
      }

      [firstCardData.cards[0], secondCardData.cards[0]].forEach(card => {
        console.log(`${card.value.toLowerCase()} of ${card.suit.toLowerCase()}`);

        // Create and display the card
        const cardImg = document.createElement('img');
        cardImg.src = card.image;
        cardImg.style.transform = `translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) rotate(${Math.random() * 90 - 45}deg)`;
        cardArea.appendChild(cardImg);
      });
    })
    .catch(() => displayError("Error drawing two cards. Please check your connection."));
}

// 3. Dynamic drawing and reset
function setup() {
  const button = document.querySelector('button[aria-label="Click to draw a card"]');
  const drawTwoButton = document.getElementById('draw-two-cards');
  const resetButton = document.getElementById('reset-deck');
  const cardArea = document.getElementById('card-area');

  fetch(`${baseURL}/new/shuffle/`)
    .then(response => response.json())
    .then(deckData => {
      let deckId = deckData.deck_id;

      // Show buttons
      button.style.display = "block";
      drawTwoButton.style.display = "block";

      // Draw a single card
      button.addEventListener('click', () =>
        drawSingleCard(deckId, cardArea, button, drawTwoButton, resetButton)
      );

      // Draw two cards
      drawTwoButton.addEventListener('click', () =>
        drawTwoCards(deckId, cardArea, button, drawTwoButton, resetButton)
      );

      // Reset the deck
      resetButton.addEventListener('click', () => {
        fetch(`${baseURL}/new/shuffle/`)
          .then(response => response.json())
          .then(newDeckData => {
            deckId = newDeckData.deck_id;
            cardArea.innerHTML = ""; // Clear all cards
            button.style.display = "block";
            drawTwoButton.style.display = "block";
            resetButton.style.display = "none";
          })
          .catch(() => displayError("Error resetting the deck. Please check your connection."));
      });
    })
    .catch(() => displayError("Error setting up the deck. Please check your connection."));
}

// Call the setup function
setup();
