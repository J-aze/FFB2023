function showStats() {
  const stats_html = document.getElementById("stats");
  const participants = getParticipantsFromUsers();
  const tickets = getTicketsFromUsers();

  stats.innerHTML =
    participants.length + " participants / " + tickets.length + " tickets";
}
function showParticipantsCount() {
  const participants_html = document.getElementById("participants");
  const participants = getParticipantsFromUsers();
  participants_html.innerHTML = participants.length + " participants en jeu";
}
function showTicketsCount() {
  const tickets_html = document.getElementById("tickets");
  const tickets = getTicketsFromUsers();
  tickets_html.innerHTML = tickets.length + " tickets en jeu";
}

function displayCurrentLot(number, lot) {
  const current_lot_html = document.getElementById("current_lot");
  current_lot_html.innerHTML =
    "Lot " + number + " (" + lot.price + "€) : " + lot.name;
}

function showLots() {
  let alternate = false;
  let number = 1;
  const lots_html = document.getElementById("lots");
  lots_html.innerHTML = "";
  const list = document.createElement("ol");
  list.setAttribute("class", "list-unstyled mt-3 mb-4");
  lots.forEach((lot) => {
    const li = document.createElement("li");
    li.setAttribute("id", "lot_" + lot.id);
    if (alternate) {
      li.setAttribute("class", "alternate");
    }
    alternate = !alternate;
    li.setAttribute("title", lot.name);
    li.innerHTML = "Lot " + number + " (" + lot.price + "€)";
    list.appendChild(li);
    number++;
  });
  lots_html.appendChild(list);
}

function shotLotWinner(id_lot, UIDwinner) {
  const lot_html = document.getElementById("lot_" + id_lot);
  lot_html.setAttribute("class", "won");
  const winner = UID2users[UIDwinner].prenom + " " + UID2users[UIDwinner].nom;
  lot_html.innerHTML += " gagné par <b>" + winner + "</b>";

  UID2lots[UIDwinner] = id_lot;

  tombola_animation_html.innerHTML = winner;
}

const tombola_animation_html = document.getElementById("tombola_animation");
const boutonTirage = document.getElementById("boutonTirage");
let countdown_;
let randomDrawCountdown;

function getRandomUID() {
  tickets = getTicketsFromUsers();
  shuffleArray(tickets);
  const randomUID = tickets[0];

  return randomUID;
}

function countDown() {
  const randomUID = getRandomUID();
  tombola_animation_html.innerHTML =
    UID2users[randomUID].prenom + " " + UID2users[randomUID].nom;
  countdown_ = setTimeout(() => {
    countDown();
  }, 5);
}

boutonTirage.addEventListener("click", () => {
  nextLot();
});

readData("data/forum-etudiants-21-09-2023-cards.json", "data/lots.json");
