const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("month-year");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // 0〜11
let events = {}; // 予定データを保存するオブジェクト

function addEvent(year, month, date, eventText) {
  const key = `${year}-${month}-${date}`;
  if (!events[key]) {
    events[key] = [];
  }
  events[key].push(eventText);
  updateEventList(); // 予定一覧を更新
}

function updateEventList() {
  const list = document.getElementById("event-list");
  list.innerHTML = "";

  const keys = Object.keys(events).filter(key => {
    const [y, m] = key.split("-").map(Number);
    return y === currentYear && m === currentMonth;
  });

  keys.sort((a, b) => {
    const da = Number(a.split("-")[2]);
    const db = Number(b.split("-")[2]);
    return da - db;
  });

  for (const key of keys) {
    const [y, m, d] = key.split("-");
    for (const e of events[key]) {
      const li = document.createElement("li");
      li.textContent = `${d}日: ${e}`;
      list.appendChild(li);
    }
  }
}

function createCalendar(year, month) {
  calendar.innerHTML = ""; // カレンダーをリセット
  monthYear.textContent = `${year}年${month + 1}月`;

  renderWeekdays(); // ここで曜日を表示

  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();
  const startDay = firstDay.getDay();

  // 空白セル
  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement("div");
    calendar.appendChild(empty);
  }

  // 日付セル
  for (let date = 1; date <= lastDate; date++) {
    const dayCell = document.createElement("div");
    dayCell.className = "day";
    dayCell.textContent = date;

    const dateObj = new Date(year, month, date);
    const dayOfWeek = dateObj.getDay(); // 0=Sun, 6=Sat

    if (dayOfWeek === 0) {
      dayCell.style.color = "red"; // 日曜
    } else if (dayOfWeek === 6) {
      dayCell.style.color = "blue"; // 土曜
    }

    dayCell.addEventListener("click", () => {
      const event = prompt(`${date}日の予定を入力してください:`);
      if (event) {
        const eventEl = document.createElement("div");
        eventEl.className = "event";
        eventEl.textContent = event;
        dayCell.appendChild(eventEl);

        addEvent(year, month, date, event); // 🆕予定保存
      }
    });

    calendar.appendChild(dayCell);
  }
}

function renderWeekdays() {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 0; i < 7; i++) {
    const dayHeader = document.createElement("div");
    dayHeader.className = "weekday";
    dayHeader.textContent = weekdays[i];
    calendar.appendChild(dayHeader);
  }
}
// 初期表示
createCalendar(currentYear, currentMonth);
updateEventList();

// ボタンのイベント処理
prevBtn.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  createCalendar(currentYear, currentMonth);
  updateEventList();
});

nextBtn.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  createCalendar(currentYear, currentMonth);
  updateEventList();
});
