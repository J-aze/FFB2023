console.log("hello world");

let tickets = [],
  lots = [];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function initTombola(participants) {
  //   const tickets = [];
  participants.forEach((participant) => {
    for (i = 0; i < participant.billets; i++) {
      tickets.push(participant.id);
    }
  });
  //  return tickets;
}

function nextLot() {
  if (lots.length > 0 && tickets.length > 0) {
    //effectuerTirage();
    randomColor();
    const current_lot = lots.shift();

    const tirage = getRandomInt(0, tickets.length);
    winner = tickets[tirage];
    tickets = removeParticipantsFromTombola(tickets, winner);

    shotLotWinner(current_lot.id, winner);

    if (lots.length == 0 || tickets.length == 0) {
      document.getElementById("boutonTirage").setAttribute("disabled", "true");
    }
    showTickets();
  } else {
    alert("Plus de tickets en jeu");
  }
}

function removeParticipantsFromTombola(tickets, id) {
  const updated_tickets = [];
  for (i = 0; i < tickets.length; i++) {
    if (tickets[i] != id) {
      updated_tickets.push(tickets[i]);
    }
  }
  return updated_tickets;
}

function sortLotsByPrice(lots) {
  //   const ordered_lots = lots;

  lots.sort((a, b) => b.price - a.price);

  // return lots;
}

function tirageAuSort() {
  sortLotsByPrice(lots);
  showLots();
  showTickets();
  /*
  while (lots.length > 0 && tickets.length > 0) {
    current_lot = lots.shift();

    tirage = getRandomInt(0, tickets.length);
    winner = tickets[tirage];
    tickets = removeParticipantsFromTombola(tickets, winner);

    shotLotWinner(current_lot.id, winner);
  }
  */
}

function readData(participants_file, lots_file) {
  fetch(participants_file)
    .then((response) => response.json())
    .then((participants) => {
      fetch(lots_file)
        .then((response) => response.json())
        .then((json_lots) => {
          lots = json_lots;
          initTombola(participants);
          tirageAuSort(participants);
        });
    });
}

function showTickets() {
  const tickets_html = document.getElementById("tickets");
  tickets_html.innerHTML = tickets.length + " tickets en jeu";
}

function showLots() {
  const lots_html = document.getElementById("lots");
  lots_html.innerHTML = "";
  const title = document.createElement("h2");
  title.innerHTML = "lots";
  lots_html.appendChild(title);
  const list = document.createElement("ol");
  lots.forEach((lot) => {
    const li = document.createElement("li");
    li.setAttribute("id", "lot_" + lot.id);
    li.innerHTML = lot.name + " - " + lot.price;
    list.appendChild(li);
  });
  lots_html.appendChild(list);
}

function shotLotWinner(id_lot, winner) {
  const lot_html = document.getElementById("lot_" + id_lot);
  lot_html.setAttribute("class", "won");
  lot_html.innerHTML += " gagné par <b>" + winner + "</b>";

  clearInterval(countdown_);
  tombola_animation_html.innerHTML = winner;
}

function makeRandomString(length) {
  var chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  var char_length = chars.length;
  var result = "";
  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * char_length));
  }
  return result;
}

function makeRandomLots(n = 10) {
  lots = [];
  for (let i = 1; i <= n; i++) {
    lots.push({
      id: i,
      name: makeRandomString(10),
      price: 100 * Math.random(),
    });
  }
  // return lots;
}

function makeRandomParticipants(n = 100) {
  const participants = [];
  for (let i = 1; i <= n; i++) {
    participants.push({
      id: i,
      billets: getRandomInt(1, 101),
    });
  }
  return participants;
}

function doRandomTest(nbParticipants, nbLots) {
  const random_participants = makeRandomParticipants(nbParticipants);
  makeRandomLots(nbLots);
  initTombola(random_participants);
  tirageAuSort(random_participants);
}

function randomColor() {
  // Implémentez votre logique de tirage ici
  // Par exemple, changez la couleur de fond de la tombola de manière aléatoire

  const couleurAleatoire =
    couleurs[Math.floor(Math.random() * couleurs.length)];
  tombola_animation_html.style.backgroundColor = couleurAleatoire;
}

const tombola_animation_html = document.getElementById("tombola_animation");
const boutonTirage = document.getElementById("boutonTirage");
const couleurs = ["red", "blue", "green", "yellow"];
let countdown_;

function countdown() {
  const i = getRandomInt(0, tickets.length);
  tombola_animation_html.innerHTML = tickets[i];

  countdown_ = setTimeout(() => {
    countdown();
  }, 10);
}

boutonTirage.addEventListener("click", () => {
  // Ajoutez la classe "animate" pour déclencher l'animation
  tombola_animation_html.classList.add("animate");

  randomColor();
  countdown();

  // Supprimez la classe après un certain délai pour permettre une nouvelle animation
  setTimeout(() => {
    nextLot();
    tombola_animation_html.classList.remove("animate");
  }, 2000); // 1000ms correspond à la durée de l'animation
});

// doRandomTest(100, 10);

readData("data/participants.json", "data/lots.json");
