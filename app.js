const STORAGE_KEY = "review-hub-entries";

const form = document.getElementById("entry-form");
const entriesContainer = document.getElementById("entries");
const entryTemplate = document.getElementById("entry-card");
const typeFilter = document.getElementById("type-filter");
const entryGroupFilter = document.getElementById("entry-group-filter");
const groupFilter = document.getElementById("group-filter");
const clearGroupBtn = document.getElementById("clear-group-btn");
const searchInput = document.getElementById("search-input");
const statsGrid = document.getElementById("stats-grid");
const shelfGrid = document.getElementById("shelf-grid");
const groupChips = document.getElementById("group-chips");
const monthCount = document.getElementById("month-count");
const monthRating = document.getElementById("month-rating");
const groupSuggestions = document.getElementById("group-suggestions");
const modal = document.getElementById("entry-modal");
const openFormBtn = document.getElementById("open-form-btn");
const closeFormBtn = document.getElementById("close-form-btn");
const exportBtn = document.getElementById("export-btn");
const tabs = document.querySelectorAll(".tab");

const state = {
  entries: [],
  period: "month",
};

const typeLabels = {
  book: "책",
  movie: "영화",
  drama: "드라마",
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate()
  ).padStart(2, "0")}`;
};

const loadEntries = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  state.entries = saved ? JSON.parse(saved) : [];
};

const saveEntries = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries));
};

const getFilteredEntries = () => {
  const query = searchInput.value.trim().toLowerCase();
  return state.entries.filter((entry) => {
    const matchesType = typeFilter.value === "all" || entry.type === typeFilter.value;
    const matchesGroup =
      entryGroupFilter.value === "all" || entry.group === entryGroupFilter.value;
    const matchesQuery = !query || entry.title.toLowerCase().includes(query);
    return matchesType && matchesGroup && matchesQuery;
  });
};

const renderEntries = () => {
  entriesContainer.innerHTML = "";
  const filtered = getFilteredEntries();

  if (!filtered.length) {
    entriesContainer.innerHTML =
      "<div class=\"entry-card\"><p>아직 기록이 없어요. 첫 기록을 추가해보세요!</p></div>";
    return;
  }

  filtered
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .forEach((entry) => {
      const clone = entryTemplate.content.cloneNode(true);
      clone.querySelector(".entry-type").textContent = typeLabels[entry.type];
      clone.querySelector(".entry-title").textContent = entry.title;
      clone.querySelector(".entry-review").textContent = entry.review || "짧은 코멘트 없음";
      const groupLabel = clone.querySelector(".entry-group");
      groupLabel.textContent = entry.group ? `# ${entry.group}` : "그룹 없음";
      clone.querySelector(".entry-rating").textContent = `★ ${entry.rating}`;
      clone.querySelector(".entry-date").textContent = formatDate(entry.completedAt);
      entriesContainer.appendChild(clone);
    });
};

