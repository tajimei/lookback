const calendar = document.getElementById("calendar");
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth(); // 0〜11

function createCalendar(year, month) {
  calendar.innerHTML = ""; // 一旦リセット

  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();
  const startDay = firstDay.getDay();

  // 空白セルを追加（日曜始まり）
  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement("div");
    calendar.appendChild(empty);
  }

  // 日付セルを追加
  for (let date = 1; date <= lastDate; date++) {
    const dayCell = document.createElement("div");
    dayCell.className = "day";
    dayCell.textContent = date;

    dayCell.addEventListener("click", () => {
      const event = prompt(`${date}日の予定を入力してください:`);
      if (event) {
        const eventEl = document.createElement("div");
        eventEl.className = "event";
        eventEl.textContent = event;
        dayCell.appendChild(eventEl);
      }
    });

    calendar.appendChild(dayCell);
  }
}

createCalendar(year, month);