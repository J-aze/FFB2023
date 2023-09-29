let lots = [],
  word_arrays = [];

let UID2users = {},
  UID2tickets = {},
  UID2lots = {};

let lot_number = 0;

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

function getParticipantsFromUsers() {
  return Object.keys(UID2tickets);
}

function getTicketsFromUsers() {
  const tickets = [];

  Object.keys(UID2tickets).forEach((UID) => {
    for (i = 0; i < UID2tickets[UID]; i++) {
      tickets.push(UID);
    }
  });

  return tickets;
}

function resolveAfter2Seconds(n = 2000) {
  countDown();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, n);
  });
}

async function doTirage(current_lot) {
  const result = await resolveAfter2Seconds(3000);

  clearInterval(countdown_);
  const winnerUID = getRandomUID();
  delete UID2tickets[winnerUID];

  shotLotWinner(current_lot.id, winnerUID);

  if (lots.length == 0 || Object.keys(UID2users).length == 0) {
    document.getElementById("boutonTirage").setAttribute("disabled", "true");
  }
  showStats();
}

function nextLot() {
  if (lots.length > 0 && Object.keys(UID2users).length > 0) {
    lot_number++;
    const current_lot = lots.shift();
    displayCurrentLot(lot_number, current_lot);
    doTirage(current_lot);
  } else {
    alert("Plus de tickets en jeu");
  }
}

function sortLotsByPrice(lots) {
  lots.sort((a, b) => b.price - a.price);
}

function prizeDraw() {
  sortLotsByPrice(lots);
  showStats();
  showLots();
  // alert("le tirage peut débuter");
  document.getElementById("boutonTirage").removeAttribute("disabled");
}

function readData(participants_file, lots_file) {
  document.getElementById("boutonTirage").setAttribute("disabled", "true");
  fetch(participants_file)
    .then((response) => response.json())
    .then((participants) => {
      participants.cards.forEach((card) => {
        if (card.tickets.length > 0) {
          UID2tickets[card.UID] = card.tickets.length;
          UID2users[card.UID] = { prenom: card.name, nom: card.surname };
          word_arrays.push({ text: card.name, weight: UID2tickets[card.UID] });
        }
      });

      fetch(lots_file)
        .then((response) => response.json())
        .then((json_lots) => {
          lots = json_lots;

          prizeDraw();
        });
    });
}