const getPeriodKey = (date, period) => {
  const year = date.getFullYear();
  if (period === "year") return `${year}`;
  if (period === "quarter") {
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    return `${year} Q${quarter}`;
  }
  return `${year}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const calculateStats = () => {
  const stats = {};
  state.entries.forEach((entry) => {
    const date = new Date(entry.completedAt);
    const key = getPeriodKey(date, state.period);
    if (!stats[key]) {
      stats[key] = { count: 0, ratingSum: 0 };
    }
    stats[key].count += 1;
    stats[key].ratingSum += Number(entry.rating);
  });
  return stats;
};

const updateSummary = () => {
  const now = new Date();
  const currentKey = getPeriodKey(now, "month");
  const monthlyEntries = state.entries.filter(
    (entry) => getPeriodKey(new Date(entry.completedAt), "month") === currentKey
  );
  const total = monthlyEntries.length;
  const average = total
    ? monthlyEntries.reduce((sum, entry) => sum + Number(entry.rating), 0) / total
    : 0;
  monthCount.textContent = total;
  monthRating.textContent = average.toFixed(1);
};

const renderStats = () => {
  statsGrid.innerHTML = "";
  const stats = calculateStats();
  const keys = Object.keys(stats).sort().reverse();

  if (!keys.length) {
    statsGrid.innerHTML =
      "<div class=\"stat-card\"><h4>데이터 없음</h4><p>통계를 보려면 기록을 추가하세요.</p></div>";
    return;
  }

  keys.forEach((key) => {
    const { count, ratingSum } = stats[key];
    const avg = count ? (ratingSum / count).toFixed(1) : "0.0";
    const card = document.createElement("div");
    card.className = "stat-card";
    card.innerHTML = `
      <h4>${key}</h4>
      <p>완료 수: ${count}</p>
      <p>평균 평점: ${avg}</p>
    `;
    statsGrid.appendChild(card);
  });
};

const renderShelves = () => {
  shelfGrid.innerHTML = "";
  const groups = state.entries.reduce((acc, entry) => {
    const key = entry.group?.trim() || "기본";
    if (!acc[key]) acc[key] = { count: 0, avg: 0, sum: 0 };
    acc[key].count += 1;
    acc[key].sum += Number(entry.rating);
    acc[key].avg = acc[key].sum / acc[key].count;
    return acc;
  }, {});
  const groupKeys = Object.keys(groups);

  if (!groupKeys.length) {
    shelfGrid.innerHTML =
      "<div class=\"shelf-card\"><h4>그룹 없음</h4><p>기록에 그룹을 추가하면 책장이 만들어져요.</p></div>";
    return;
  }

  groupKeys.sort().forEach((key) => {
    const card = document.createElement("div");
    card.className = "shelf-card";
    if (groupFilter.value === key) {
      card.classList.add("active");
    }
    card.innerHTML = `
      <h4>${key}</h4>
      <p>총 ${groups[key].count}개 • 평균 평점 ${groups[key].avg.toFixed(1)}</p>
    `;
    card.addEventListener("click", () => {
      groupFilter.value = key;
      entryGroupFilter.value = key;
      renderEntries();
      renderShelves();
    });
    shelfGrid.appendChild(card);
  });
};

const getGroupList = () =>
  Array.from(new Set(state.entries.map((entry) => entry.group).filter(Boolean))).sort();

const renderGroupFilters = () => {
  const groups = getGroupList();
  const options = groups
    .map((group) => `<option value="${group}">${group}</option>`)
    .join("");
  groupFilter.innerHTML = `<option value="all">전체 그룹</option>${options}`;
  entryGroupFilter.innerHTML = `<option value="all">전체 그룹</option>${options}`;
  groupSuggestions.innerHTML = options;
  renderGroupChips(groups);
};

const renderGroupChips = (groups = getGroupList()) => {
  if (!groups.length) {
    groupChips.innerHTML = "<span class=\"chip empty\">그룹 없음</span>";
    return;
  }
  const items = ["all", ...groups];
  groupChips.innerHTML = items
    .map((group) => {
      const label = group === "all" ? "전체" : group;
      const activeClass = entryGroupFilter.value === group ? "active" : "";
      return `<button class="chip ${activeClass}" data-group="${group}">${label}</button>`;
    })
    .join("");
  groupChips.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const group = chip.dataset.group;
      entryGroupFilter.value = group;
      groupFilter.value = group;
      renderEntries();
      renderShelves();
      renderGroupChips(groups);
    });
  });
};

const resetForm = () => {
  form.reset();
  form.elements.completedAt.valueAsDate = new Date();
};

const openModal = () => {
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
};

const closeModal = () => {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const entry = {
    id: crypto.randomUUID(),
    title: formData.get("title"),
    type: formData.get("type"),
    completedAt: formData.get("completedAt"),
    rating: formData.get("rating"),
    review: formData.get("review"),
    group: formData.get("group")?.trim(),
  };
  state.entries.unshift(entry);
  saveEntries();
  renderGroupFilters();
  renderEntries();
  renderShelves();
  renderStats();
  updateSummary();
  resetForm();
  closeModal();
});

[typeFilter, entryGroupFilter, searchInput].forEach((element) => {
  element.addEventListener("input", renderEntries);
});

entryGroupFilter.addEventListener("input", () => {
  groupFilter.value = entryGroupFilter.value;
  renderShelves();
  renderGroupChips();
});

groupFilter.addEventListener("input", () => {
  entryGroupFilter.value = groupFilter.value;
  renderEntries();
  renderShelves();
  renderGroupChips();
});

clearGroupBtn.addEventListener("click", () => {
  groupFilter.value = "all";
  entryGroupFilter.value = "all";
  renderEntries();
  renderShelves();
  renderGroupChips();
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((btn) => btn.classList.remove("active"));
    tab.classList.add("active");
    state.period = tab.dataset.period;
    renderStats();
  });
});

openFormBtn.addEventListener("click", () => {
  resetForm();
  openModal();
});

closeFormBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

exportBtn.addEventListener("click", () => {
  if (!state.entries.length) {
    alert("내보낼 기록이 없습니다.");
    return;
  }
  const rows = [
    ["title", "type", "completedAt", "group", "rating", "review"],
    ...state.entries.map((entry) => [
      entry.title,
      entry.type,
      entry.completedAt,
      entry.group || "",
      entry.rating,
      entry.review?.replaceAll("\n", " ") || "",
    ]),
  ];
  const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "review-hub.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

const init = () => {
  loadEntries();
  resetForm();
  renderGroupFilters();
  renderEntries();
  renderShelves();
  renderStats();
  updateSummary();
};

init();
