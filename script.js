// Helpers
const getDenominations = (desiredAmount, _coinValues) => {
  const records = [];
  _coinValues = _coinValues.sort((a, b) => b - a);
  const coinsInEconomy = _coinValues.length;
  for (let i = 0; i < coinsInEconomy - 1; i++) {
    let collectedCoins = [],
      collectedAmount = 0,
      coinValues = [..._coinValues]; // copy
    while (collectedAmount < desiredAmount) {
      const isNoSolution = !coinValues.length;
      if (isNoSolution) {
        return [];
      }
      const coinValue = coinValues[0];
      const willBust = coinValue + collectedAmount > desiredAmount;
      if (willBust) {
        coinValues.shift();
      } else {
        collectedAmount += coinValue;
        collectedCoins.push(coinValue);
      }
    }
    records.push(collectedCoins);
    _coinValues.shift();
  }
  const collectedCoins = records
    .sort((a, b) => a.length - b.length)[0] // getting the attempt with the lowest amount of coins used
    .reduce((acc, cur) => {
      acc[cur] = acc[cur] ? acc[cur] + 1 : 1;
      return acc;
    }, {});
  return Object.entries(collectedCoins);
};

const createCoinElement = value => {
  const div = document.createElement("div");
  div.classList.add("coin");
  const heads = document.createElement("div");
  heads.classList.add("side", "heads");
  heads.textContent = value;
  const tails = document.createElement("div");
  tails.classList.add("side", "tails");
  tails.textContent = value;
  div.appendChild(heads);
  div.appendChild(tails);
  return div;
};

const createCoinElementList = denominations => {
  return denominations.reduce((list, [coin, freq]) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = `${freq} x `;
    li.appendChild(span);
    li.appendChild(createCoinElement(coin));
    list.appendChild(li);
    return list;
  }, document.createElement("ul"));
};

const getCoinValues = () => {
  const ref = document.querySelector("#dynamic-list");
  const coinValues = [...ref.children].map(li => {
    const text = li.children[0].children[0].textContent;
    return Number(text);
  });
  return coinValues;
};

const getEconomySummary = () => {
  const transactions = [];
  for (let i = minValue; i <= maxValue; i++) {
    const denominations = getDenominations(i, getCoinValues());
    const coinsUsed = denominations.reduce(
      (acc, [coin, freq]) => (acc += freq),
      0
    );
    transactions.push(coinsUsed);
  }
  const totalCoinsUsed = transactions.reduce((sum, cur) => (sum += cur), 0);
  const avgCoinsUsed = (totalCoinsUsed / transactions.length).toFixed(2);
  const summaryTextEl = document.createTextNode(
    `On average, ${avgCoinsUsed} coins are used per transaction in this economy.`
  );
  const summaryRef = document.querySelector("#summary");
  summaryRef.innerHTML = "";
  summaryRef.appendChild(summaryTextEl);
};

// Constants
const minValue = 1;
const maxValue = 100;

// Event Handlers
document.querySelector("#addItem").addEventListener("click", () => {
  const ul = document.querySelector("#dynamic-list"),
    candidate = document.querySelector("#candidate"),
    li = document.createElement("li");
  const value = Math.round(Number(candidate.value));
  if (value >= minValue && value <= maxValue) {
    li.setAttribute("id", value);
    li.appendChild(createCoinElement(value));
    ul.appendChild(li);
  } else {
    const answerRef = document.querySelector("#answer");
    answerRef.innerHTML = "";
    const failMessageEl = document.createTextNode(
      "Could not add this coin to the economy. 😔"
    );
    answerRef.appendChild(failMessageEl);
  }
  getEconomySummary();
});

document.querySelector("#removeItem").addEventListener("click", () => {
  const ul = document.querySelector("#dynamic-list"),
    candidate = document.querySelector("#candidate"),
    item = document.getElementById(candidate.value);
  ul.removeChild(item);
  getEconomySummary();
});

document.querySelector("#change").addEventListener("change", () => {
  const change = Math.round(Number(document.querySelector("#change").value));
  if (change < minValue || change > maxValue) {
    return;
  }
  const denominations = getDenominations(change, getCoinValues());
  const answerRef = document.querySelector("#answer");
  answerRef.innerHTML = "";
  if (!denominations.length) {
    const failMessageEl = document.createTextNode(
      "Change is impossible to denominate with this set of currency. 😔"
    );
    answerRef.appendChild(failMessageEl);
  } else {
    const denominationsEl = createCoinElementList(denominations);
    answerRef.appendChild(denominationsEl);
  }
});

// Main Process
const defaultCoinValues = [1, 5, 10, 25];
defaultCoinValues.forEach(coinValue => {
  const ul = document.querySelector("#dynamic-list"),
    li = document.createElement("li");
  li.setAttribute("id", coinValue);
  li.appendChild(createCoinElement(coinValue));
  ul.appendChild(li);
});
getEconomySummary();