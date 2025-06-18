document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');
  const viewButtons = document.getElementById('view-buttons');
  const dailyViewButton = document.getElementById('daily-view');
  const weeklyViewButton = document.getElementById('weekly-view');
  const calendarView = document.getElementById('calendar-view');
  const dailyViewPanel = document.getElementById('daily-view-panel');
  const weeklyViewPanel = document.getElementById('weekly-view-panel');
  const monthlyReviewPanel = document.getElementById('monthly-review-panel');

  const prevMonthBtn = document.getElementById('prev');
  const nextMonthBtn = document.getElementById('next');
  const monthYearSpan = document.getElementById('month-year');
  const calendarGrid = document.getElementById('calendar');
  const eventListTitle = document.getElementById('event-list-title');
  const eventList = document.getElementById('event-list');
  const monthlyReviewBtn = document.getElementById('monthly-review-btn');

  // 各ビュー内の「カレンダーに戻る」ボタン
  const backToCalendarDailyBtn = document.getElementById('back-to-calendar-daily');
  const backToCalendarWeeklyBtn = document.getElementById('back-to-calendar-weekly');
  const backToCalendarMonthlyBtn = document.getElementById('back-to-calendar-monthly');

  // メインコンテンツ直下の「カレンダーに戻る」ボタン (普段は非表示)
  const mainBackToCalendarButton = mainContent.querySelector('.main-back-button');

  const dailyCurrentDateElem = document.getElementById('daily-current-date');
  const prevDayBtn = document.getElementById('prev-day');
  const nextDayBtn = document.getElementById('next-day');
  const idealScheduleTimeline = document.getElementById('ideal-schedule-timeline');
  const actualResultTimeline = document.getElementById('actual-result-timeline');
  const addScheduleBtns = document.querySelectorAll('.add-schedule-btn');
  const scheduleAddModal = document.getElementById('schedule-add-modal');
  const scheduleModalTitle = document.getElementById('schedule-modal-title');
  const scheduleTypeInput = document.getElementById('schedule-type');
  const startTimeInput = document.getElementById('start-time');
  const endTimeInput = document.getElementById('end-time');
  const scheduleNameInput = document.getElementById('schedule-name');
  const scheduleCategorySelect = document.getElementById('schedule-category');
  const saveScheduleBtn = document.getElementById('save-schedule-btn');

  const dailyNewTodoInput = document.getElementById('daily-new-todo');
  const dailyAddTodoBtn = document.getElementById('daily-add-todo');
  const dailyTodoList = document.getElementById('daily-todo-list');

  const dailyReflectionTextarea = document.getElementById('daily-reflection-text');
  const saveReflectionBtn = document.getElementById('save-reflection-btn');
  const reflectionSavedMessage = document.getElementById('reflection-saved-message');
  const starDayBtn = document.getElementById('star-day-btn');

  const expensePurposeInput = document.getElementById('expense-purpose');
  const expenseAmountInput = document.getElementById('expense-amount');
  const addExpenseBtn = document.getElementById('add-expense-btn');
  const expenseList = document.getElementById('expense-list');
  const totalExpenseSpan = document.getElementById('total-expense');

  // 週単位ビュー要素
  const weeklyHeader = document.getElementById('weekly-header');
  const prevWeekBtn = document.getElementById('prev-week');
  const nextWeekBtn = document.getElementById('next-week');
  const weeklyRangeSpan = document.getElementById('weekly-range');
  const weeklyViewPlanBtn = document.getElementById('weekly-view-plan');
  const weeklyViewActualBtn = document.getElementById('weekly-view-actual');
  const weeklyChartCanvas = document.getElementById('weekly-chart');
  const weeklyChartLegend = document.getElementById('weekly-chart-legend');
  const goalReflectionToggle = document.getElementById('goal-reflection-toggle');
  const goalListUl = document.getElementById('goal-list');
  const addGoalBtn = document.getElementById('add-goal-btn');
  const goalAddModal = document.getElementById('goal-add-modal');
  const goalNameInput = document.getElementById('goal-name-input');
  const goalColorSelect = document.getElementById('goal-color-select');
  const saveGoalBtn = document.getElementById('save-goal-btn');

  // 月単位振り返り要素
  const monthlyReviewTitle = document.getElementById('monthly-review-title');
  const monthlyPieChartCanvas = document.getElementById('monthly-pie-chart');
  const monthlyStudyDataBody = document.getElementById('monthly-study-data');
  const monthlyTotalExpensesSpan = document.getElementById('monthly-total-expenses');
  const monthlyTotalIncomeSpan = document.getElementById('monthly-total-income');
  const monthlyExpenseSummaryDataBody = document.getElementById('monthly-expense-summary-data');
  const starredReflectionsGrid = document.getElementById('starred-reflections-grid');

  // バイト収入関連
  const hourlyWageInput = document.getElementById('hourly-wage');
  const monthlyWorkHoursSpan = document.getElementById('monthly-work-hours');
  const monthlyIncomeSpan = document.getElementById('monthly-income');

  let currentMonth = new Date();
  let currentDailyDate = new Date(); // 日単位表示用
  let currentWeekStartDate = new Date(); // 週単位表示用
  let schedules = loadData('schedules') || [];
  let todos = loadData('todos') || {}; // { "YYYY-MM-DD": [{text: "...", completed: false}] }
  let reflections = loadData('reflections') || {}; // { "YYYY-MM-DD": "振り返りテキスト" }
  let starredDays = new Set(loadData('starredDays') || []); // Setで管理
  let expenses = loadData('expenses') || {}; // { "YYYY-MM-DD": [{purpose: "...", amount: 0}] }
  let goals = loadData('goals') || []; // 週単位の目標タグ
  let hourlyWage = loadData('hourlyWage') || 1000; // 時給を保存

  let weeklyChartInstance = null; // 週次グラフインスタンス
  let monthlyPieChartInstance = null; // 月次円グラフインスタンス

  // --- データ保存・読み込み関数 ---
  function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function loadData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // --- 初期化 ---
  function init() {
    showView('calendar'); // 初期表示はカレンダービュー
    setupEventListeners();
    updateHourlyWageDisplay(); // 時給の初期表示
  }

  function setupEventListeners() {
    prevMonthBtn.addEventListener('click', () => {
      currentMonth.setMonth(currentMonth.getMonth() - 1);
      renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
      currentMonth.setMonth(currentMonth.getMonth() + 1);
      renderCalendar();
    });

    dailyViewButton.addEventListener('click', () => {
      currentDailyDate = new Date(); // 今日を初期値とする
      showView('daily');
    });
    weeklyViewButton.addEventListener('click', () => {
      currentWeekStartDate = getStartOfWeek(new Date()); // 今週を初期値とする
      showView('weekly');
    });
    monthlyReviewBtn.addEventListener('click', () => showView('monthly-review'));

    // 各ビュー内の「カレンダーに戻る」ボタンのイベントリスナー
    backToCalendarDailyBtn.addEventListener('click', () => showView('calendar'));
    backToCalendarWeeklyBtn.addEventListener('click', () => showView('calendar'));
    backToCalendarMonthlyBtn.addEventListener('click', () => showView('calendar'));

    // 日単位ビューのイベントリスナー
    prevDayBtn.addEventListener('click', () => {
      currentDailyDate.setDate(currentDailyDate.getDate() - 1);
      renderDailyView();
    });
    nextDayBtn.addEventListener('click', () => {
      currentDailyDate.setDate(currentDailyDate.getDate() + 1);
      renderDailyView();
    });
    starDayBtn.addEventListener('click', toggleStarDay);

    addScheduleBtns.forEach(button => {
      button.addEventListener('click', (event) => {
        const type = event.target.dataset.type; // 'ideal' or 'actual'
        openScheduleModal(type);
      });
    });

    saveScheduleBtn.addEventListener('click', saveSchedule);

    dailyAddTodoBtn.addEventListener('click', addTodo);
    dailyTodoList.addEventListener('click', (e) => {
      if (e.target.type === 'checkbox') {
        toggleTodoCompletion(e.target.dataset.index);
      } else if (e.target.classList.contains('delete-todo-btn')) {
        deleteTodo(e.target.dataset.index);
      }
    });

    saveReflectionBtn.addEventListener('click', saveDailyReflection);

    addExpenseBtn.addEventListener('click', addExpense);
    expenseList.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-expense-btn')) {
        deleteExpense(e.target.dataset.index);
      }
    });


    // 週単位ビューのイベントリスナー
    prevWeekBtn.addEventListener('click', () => {
      currentWeekStartDate.setDate(currentWeekStartDate.getDate() - 7);
      renderWeeklyView();
    });
    nextWeekBtn.addEventListener('click', () => {
      currentWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);
      renderWeeklyView();
    });
    weeklyViewPlanBtn.addEventListener('click', () => {
      weeklyViewPlanBtn.classList.add('active');
      weeklyViewActualBtn.classList.remove('active');
      renderWeeklyChart('ideal');
    });
    weeklyViewActualBtn.addEventListener('click', () => {
      weeklyViewActualBtn.classList.add('active');
      weeklyViewPlanBtn.classList.remove('active');
      renderWeeklyChart('actual');
    });
    goalReflectionToggle.addEventListener('change', renderWeeklyGoals);
    addGoalBtn.addEventListener('click', () => {
      goalAddModal.style.display = 'flex';
      goalNameInput.value = '';
      goalColorSelect.value = '#FF6384'; // デフォルト色
    });
    saveGoalBtn.addEventListener('click', saveGoal);
    goalAddModal.addEventListener('click', (e) => {
      if (e.target === goalAddModal) {
        goalAddModal.style.display = 'none';
      }
    });
    goalListUl.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-goal-btn')) {
        deleteGoal(e.target.dataset.index);
      }
      if (e.target.type === 'checkbox' && e.target.classList.contains('goal-checkbox')) {
        toggleGoalCompletion(e.target.dataset.name, e.target.checked);
      }
    });

    // 時給入力の変更を監視
    hourlyWageInput.addEventListener('change', updateHourlyWage);
  }

  function showView(view) {
    // 全てのビューとメインの「カレンダーに戻る」ボタンを非表示にする
    calendarView.style.display = 'none';
    dailyViewPanel.style.display = 'none';
    weeklyViewPanel.style.display = 'none';
    monthlyReviewPanel.style.display = 'none';
    mainBackToCalendarButton.style.display = 'none';
    viewButtons.style.display = 'flex'; // 日/週切り替えボタンは常に表示

    if (view === 'calendar') {
      calendarView.style.display = 'flex';
      renderCalendar(); // カレンダーを再描画
    } else if (view === 'daily') {
      dailyViewPanel.style.display = 'block';
      renderDailyView(); // 日単位ビューを再描画
    } else if (view === 'weekly') {
      weeklyViewPanel.style.display = 'block';
      renderWeeklyView(); // 週単位ビューを再描画
    } else if (view === 'monthly-review') {
      monthlyReviewPanel.style.display = 'block';
      renderMonthlyReview(); // 月単位振り返りビューを再描画
    }
  }

  // --- カレンダー描画関数 ---
  function renderCalendar() {
    monthYearSpan.textContent = `${currentMonth.getFullYear()}年${currentMonth.getMonth() + 1}月`;
    calendarGrid.innerHTML = ''; // クリア

    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // 曜日を追加
    ['日', '月', '火', '水', '木', '金', '土'].forEach(day => {
      const dayElement = document.createElement('div');
      dayElement.classList.add('weekday');
      dayElement.textContent = day;
      calendarGrid.appendChild(dayElement);
    });

    // 月の最初の日までの空白を追加
    let firstDayIndex = firstDayOfMonth.getDay();
    // 日曜日始まりの場合、日曜日を0とする
    if (firstDayIndex === 0) {
      firstDayIndex = 0;
    } else {
      // 月曜日始まりにする場合、以下のように調整
      // firstDayIndex = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;
    }

    for (let i = 0; i < firstDayIndex; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.classList.add('day', 'empty');
      calendarGrid.appendChild(emptyDay);
    }

    // 日付を追加
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement('div');
      dayElement.classList.add('day');
      dayElement.textContent = day;

      const dateString = formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
      dayElement.dataset.date = dateString; // YYYY-MM-DD形式でデータを保持

      // 曜日によって色を変える
      const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      if (currentDate.getDay() === 0) { // 日曜日
        dayElement.classList.add('sunday');
      } else if (currentDate.getDay() === 6) { // 土曜日
        dayElement.classList.add('saturday');
      }

      // その日の予定を表示 (最大3つ)
      const dailySchedules = schedules.filter(s =>
        formatDate(new Date(s.date)) === dateString && s.type === 'actual' // 実際の結果のみ表示
      ).sort((a, b) => {
        // 時間でソート
        const timeA = a.startTime.split(':').map(Number);
        const timeB = b.startTime.split(':').map(Number);
        if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
        return timeA[1] - timeB[1];
      });

      // 星マークの表示
      if (starredDays.has(dateString)) {
        const starIcon = document.createElement('span');
        starIcon.classList.add('star-icon');
        starIcon.textContent = '⭐';
        dayElement.appendChild(starIcon);
      }

      for (let i = 0; i < Math.min(dailySchedules.length, 3); i++) {
        const eventSpan = document.createElement('span');
        eventSpan.classList.add('event');
        eventSpan.textContent = dailySchedules[i].name;
        eventSpan.style.borderLeftColor = getCategoryColor(dailySchedules[i].category);
        dayElement.appendChild(eventSpan);
      }
      if (dailySchedules.length > 3) {
        const moreIndicator = document.createElement('span');
        moreIndicator.classList.add('event', 'more-indicator');
        moreIndicator.textContent = `...他${dailySchedules.length - 3}件`;
        dayElement.appendChild(moreIndicator);
      }

      // クリックで日単位ビューに切り替え
      dayElement.addEventListener('click', () => {
        currentDailyDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        showView('daily');
      });

      calendarGrid.appendChild(dayElement);
    }
    renderEventList(formatDate(new Date())); // カレンダー表示時に今日の予定を表示
  }

  function formatDate(date) {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function getCategoryColor(category) {
    switch (category) {
      case '勉強': return '#FF6384';
      case 'バイト': return '#36A2EB';
      case 'サークル': return '#FFCE56';
      case 'プライベート': return '#4BC0C0';
      case 'その他': return '#9966FF';
      default: return '#ccc';
    }
  }

  function renderEventList(dateString) {
    const today = new Date();
    const isToday = formatDate(today) === dateString;
    eventListTitle.textContent = isToday ? '今日の予定' : `${new Date(dateString).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}の予定`;

    const dailySchedules = schedules.filter(s =>
      formatDate(new Date(s.date)) === dateString && s.type === 'actual' // 実際の結果のみ表示
    ).sort((a, b) => {
      // 時間でソート
      const timeA = a.startTime.split(':').map(Number);
      const timeB = b.startTime.split(':').map(Number);
      if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
      return timeA[1] - timeB[1];
    });

    eventList.innerHTML = '';
    if (dailySchedules.length === 0) {
      const noEventItem = document.createElement('li');
      noEventItem.textContent = '予定はありません。';
      eventList.appendChild(noEventItem);
      return;
    }

    dailySchedules.forEach(s => {
      const listItem = document.createElement('li');
      listItem.textContent = `${s.startTime} - ${s.endTime} ${s.name} (${s.category})`;
      listItem.style.borderLeftColor = getCategoryColor(s.category);
      eventList.appendChild(listItem);
    });
  }

  // --- 日単位ビュー関数 ---
  function renderDailyView() {
    const dateString = formatDate(currentDailyDate);
    dailyCurrentDateElem.textContent = currentDailyDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short' });

    // 星マークの状態を更新
    if (starredDays.has(dateString)) {
      starDayBtn.classList.add('active');
    } else {
      starDayBtn.classList.remove('active');
    }

    renderTimeline(idealScheduleTimeline, 'ideal', dateString);
    renderTimeline(actualResultTimeline, 'actual', dateString);
    renderDailyTodoList(todos[dateString] || []);
    dailyReflectionTextarea.value = reflections[dateString] || '';
    reflectionSavedMessage.style.display = 'none'; // メッセージを非表示にリセット
    renderDailyExpenses(expenses[dateString] || []);
  }

  function renderTimeline(timelineElement, type, dateString) {
    timelineElement.innerHTML = ''; // クリア

    // 時間軸を描画
    for (let h = 0; h < 24; h++) {
      const hourDiv = document.createElement('div');
      hourDiv.classList.add('time-slot');
      if (h % 1 === 0) { // 1時間ごとに表示
        const timeLabel = document.createElement('span');
        timeLabel.classList.add('time-label');
        timeLabel.textContent = `${String(h).padStart(2, '0')}:00`;
        hourDiv.appendChild(timeLabel);
      }
      timelineElement.appendChild(hourDiv);
    }

    // 予定/実際の結果イベントを描画
    const dailyEvents = schedules.filter(s =>
      formatDate(new Date(s.date)) === dateString && s.type === type
    ).sort((a, b) => {
      // 時間でソート
      const timeA = a.startTime.split(':').map(Number);
      const timeB = b.startTime.split(':').map(Number);
      if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
      return timeA[1] - timeB[1];
    });

    dailyEvents.forEach(event => {
      const startMinutes = timeToMinutes(event.startTime);
      const endMinutes = timeToMinutes(event.endTime);
      let durationMinutes = endMinutes - startMinutes;

      // 終了時刻が開始時刻より前の場合は翌日とみなし、24:00までの時間で計算
      if (durationMinutes < 0) {
        const startOfDayMinutes = 0; // 00:00
        const endOfDayMinutes = 24 * 60; // 24:00

        // 翌日へのイベントは一旦24:00までで切る
        const eventHeight = ((endOfDayMinutes - startMinutes) / 60) * 40; // 1時間40px

        const eventDiv = document.createElement('div');
        eventDiv.classList.add('schedule-event');
        eventDiv.textContent = `${event.name} (${event.category})`;
        eventDiv.style.top = `${(startMinutes / 60) * 40}px`;
        eventDiv.style.height = `${eventHeight}px`;
        eventDiv.style.backgroundColor = getCategoryColor(event.category) + '33'; // 半透明
        eventDiv.style.borderLeftColor = getCategoryColor(event.category);
        timelineElement.appendChild(eventDiv);

        // 翌日分は別の日として保存されるため、ここでは考慮しない
      } else {
        const eventHeight = (durationMinutes / 60) * 40; // 1時間40px

        const eventDiv = document.createElement('div');
        eventDiv.classList.add('schedule-event');
        eventDiv.textContent = `${event.name} (${event.category})`;
        eventDiv.style.top = `${(startMinutes / 60) * 40}px`;
        eventDiv.style.height = `${eventHeight}px`;
        eventDiv.style.backgroundColor = getCategoryColor(event.category) + '33'; // 半透明
        eventDiv.style.borderLeftColor = getCategoryColor(event.category);

        // 編集・削除ボタンを追加
        const editButton = document.createElement('button');
        editButton.textContent = '✎';
        editButton.classList.add('schedule-edit-btn');
        editButton.addEventListener('click', (e) => {
          e.stopPropagation(); // 親要素へのクリックイベント伝播を防ぐ
          editSchedule(event);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '×';
        deleteButton.classList.add('schedule-delete-btn');
        deleteButton.addEventListener('click', (e) => {
          e.stopPropagation(); // 親要素へのクリックイベント伝播を防ぐ
          deleteSchedule(event);
        });

        eventDiv.appendChild(editButton);
        eventDiv.appendChild(deleteButton);

        timelineElement.appendChild(eventDiv);
      }
    });
  }

  function timeToMinutes(time) {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  function openScheduleModal(type, scheduleToEdit = null) {
    scheduleAddModal.style.display = 'flex';
    scheduleTypeInput.value = type;

    if (scheduleToEdit) {
      scheduleModalTitle.textContent = '予定を編集';
      startTimeInput.value = scheduleToEdit.startTime;
      endTimeInput.value = scheduleToEdit.endTime;
      scheduleNameInput.value = scheduleToEdit.name;
      scheduleCategorySelect.value = scheduleToEdit.category;
      saveScheduleBtn.textContent = '更新';
      saveScheduleBtn.dataset.originalSchedule = JSON.stringify(scheduleToEdit); // 元のスケジュールを保存
    } else {
      scheduleModalTitle.textContent = '予定を追加';
      startTimeInput.value = '';
      endTimeInput.value = '';
      scheduleNameInput.value = '';
      scheduleCategorySelect.value = '勉強'; // デフォルト値
      saveScheduleBtn.textContent = '追加';
      delete saveScheduleBtn.dataset.originalSchedule;
    }

    // モーダル外クリックで閉じる
    // イベントリスナーを毎回追加すると重複するため、一度だけ実行するオプションを外すか、モーダル表示時にのみ追加するロジックに変更
    // ここではシンプルに、モーダルが開いているときにオーバーレイをクリックしたら閉じるようにします。
    // イベント伝播を止める必要があるので、modal-contentへのクリックはstopPropagation()する
    scheduleAddModal.onclick = (e) => {
      if (e.target === scheduleAddModal) {
        scheduleAddModal.style.display = 'none';
      }
    };
    document.querySelector('#schedule-add-modal .modal-content').onclick = (e) => {
      e.stopPropagation();
    };
  }

  function saveSchedule() {
    const type = scheduleTypeInput.value;
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    const name = scheduleNameInput.value.trim();
    const category = scheduleCategorySelect.value;
    const date = formatDate(currentDailyDate); // 現在の日付

    if (!startTime || !endTime || !name) {
      alert('開始時刻、終了時刻、予定名は必須です。');
      return;
    }

    const newSchedule = { date, type, startTime, endTime, name, category };

    if (saveScheduleBtn.dataset.originalSchedule) {
      // 編集の場合
      const originalSchedule = JSON.parse(saveScheduleBtn.dataset.originalSchedule);
      schedules = schedules.filter(s => !(s.date === originalSchedule.date && s.type === originalSchedule.type && s.startTime === originalSchedule.startTime && s.endTime === originalSchedule.endTime && s.name === originalSchedule.name && s.category === originalSchedule.category));
    }
    schedules.push(newSchedule);
    saveData('schedules', schedules);
    renderDailyView();
    scheduleAddModal.style.display = 'none';
  }

  function editSchedule(scheduleToEdit) {
    openScheduleModal(scheduleToEdit.type, scheduleToEdit);
  }

  function deleteSchedule(scheduleToDelete) {
    if (confirm('この予定を削除しますか？')) {
      schedules = schedules.filter(s => !(s.date === scheduleToDelete.date && s.type === scheduleToDelete.type && s.startTime === scheduleToDelete.startTime && s.endTime === scheduleToDelete.endTime && s.name === scheduleToDelete.name && s.category === scheduleToDelete.category));
      saveData('schedules', schedules);
      renderDailyView();
    }
  }


  function addTodo() {
    const dateString = formatDate(currentDailyDate);
    if (!todos[dateString]) {
      todos[dateString] = [];
    }
    const todoText = dailyNewTodoInput.value.trim();
    if (todoText) {
      todos[dateString].push({ text: todoText, completed: false });
      dailyNewTodoInput.value = '';
      saveData('todos', todos);
      renderDailyTodoList(todos[dateString]);
    }
  }

  function toggleTodoCompletion(index) {
    const dateString = formatDate(currentDailyDate);
    if (todos[dateString] && todos[dateString][index]) {
      todos[dateString][index].completed = !todos[dateString][index].completed;
      saveData('todos', todos);
      renderDailyTodoList(todos[dateString]);
    }
  }

  function deleteTodo(index) {
    const dateString = formatDate(currentDailyDate);
    if (todos[dateString] && todos[dateString][index]) {
      todos[dateString].splice(index, 1);
      saveData('todos', todos);
      renderDailyTodoList(todos[dateString]);
    }
  }

  function renderDailyTodoList(dailyTodos) {
    dailyTodoList.innerHTML = '';
    if (dailyTodos.length === 0) {
      const noTodoItem = document.createElement('li');
      noTodoItem.textContent = '今日のToDoはありません。';
      dailyTodoList.appendChild(noTodoItem);
      return;
    }
    dailyTodos.forEach((todo, index) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <input type="checkbox" data-index="${index}" ${todo.completed ? 'checked' : ''}>
        <span>${todo.text}</span>
        <button class="delete-todo-btn" data-index="${index}">×</button>
      `;
      dailyTodoList.appendChild(listItem);
    });
  }

  function saveDailyReflection() {
    const dateString = formatDate(currentDailyDate);
    reflections[dateString] = dailyReflectionTextarea.value.trim();
    saveData('reflections', reflections);
    reflectionSavedMessage.style.display = 'block';
    setTimeout(() => {
      reflectionSavedMessage.style.display = 'none';
    }, 2000); // 2秒後に消える
  }

  function toggleStarDay() {
    const dateString = formatDate(currentDailyDate);
    if (starredDays.has(dateString)) {
      starredDays.delete(dateString);
      starDayBtn.classList.remove('active');
    } else {
      starredDays.add(dateString);
      starDayBtn.classList.add('active');
    }
    saveData('starredDays', Array.from(starredDays)); // SetをArrayに変換して保存
    renderCalendar(); // カレンダーの星マークを更新
  }

  function addExpense() {
    const dateString = formatDate(currentDailyDate);
    if (!expenses[dateString]) {
      expenses[dateString] = [];
    }
    const purpose = expensePurposeInput.value.trim();
    const amount = parseInt(expenseAmountInput.value, 10);

    if (purpose && !isNaN(amount) && amount >= 0) {
      expenses[dateString].push({ purpose: purpose, amount: amount });
      expensePurposeInput.value = '';
      expenseAmountInput.value = '';
      saveData('expenses', expenses);
      renderDailyExpenses(expenses[dateString]);
    } else {
      alert('用途と有効な金額を入力してください。');
    }
  }

  function deleteExpense(index) {
    const dateString = formatDate(currentDailyDate);
    if (expenses[dateString] && expenses[dateString][index]) {
      expenses[dateString].splice(index, 1);
      saveData('expenses', expenses);
      renderDailyExpenses(expenses[dateString]);
    }
  }

  function renderDailyExpenses(dailyExpenses) {
    expenseList.innerHTML = '';
    let total = 0;

    if (dailyExpenses.length === 0) {
      const listItem = document.createElement('li');
      listItem.textContent = '今日の出費はありません。';
      listItem.style.gridTemplateColumns = '1fr'; // テキストのみの表示
      expenseList.appendChild(listItem);
      totalExpenseSpan.textContent = '0';
      return;
    }

    // ヘッダー行
    // CSSの:before擬似要素で対応するため、JSでは動的に生成しない
    // const headerItem = document.createElement('li');
    // headerItem.classList.add('expense-list-header');
    // headerItem.innerHTML = `<span>用途</span><span>金額</span><span></span>`; // 削除ボタンのスペース
    // expenseList.appendChild(headerItem);

    dailyExpenses.forEach((expense, index) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <span>${expense.purpose}</span>
        <span>${expense.amount.toLocaleString()}円</span>
        <button class="delete-expense-btn" data-index="${index}">×</button>
      `;
      expenseList.appendChild(listItem);
      total += expense.amount;
    });
    totalExpenseSpan.textContent = total.toLocaleString();
  }


  // --- 週単位ビュー関数 ---
  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start (or Sunday start if preferred)
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function renderWeeklyView() {
    // currentWeekStartDateはshowView('weekly')呼び出し時に設定される
    const endOfWeek = new Date(currentWeekStartDate);
    endOfWeek.setDate(currentWeekStartDate.getDate() + 6);

    weeklyRangeSpan.textContent =
      `${currentWeekStartDate.getMonth() + 1}/${currentWeekStartDate.getDate()}〜` +
      `${endOfWeek.getMonth() + 1}/${endOfWeek.getDate()}`;

    // デフォルトで「予定」を表示
    weeklyViewPlanBtn.classList.add('active');
    weeklyViewActualBtn.classList.remove('active');
    renderWeeklyChart('ideal');
    renderWeeklyGoals();
  }

  function renderWeeklyChart(type) {
    if (weeklyChartInstance) {
      weeklyChartInstance.destroy();
    }

    const weeklyLabels = ['月', '火', '水', '木', '金', '土', '日'];
    const datasets = [];
    const categoryColors = {
      '勉強': '#FF6384',
      'サークル': '#FFCE56',
      'バイト': '#36A2EB',
      'プライベート': '#4BC0C0',
      'その他': '#9966FF'
    };
    const categories = Object.keys(categoryColors);

    // 各カテゴリの週ごとの合計時間を計算
    const weeklyData = {};
    categories.forEach(cat => {
      weeklyData[cat] = Array(7).fill(0);
    });

    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStartDate);
      day.setDate(currentWeekStartDate.getDate() + i);
      const dateString = formatDate(day);

      const dailySchedules = schedules.filter(s => formatDate(new Date(s.date)) === dateString && s.type === type);

      dailySchedules.forEach(s => {
        const startMinutes = timeToMinutes(s.startTime);
        const endMinutes = timeToMinutes(s.endTime);
        let durationHours = (endMinutes - startMinutes) / 60;

        // 終了時刻が開始時刻より前の場合は翌日とみなし、24:00までの時間で計算
        if (durationHours < 0) {
            durationHours = (24 * 60 - startMinutes) / 60; // その日の24:00まで
        }

        if (weeklyData[s.category]) {
          weeklyData[s.category][i] += durationHours;
        }
      });
    }

    // Datasetを作成
    categories.forEach(cat => {
      datasets.push({
        label: cat,
        data: weeklyData[cat],
        backgroundColor: categoryColors[cat],
        borderColor: categoryColors[cat],
        borderWidth: 1,
        stack: 'Stack 1' // 積み上げ棒グラフにするためにstackを設定
      });
    });

    const ctx = weeklyChartCanvas.getContext('2d');
    weeklyChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: weeklyLabels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: type === 'ideal' ? '今週の理想の時間の使い方' : '今週の実際の時間の使い方',
            font: { size: 16 }
          },
          tooltip: {
            mode: 'index',
            intersect: false
          },
          legend: {
            display: false // Chart.jsのデフォルト凡例を非表示にし、カスタム凡例を使用
          }
        },
        scales: {
          x: {
            stacked: true, // X軸を積み上げ
            title: {
              display: true,
              text: '曜日'
            }
          },
          y: {
            stacked: true, // Y軸を積み上げ
            beginAtZero: true,
            title: {
              display: true,
              text: '時間 (h)'
            },
            ticks: {
                callback: function(value) {
                    return value + 'h';
                }
            }
          }
        }
      }
    });
    renderWeeklyChartLegend(categories, categoryColors);
  }

  function renderWeeklyChartLegend(categories, colors) {
    weeklyChartLegend.innerHTML = '';
    categories.forEach(category => {
      const legendItem = document.createElement('div');
      legendItem.classList.add('chart-legend-item');
      legendItem.innerHTML = `
        <span class="chart-legend-color" style="background-color: ${colors[category]};"></span>
        <span>${category}</span>
      `;
      weeklyChartLegend.appendChild(legendItem);
    });
  }

  function renderWeeklyGoals() {
    goalListUl.innerHTML = '';
    const goalReflectionEnabled = goalReflectionToggle.checked;

    goals.forEach((goal, index) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <div class="goal-item-content">
          ${goalReflectionEnabled ? `<input type="checkbox" class="goal-checkbox" data-name="${goal.name}" ${goal.completed ? 'checked' : ''}>` : ''}
          <span class="goal-color-dot" style="background-color: ${goal.color};"></span>
          <span>${goal.name}</span>
        </div>
        <button class="delete-goal-btn" data-index="${index}">削除</button>
      `;
      goalListUl.appendChild(listItem);
    });
  }

  function saveGoal() {
    const name = goalNameInput.value.trim();
    const color = goalColorSelect.value;
    if (name) {
      goals.push({ name, color, completed: false }); // 新しい目標は未完了で追加
      saveData('goals', goals);
      renderWeeklyGoals();
      goalAddModal.style.display = 'none';
    } else {
      alert('目標名を入力してください。');
    }
  }

  function deleteGoal(index) {
    if (confirm('この目標を削除しますか？')) {
      goals.splice(index, 1);
      saveData('goals', goals);
      renderWeeklyGoals();
    }
  }

  function toggleGoalCompletion(goalName, completed) {
    const goal = goals.find(g => g.name === goalName);
    if (goal) {
      goal.completed = completed;
      saveData('goals', goals);
      // チェックボックスの状態は自動で更新されるため、再描画は不要
    }
  }

  // --- 月単位振り返り関数 ---
  function renderMonthlyReview() {
    const currentMonthFormatted = currentMonth.toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric' });
    monthlyReviewTitle.textContent = `${currentMonthFormatted}振り返り`;

    // 月次サマリー（円グラフ）
    renderMonthlyPieChart();

    // カテゴリごとの振り返り
    renderCategoryReview();

    // 出費と収入
    renderMonthlyExpensesIncomeSummary();

    // 思い出の振り返り
    renderStarredReflections();
  }

  function renderMonthlyPieChart() {
    if (monthlyPieChartInstance) {
      monthlyPieChartInstance.destroy();
    }

    const monthlySummary = {
      '勉強': 0,
      'サークル': 0,
      'バイト': 0,
      'プライベート': 0,
      'その他': 0
    };
    const categoryColors = {
      '勉強': '#FF6384',
      'サークル': '#FFCE56',
      'バイト': '#36A2EB',
      'プライベート': '#4BC0C0',
      'その他': '#9966FF'
    };

    // 今月のスケジュールを集計
    schedules.forEach(s => {
      const scheduleDate = new Date(s.date);
      if (scheduleDate.getFullYear() === currentMonth.getFullYear() &&
        scheduleDate.getMonth() === currentMonth.getMonth() &&
        s.type === 'actual') { // 実際の結果のみを対象
        const startMinutes = timeToMinutes(s.startTime);
        const endMinutes = timeToMinutes(s.endTime);
        let durationHours = (endMinutes - startMinutes) / 60;

        // 終了時刻が開始時刻より前の場合は翌日とみなし、24:00までの時間で計算
        if (durationHours < 0) {
            durationHours = (24 * 60 - startMinutes) / 60;
        }

        if (monthlySummary[s.category] !== undefined) {
          monthlySummary[s.category] += durationHours;
        }
      }
    });

    const labels = Object.keys(monthlySummary);
    const data = Object.values(monthlySummary);
    const backgroundColors = labels.map(label => categoryColors[label]);

    const ctx = monthlyPieChartCanvas.getContext('2d');
    monthlyPieChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right', // 凡例を右側に表示
            labels: {
              font: {
                size: 14
              },
              boxWidth: 20
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                return `${label}: ${value.toFixed(1)}h`;
              }
            }
          }
        }
      }
    });
  }

  function renderCategoryReview() {
    const monthlyStudySummaries = {};
    let totalWorkHours = 0; // バイトの合計勤務時間

    schedules.forEach(s => {
      const scheduleDate = new Date(s.date);
      if (scheduleDate.getFullYear() === currentMonth.getFullYear() &&
        scheduleDate.getMonth() === currentMonth.getMonth() &&
        s.type === 'actual') { // 実際の結果のみを対象
        const startMinutes = timeToMinutes(s.startTime);
        const endMinutes = timeToMinutes(s.endTime);
        let durationHours = (endMinutes - startMinutes) / 60;
        if (durationHours < 0) {
            durationHours = (24 * 60 - startMinutes) / 60;
        }

        if (s.category === '勉強') {
          monthlyStudySummaries[s.name] = (monthlyStudySummaries[s.name] || 0) + durationHours;
        } else if (s.category === 'バイト') {
          totalWorkHours += durationHours;
        }
      }
    });

    // バイト情報の表示
    monthlyWorkHoursSpan.textContent = `${totalWorkHours.toFixed(1)}時間`;
    const income = totalWorkHours * hourlyWage;
    monthlyIncomeSpan.textContent = `${income.toLocaleString()}円`;

    // 勉強カテゴリのテーブル表示
    renderMonthlyStudyReview(monthlyStudySummaries);
  }

  function renderMonthlyStudyReview(studySummaries) {
    monthlyStudyDataBody.innerHTML = '';
    const sortedEntries = Object.entries(studySummaries).sort((a, b) => b[1] - a[1]); // 時間が多い順

    if (sortedEntries.length === 0) {
      const row = monthlyStudyDataBody.insertRow();
      const cell = row.insertCell();
      cell.colSpan = 2;
      cell.textContent = '今月の勉強記録はありません。';
      return;
    }

    sortedEntries.forEach(([name, hours]) => {
      const row = monthlyStudyDataBody.insertRow();
      const contentCell = row.insertCell();
      const timeCell = row.insertCell();
      contentCell.textContent = name; // 内容
      timeCell.textContent = `${hours.toFixed(1)}h`; // 合計勉強時間
    });
  }

  function renderMonthlyExpensesIncomeSummary() {
    let totalMonthlyExpenses = 0;


    const monthlyExpenseList = [];

    // 今月の出費を集計
    for (const dateString in expenses) {
      const expenseDate = new Date(dateString);
      if (expenseDate.getFullYear() === currentMonth.getFullYear() &&
        expenseDate.getMonth() === currentMonth.getMonth()) {
        expenses[dateString].forEach(expense => {
          totalMonthlyExpenses += expense.amount;
          monthlyExpenseList.push({ date: dateString, purpose: expense.purpose, amount: expense.amount });
        });
      }
    }

    // ここで収入も集計する場合は別途ロジックを追加（例：バイト収入をここに含めるなど）
    // 現状は、バイト収入はカテゴリごとの振り返りで計算されているので、ここでは出費のみを詳細表示

    monthlyTotalExpensesSpan.textContent = totalMonthlyExpenses.toLocaleString() + '円';

    renderMonthlyExpenseSummaryTable(monthlyExpenseList);
  }

// 月の出費と収入のまとめをレンダリングする関数 (今回は出費のみ)
  function renderMonthlyExpensesIncomeSummary() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    let totalMonthlyExpenses = 0;
    const monthlyExpenseDetails = []; // 各出費の個別データを保持

    // 今月の出費を集計し、詳細をリストに格納
    for (const dateString in expenses) {
      const expenseDate = new Date(dateString);
      if (expenseDate.getFullYear() === year && expenseDate.getMonth() === month) {
        expenses[dateString].forEach(expense => {
          totalMonthlyExpenses += expense.amount;
          monthlyExpenseDetails.push({
            date: dateString,
            category: expense.category, // ここは'category'を使用します
            amount: expense.amount
          });
        });
      }
    }

    // テーブルのtbody要素を取得
    const monthlyExpenseTableBody = document.getElementById('monthly-expense-list');
    monthlyExpenseTableBody.innerHTML = ''; // 既存の内容をクリア

    if (monthlyExpenseDetails.length === 0) {
      const row = monthlyExpenseTableBody.insertRow();
      const cell = row.insertCell();
      cell.colSpan = 3; // 3列結合
      cell.textContent = '今月の出費データはありません。';
      cell.style.textAlign = 'center';
      return;
    }

    // 日付順にソート
    monthlyExpenseDetails.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 各出費をテーブルに追加
    monthlyExpenseDetails.forEach(exp => {
      const row = monthlyExpenseTableBody.insertRow();
      const dateCell = row.insertCell();
      const categoryCell = row.insertCell();
      const amountCell = row.insertCell();

      // 日付の表示形式を調整 (例: 6/1)
      const displayDate = new Date(exp.date);
      dateCell.textContent = `${displayDate.getMonth() + 1}/${displayDate.getDate()}`;
      categoryCell.textContent = exp.category;
      amountCell.textContent = `${exp.amount.toLocaleString()}円`; // 金額をカンマ区切りに
      amountCell.style.textAlign = 'right'; // 金額を右寄せ
    });

    // 合計行を追加
    const totalRow = monthlyExpenseTableBody.insertRow();
    totalRow.classList.add('total-expense'); // CSSでスタイルを適用するためのクラス
    const totalLabelCell = totalRow.insertCell();
    totalLabelCell.colSpan = 2; // 「日付」と「用途」の2列を結合
    totalLabelCell.textContent = '合計出費:';
    totalLabelCell.style.textAlign = 'right';
    const totalAmountCell = totalRow.insertCell();
    totalAmountCell.textContent = `${totalMonthlyExpenses.toLocaleString()}円`;
    totalAmountCell.style.textAlign = 'right';
  }

  function renderStarredReflections() {
    starredReflectionsGrid.innerHTML = '';

    const currentMonthReflections = [];
    for (const dateString of starredDays) {
      const reflectionDate = new Date(dateString);
      if (reflectionDate.getFullYear() === currentMonth.getFullYear() &&
        reflectionDate.getMonth() === currentMonth.getMonth() &&
        reflections[dateString]) {
        currentMonthReflections.push({ date: dateString, reflection: reflections[dateString] });
      }
    }

    if (currentMonthReflections.length === 0) {
      const noReflectionItem = document.createElement('p');
      noReflectionItem.textContent = '星マークをつけた日の振り返りはありません。';
      noReflectionItem.style.textAlign = 'center';
      noReflectionItem.style.gridColumn = '1 / -1'; // グリッド全体に表示
      starredReflectionsGrid.appendChild(noReflectionItem);
      return;
    }

    currentMonthReflections.sort((a, b) => new Date(a.date) - new Date(b.date)); // 日付順にソート

    currentMonthReflections.forEach(item => {
      const reflectionItem = document.createElement('div');
      reflectionItem.classList.add('starred-reflection-item');
      reflectionItem.innerHTML = `
        <h5>${new Date(item.date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}</h5>
        <p>${item.reflection}</p>
      `;
      starredReflectionsGrid.appendChild(reflectionItem);
    });
  }

  // --- バイト時給関連関数 ---
  function updateHourlyWage() {
    const newWage = parseInt(hourlyWageInput.value, 10);
    if (!isNaN(newWage) && newWage >= 0) {
      hourlyWage = newWage;
      saveData('hourlyWage', hourlyWage);
      renderCategoryReview(); // 時給が変わったら収入も再計算
    } else {
      hourlyWageInput.value = hourlyWage; // 無効な値の場合は元に戻す
    }
  }

  function updateHourlyWageDisplay() {
    hourlyWageInput.value = hourlyWage;
  }

  // 初期化実行
  init();
});