// Lista wyzwań
const wyzwania = [
  "Zrób 10 pompek",
  "Idź na 20min spacer",
  "Przeczytaj 10 stron książki",
  "Napisz komuś coś miłego",
  "Nie używaj telefonu przez 1h",
  "Wypij 2 litry wody",
  "Posprzątaj biurko",
  "Zrób 30 przysiadów",
  "Posłuchaj podcastu",
  "Zrób plan dnia",
  "Uśmiechnij się do kogoś",
  "Zrób coś kreatywnego",
  "Medytuj 5 minut",
  "Naucz się czegoś nowego",
  "Zjedz zdrowy posiłek",
  "Zrób 2h przerwę od social mediów",
  "Zadzwoń do znajomego",
  "Poćwicz rozciąganie",
  "Zrób listę celów",
  "Jeździj na rowerze przez 20min"
];

// Zmienne
const btn = document.getElementById("wylosujBtn");
const text = document.getElementById("wyzwanieText");
const dzisiaj = new Date().toLocaleDateString();
const ostatniaData = localStorage.getItem("date");
const ukonczoneBtn = document.getElementById("ukonczoneBtn");
const historiaBtn = document.getElementById("historiaBtn");
const list = document.getElementById("historiaList");

// Funkcja pokazania przycisków ukończenia i historii
function pokazPrzyciski() {
  ukonczoneBtn.style.display = "inline";
  historiaBtn.style.display = "inline";
}

// Powrót zapisanych danych
// Jeśli ostatnia zapisana data jest równa dzisiejszemu dniu to ukazuje zapisane ostatnie wyzwanie
if (ostatniaData === dzisiaj) {
  const zapisaneWyzwanie = localStorage.getItem("wyzwanie");
  text.textContent = zapisaneWyzwanie;
  pokazPrzyciski();
}

// Reset po północy - Sprawdza po włączeniu strony
// Jeśli ostatnia zapisana data nie jest równa dzisiejszemu dniu to wykonuje reset
if (ostatniaData !== dzisiaj) {
  localStorage.removeItem("wyzwanie");
  localStorage.removeItem("historia");
  localStorage.removeItem("ukonczone");
}

// Sprawdza czy wyzwanie zostało już ukończone
if (localStorage.getItem("ukonczone") === "true") {
  text.classList.add("ukonczone");
}

// Przycisk losowania wyzwania
btn.addEventListener("click", () => {
  let wykonaneDzisiaj = JSON.parse(localStorage.getItem("wykonaneDzisiaj")) || [];

  const dostepneWyzwania = wyzwania.filter(w => !wykonaneDzisiaj.includes(w));

  if (dostepneWyzwania.length === 0) {
    alert("Wszystkie wyzwania na dziś zostały już wykonane! 🎉");
    return;
  }

  text.classList.remove("ukonczone");

  const msg = document.getElementById("message");
  if (msg) msg.remove();

  // Animacja losowania
  let i = 0;

  const interval = setInterval(() => {
    text.textContent = dostepneWyzwania[i % dostepneWyzwania.length];
    i++;
  }, 100);

  setTimeout(() => {
    clearInterval(interval);

    const randomIndex = Math.floor(Math.random() * dostepneWyzwania.length);
    const wyzwanie = dostepneWyzwania[randomIndex];

    text.textContent = wyzwanie;
    text.classList.add("fade");

    pokazPrzyciski();

    localStorage.setItem("date", dzisiaj);
    localStorage.setItem("wyzwanie", wyzwanie);
    localStorage.setItem("ukonczone", "false");
  }, 1500);
});

// Przycisk ukończenia
ukonczoneBtn.addEventListener("click", () => {
  if (text.classList.contains("ukonczone")) return;

  text.classList.add("ukonczone");

  let msg = document.getElementById("message");
  if (!msg) {
    msg = document.createElement("p");
    msg.id = "message";
    msg.style.margin = "5px 0 0 0";
    msg.style.fontWeight = "bold";
    msg.style.color = "green";

    text.insertAdjacentElement("afterend", msg);
  }

  msg.textContent = "Gratulacje! Wyzwanie wykonane 🎉";

  zapiszDoHistorii(text.textContent);
  localStorage.setItem("ukonczone", "true");

  let wykonaneDzisiaj = JSON.parse(localStorage.getItem("wykonaneDzisiaj")) || [];
  if (!wykonaneDzisiaj.includes(text.textContent)) {
    wykonaneDzisiaj.push(text.textContent);
    localStorage.setItem("wykonaneDzisiaj", JSON.stringify(wykonaneDzisiaj));
  }
});

// Przycisk historii
historiaBtn.addEventListener("click", () => {
  if (list.style.display === "block") {
    list.style.display = "none";
  } else {
    aktualizujHistorie();
    list.style.display = "block";
  }
});

//Funkcja aktualizacji historii
function aktualizujHistorie() {
  list.innerHTML = "";

  const historia = JSON.parse(localStorage.getItem("historia")) || [];

  if (historia.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Brak wykonanych wyzwań dziś.";
    li.style.fontStyle = "italic";
    list.appendChild(li);
  } else {
    historia.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
  }
}

// Funckja zapisu do historii
function zapiszDoHistorii(wyzwanie) {
  let historia = JSON.parse(localStorage.getItem("historia")) || [];
  historia.push(wyzwanie);
  localStorage.setItem("historia", JSON.stringify(historia));

  if (list.style.display === "block") {
    aktualizujHistorie();
  }
}

// Reset po północy - Sprawdza co minutę
setInterval(() => {
    const dzisiaj = new Date().toLocaleDateString();
    const ostatniaData = localStorage.getItem("date");
  
    if (ostatniaData !== dzisiaj) {
    localStorage.removeItem("wyzwanie");
    localStorage.removeItem("historia");
    localStorage.removeItem("ukonczone");
    localStorage.removeItem("wykonaneDzisiaj");

    text.textContent = "";
    text.classList.remove("ukonczone");
    ukonczoneBtn.style.display = "none";
    historiaBtn.style.display = "none";
    list.innerHTML = "";
  }
}, 60000);