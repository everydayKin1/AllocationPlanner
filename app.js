(function () {
  "use strict";

  var master = window.GENGEKI_MASTER_DATA;
  var storageKey = "gengeki-planner:user-state:v5";
  var selectedCharacterId = null;
  var selectedStageId = null;
  var activeElement = "all";
  var activeTags = new Set();
  var activeSlot = null;
  var drawerOpen = false;
  var menuModalOpen = false;
  var activeMenuTab = "roster";
  var rosterTab = "characters";
  var characterPanelOpen = false;
  var filterPanelOpen = false;
  var rosterModalFilterOpen = false;
  var rosterModalElement = "all";
  var rosterModalTags = new Set();
  var lastStateBeforeReset = null;

  var elementColor = {
    "炎": "#c74934",
    "水": "#2379a8",
    "雷": "#7a52b8",
    "氷": "#3e8da4",
    "風": "#348a75",
    "岩": "#a26a24",
    "草": "#4d8b34"
  };

  function createDefaultState() {
    return {
      activeMonthId: getDefaultMonth().id,
      assignments: {},
      actions: {},
      characterNotes: {},
      stageNotes: {},
      magicHidden: {},
      arcanaPositions: {},
      owned: {},
      travelerElement: {},
      levels: {},
      roster: {},
      artifactSet: {},
      enemyChoice: {},
      autoRosterApplied: {},
      settings: { showOwnership: true, autoRoster: false, darkMode: false }
    };
  }

  var state = loadState();
  ensureStateShape();
  selectedStageId = getCurrentStages()[0].id;

  var dom = {
    appTitle: document.getElementById("appTitle"),
    monthSwitcher: document.getElementById("monthSwitcher"),
    menuButton: document.getElementById("menuButton"),
    overlay: document.getElementById("overlay"),
    rosterPanel: document.getElementById("rosterPanel"),
    rosterCount: document.getElementById("rosterCount"),
    rosterModalStatus: document.getElementById("rosterModalStatus"),
    rosterModalSummary: document.getElementById("rosterModalSummary"),
    rosterModalBody: document.getElementById("rosterModalBody"),
    rosterModalFilterToggle: document.getElementById("rosterModalFilterToggle"),
    rosterModalFilterIcon: document.getElementById("rosterModalFilterIcon"),
    rosterModalFilterPanel: document.getElementById("rosterModalFilterPanel"),
    rosterModalElementFilters: document.getElementById("rosterModalElementFilters"),
    rosterModalTagFilters: document.getElementById("rosterModalTagFilters"),
    rosterModalFilterResetButton: document.getElementById("rosterModalFilterResetButton"),
    howToButton: document.getElementById("howToButton"),
    howToModalBody: document.getElementById("howToModalBody"),
    menuModalOverlay: document.getElementById("menuModalOverlay"),
    menuModalClose: document.getElementById("menuModalClose"),
    menuTabRoster: document.getElementById("menuTabRoster"),
    menuTabHowTo: document.getElementById("menuTabHowTo"),
    menuPanelRoster: document.getElementById("menuPanelRoster"),
    menuPanelHowTo: document.getElementById("menuPanelHowTo"),
    characterPanelOverlay: document.getElementById("characterPanelOverlay"),
    characterPanelClose: document.getElementById("characterPanelClose"),
    rosterTabCharacters: document.getElementById("rosterTabCharacters"),
    rosterTabOverview: document.getElementById("rosterTabOverview"),
    rosterTabSettings: document.getElementById("rosterTabSettings"),
    characterListPanel: document.getElementById("characterListPanel"),
    phaseOverviewPanel: document.getElementById("phaseOverviewPanel"),
    rosterSettingsPanel: document.getElementById("rosterSettingsPanel"),
    tabBarRoster: document.getElementById("tabBarRoster"),
    tabBarOverview: document.getElementById("tabBarOverview"),
    tabBarCharacter: document.getElementById("tabBarCharacter"),
    tabBarHowTo: document.getElementById("tabBarHowTo"),
    tabBarSettings: document.getElementById("tabBarSettings"),
    darkModeToggle: document.getElementById("darkModeToggle"),
    showOwnershipToggle: document.getElementById("showOwnershipToggle"),
    autoRosterToggle: document.getElementById("autoRosterToggle"),
    searchInput: document.getElementById("searchInput"),
    filterToggle: document.getElementById("filterToggle"),
    filterToggleIcon: document.getElementById("filterToggleIcon"),
    filterPanel: document.getElementById("filterPanel"),
    travelerSelect: document.getElementById("travelerSelect"),
    elementFilters: document.getElementById("elementFilters"),
    tagFilters: document.getElementById("tagFilters"),
    showAllToggle: document.getElementById("showAllToggle"),
    filterResetButton: document.getElementById("filterResetButton"),
    characterList: document.getElementById("characterList"),
    stageList: document.getElementById("stageList"),
    arcanaControls: document.getElementById("arcanaControls"),
    warnings: document.getElementById("warnings"),
    buffStatus: document.getElementById("buffStatus"),
    inviteTotal: document.getElementById("inviteTotal"),
    finalFlower: document.getElementById("finalFlower"),
    exportPlanButton: document.getElementById("exportPlanButton"),
    importPlanInput: document.getElementById("importPlanInput"),
    resetAssignmentsButton: document.getElementById("resetAssignmentsButton"),
    resetActionsButton: document.getElementById("resetActionsButton"),
    resetBothButton: document.getElementById("resetBothButton"),
    undoResetButton: document.getElementById("undoResetButton"),
    characterTabPanel: document.getElementById("characterTabPanel"),
    phaseOverviewList: document.getElementById("phaseOverviewList"),
    editorEmpty: document.getElementById("editorEmpty"),
    characterEditor: document.getElementById("characterEditor"),
    editorPortrait: document.getElementById("editorPortrait"),
    editorStatus: document.getElementById("editorStatus"),
    nameInput: document.getElementById("nameInput"),
    levelInput: document.getElementById("levelInput"),
    editorElementIcon: document.getElementById("editorElementIcon"),
    ownershipRow: document.getElementById("ownershipRow"),
    ownedInput: document.getElementById("ownedInput"),
    artifactSetInput: document.getElementById("artifactSetInput"),
    editorTags: document.getElementById("editorTags"),
    magicToggleRow: document.getElementById("magicToggleRow"),
    magicVisibleInput: document.getElementById("magicVisibleInput"),
    noteInput: document.getElementById("noteInput")
  };

  var ROSTER_MIN = (master.rules && master.rules.rosterMin) || 22;
  var ROSTER_MAX = (master.rules && master.rules.rosterMax) || 26;
  var STAGE_TYPE_BY_ID = {
    "act-1": "choice", "act-2": "choice", "act-4": "choice", "act-5": "choice", "act-7": "choice", "act-9": "choice",
    "act-3": "boss", "act-6": "boss", "act-8": "boss", "act-10": "boss", "arcana-2": "boss"
  };
  var STAGE_OBJECTIVE_BY_ID = {
    "act-4": "地脈鎮石防衛戦",
    "act-5": "一定数の討伐",
    "act-9": "懸賞対象の討伐"
  };

  init();

  function init() {
    var titleText = document.getElementById("appTitleText");
    if (titleText) titleText.textContent = master.title; else dom.appTitle.textContent = master.title;
    validateMasterData();
    applyTheme();
    applyBrandIcons();
    buildFilters();
    buildRosterModalFilters();
    buildArtifactSetOptions();
    bindTipTriggers(document);
    bindEvents();
    renderTabBar();
    render();
  }

  function validateMasterData() {
    var knownIds = {};
    master.characters.forEach(function (character) { knownIds[character.id] = true; });
    getMonths().forEach(function (month) {
      ["openingCast", "specialCast"].forEach(function (key) {
        (month[key] || []).forEach(function (id) {
          if (!knownIds[id]) {
            console.warn("[幻想シアター] master-data.js: 月「" + month.id + "」の " + key + " に characters 配列へ存在しないID「" + id + "」があります。id の大文字小文字・スペルを確認してください。");
          }
        });
      });
    });
  }

  function isDarkMode() {
    return Boolean(state.settings && state.settings.darkMode);
  }

  function applyTheme() {
    if (isDarkMode()) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    if (dom.darkModeToggle) dom.darkModeToggle.checked = isDarkMode();
  }

  function applyBrandIcons() {
    var icons = master.icons || {};
    var faviconLink = document.getElementById("faviconLink");
    var titleIcon = document.getElementById("titleIcon");
    var flowerIcon = document.getElementById("flowerIcon");
    if (icons.favicon && faviconLink) faviconLink.href = icons.favicon;
    if (icons.header && titleIcon) titleIcon.src = icons.header;
    if (flowerIcon) {
      if (icons.flower) {
        flowerIcon.src = icons.flower;
        flowerIcon.classList.remove("hidden");
      } else {
        flowerIcon.classList.add("hidden");
      }
    }
  }

  function buildArtifactSetOptions() {
    dom.artifactSetInput.innerHTML = "";
    getArtifactSetList().forEach(function (set) {
      var option = document.createElement("option");
      option.value = set.id;
      option.textContent = set.name;
      dom.artifactSetInput.appendChild(option);
    });
  }

  function loadState() {
    try {
      var parsed = JSON.parse(localStorage.getItem(storageKey) || "{}");
      var merged = Object.assign(createDefaultState(), parsed);
      merged.settings = Object.assign({ showOwnership: true }, parsed.settings || {});
      return merged;
    } catch (error) {
      return createDefaultState();
    }
  }

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  /* ---------- month / stages ---------- */

  function getMonths() {
    return master.months || [getDefaultMonth()];
  }

  function getDefaultMonth() {
    return (master.months && master.months[0]) || { id: "default", label: "デフォルト", stages: master.stages || [] };
  }

  function getCurrentMonth() {
    return getMonths().find(function (month) { return month.id === state.activeMonthId; }) || getDefaultMonth();
  }

  function getMonthById(monthId) {
    return getMonths().find(function (month) { return month.id === monthId; }) || getCurrentMonth();
  }

  function getRawStages(month) {
    return (month || getCurrentMonth()).stages || master.stages || [];
  }

  function getCurrentBuffs() {
    var month = getCurrentMonth();
    return month.buffs || master.defaultBuffs || master.buffs || [];
  }

  function parseActNum(text) {
    var match = String(text || "").match(/\d+/);
    return match ? Number(match[0]) : null;
  }

  function getArcanaPositions(monthId) {
    if (!state.arcanaPositions) state.arcanaPositions = {};
    var arcana = getRawStages(getMonthById(monthId)).filter(function (s) { return s.special; });
    if (!state.arcanaPositions[monthId]) state.arcanaPositions[monthId] = {};
    var store = state.arcanaPositions[monthId];
    arcana.forEach(function (arc) {
      var min = parseActNum(arc.allowedFromAfter) || 1;
      if (typeof store[arc.id] !== "number") store[arc.id] = 9;
      store[arc.id] = Math.max(min, Math.min(9, store[arc.id]));
    });
    return store;
  }

  function getCurrentStages() {
    var month = getCurrentMonth();
    var raw = getRawStages(month);
    var arcana = raw.filter(function (s) { return s.special; });
    var acts = raw.filter(function (s) { return !s.special; });
    if (!arcana.length) return acts;

    var normalActs = acts.filter(function (s) { return !s.final; });
    var finalActs = acts.filter(function (s) { return s.final; });
    var positions = getArcanaPositions(month.id);
    var ordered = [];

    normalActs.forEach(function (act, index) {
      ordered.push(act);
      var actNumber = index + 1;
      arcana.forEach(function (arc) {
        if (positions[arc.id] === actNumber) ordered.push(arc);
      });
    });
    arcana.forEach(function (arc) {
      if (ordered.indexOf(arc) === -1) ordered.push(arc);
    });
    return ordered.concat(finalActs);
  }

  function getStageIndex(stageId) {
    return getCurrentStages().findIndex(function (stage) { return stage.id === stageId; });
  }

  function getMonthStore(root, monthId) {
    if (!root[monthId]) root[monthId] = {};
    return root[monthId];
  }

  function ensureStateShape() {
    if (!state.activeMonthId || !getMonths().some(function (item) { return item.id === state.activeMonthId; })) {
      state.activeMonthId = getDefaultMonth().id;
    }
    var month = getCurrentMonth();
    var buffs = getCurrentBuffs();
    var assignments = getMonthStore(state.assignments, month.id);
    var actions = getMonthStore(state.actions, month.id);
    var stageNotes = getMonthStore(state.stageNotes, month.id);
    getCurrentStages().forEach(function (stage) {
      if (!Array.isArray(assignments[stage.id])) assignments[stage.id] = Array(master.rules.slotsPerStage).fill(null);
      if (!actions[stage.id]) actions[stage.id] = { invites: 0, buffs: {} };
      if (typeof stageNotes[stage.id] !== "string") stageNotes[stage.id] = "";
      buffs.forEach(function (buff) {
        if (typeof actions[stage.id].buffs[buff.id] !== "number") actions[stage.id].buffs[buff.id] = 0;
      });
    });
    getTravelerElement(month.id);
    if (!selectedStageId || !getCurrentStages().some(function (stage) { return stage.id === selectedStageId; })) {
      selectedStageId = getCurrentStages()[0].id;
    }
    if (state.settings && state.settings.autoRoster) {
      if (!state.autoRosterApplied) state.autoRosterApplied = {};
      if (!state.autoRosterApplied[month.id]) {
        applyAutoRosterForCurrentMonth();
        state.autoRosterApplied[month.id] = true;
      }
    }
  }

  /* ---------- ownership / traveler ---------- */

  function isOwned(characterId) {
    return state.owned[characterId] !== false;
  }

  function getLevel(character) {
    if (!state.levels) state.levels = {};
    var stored = state.levels[character.id];
    if (typeof stored === "number") return stored;
    return typeof character.level === "number" ? character.level : 90;
  }

  function getRosterSet(monthId) {
    if (!state.roster) state.roster = {};
    if (!state.roster[monthId]) state.roster[monthId] = {};
    return state.roster[monthId];
  }

  function isRostered(character) {
    return getRosterSet(getCurrentMonth().id)[character.id] === true;
  }

  function countRostered() {
    var month = getCurrentMonth();
    var set = getRosterSet(month.id);
    var opening = month.openingCast || [];
    var count = 0;
    Object.keys(set).forEach(function (id) {
      if (!set[id]) return;
      if (opening.indexOf(id) !== -1) return;
      var character = getCharacter(id);
      if (character && isUsableThisMonth(character)) count += 1;
    });
    return count;
  }

  function countOnFieldRostered() {
    var month = getCurrentMonth();
    var set = getRosterSet(month.id);
    var opening = month.openingCast || [];
    var counted = {};
    var count = 0;
    function tally(id) {
      if (counted[id]) return;
      counted[id] = true;
      var character = getCharacter(id);
      if (!character || !isUsableThisMonth(character)) return;
      var positions = (character.tags && character.tags.positions) || [];
      if (positions.indexOf("オンフィールド") !== -1) count += 1;
    }
    opening.forEach(tally);
    Object.keys(set).forEach(function (id) { if (set[id]) tally(id); });
    return count;
  }

  function countSelectedByElement(element) {
    var month = getCurrentMonth();
    var set = getRosterSet(month.id);
    var opening = month.openingCast || [];
    var counted = {};
    var count = 0;
    function tally(id) {
      if (counted[id]) return;
      counted[id] = true;
      var character = getCharacter(id);
      if (!character || !isUsableThisMonth(character)) return;
      if (character.element === element) count += 1;
    }
    opening.forEach(tally);
    Object.keys(set).forEach(function (id) { if (set[id]) tally(id); });
    return count;
  }

  function getArtifactSetList() {
    return master.artifactSets || [{ id: "none", name: "未設定", icon: "" }];
  }

  function getArtifactSetInfo(setId) {
    return getArtifactSetList().find(function (set) { return set.id === setId; }) || null;
  }

  function getArtifactSet(characterId) {
    if (!state.artifactSet) state.artifactSet = {};
    return state.artifactSet[characterId] || "none";
  }

  function showOwnership() {
    return state.settings && state.settings.showOwnership !== false;
  }

  function getTravelerElement(monthId) {
    var month = getMonthById(monthId);
    var options = month.travelerElements || month.elements || [];
    if (!state.travelerElement) state.travelerElement = {};
    var current = state.travelerElement[monthId];
    if (!current || options.indexOf(current) === -1) {
      current = options[0] || null;
      state.travelerElement[monthId] = current;
    }
    return current;
  }

  function isTravelerActive(character) {
    return Boolean(character.isTraveler) && character.element === getTravelerElement(getCurrentMonth().id);
  }

  function isUsableThisMonth(character) {
    var month = getCurrentMonth();
    if (character.isTraveler) return isTravelerActive(character);
    if ((month.openingCast || []).indexOf(character.id) !== -1) return true;
    if (!isOwned(character.id)) return false;
    if (getLevel(character) < 70) return false;
    return (month.elements || []).indexOf(character.element) !== -1 ||
      (month.specialCast || []).indexOf(character.id) !== -1;
  }

  function usabilityLabel(character) {
    var month = getCurrentMonth();
    if (character.isTraveler) {
      return isTravelerActive(character) ? "今月の主人公" : "別元素の主人公";
    }
    if ((month.openingCast || []).indexOf(character.id) !== -1) return "開幕キャスト";
    if ((month.specialCast || []).indexOf(character.id) !== -1) {
      return isOwned(character.id) ? (getLevel(character) >= 70 ? "特別招待" : "Lv70未満") : "未所持";
    }
    if (!isOwned(character.id)) return "未所持";
    if (getLevel(character) < 70) return "Lv70未満";
    if ((month.elements || []).indexOf(character.element) !== -1) return "出演元素";
    return "対象外元素";
  }

  function canUseInStage(character) {
    return isUsableThisMonth(character);
  }

  /* ---------- filters ---------- */

  function buildFilters() {
    addChip(dom.elementFilters, "all", "すべて", true, function () {
      activeElement = "all";
      render();
    });
    master.elements.forEach(function (element) {
      addChip(dom.elementFilters, element, element, false, function () {
        activeElement = activeElement === element ? "all" : element;
        render();
      }, elementIconPath(element));
    });

    getAllFilterTags().forEach(function (tag) {
      addChip(dom.tagFilters, tag, tag, false, function () {
        if (activeTags.has(tag)) activeTags.delete(tag);
        else activeTags.add(tag);
        render();
      }, tagIconPath(tag));
    });
  }

  function getAllFilterTags() {
    var options = master.tagOptions || {};
    return []
      .concat(options.positions || [])
      .concat(options.roles || [])
      .concat(options.weapons || [])
      .concat(["夜魂の加護"])
      .concat(options.pneumaOusia || [])
      .concat(["月兆", "魔導"]);
  }

  function getRosterModalFilterTags() {
    var options = master.tagOptions || {};
    return []
      .concat(options.positions || [])
      .concat(options.roles || [])
      .concat(["夜魂の加護"])
      .concat(options.pneumaOusia || [])
      .concat(["月兆", "魔導"]);
  }

  function buildRosterModalFilters() {
    addIconChip(dom.rosterModalElementFilters, "all", true, function () {
      rosterModalElement = "all";
      renderRosterModalContent();
    }, "", "すべて");
    master.elements.forEach(function (element) {
      addIconChip(dom.rosterModalElementFilters, element, false, function () {
        rosterModalElement = rosterModalElement === element ? "all" : element;
        renderRosterModalContent();
      }, elementIconPath(element), element);
    });

    getRosterModalFilterTags().forEach(function (tag) {
      addIconChip(dom.rosterModalTagFilters, tag, false, function () {
        if (rosterModalTags.has(tag)) rosterModalTags.delete(tag);
        else rosterModalTags.add(tag);
        renderRosterModalContent();
      }, tagIconPath(tag), tag);
    });
  }

  function renderRosterModalFilterChips() {
    var monthElements = getCurrentMonth().elements || [];
    if (rosterModalElement !== "all" && monthElements.indexOf(rosterModalElement) === -1) {
      rosterModalElement = "all";
    }
    Array.from(dom.rosterModalElementFilters.children).forEach(function (chip) {
      var value = chip.dataset.value;
      var visible = value === "all" || monthElements.indexOf(value) !== -1;
      chip.classList.toggle("hidden", !visible);
      chip.classList.toggle("active", value === rosterModalElement);
    });
    Array.from(dom.rosterModalTagFilters.children).forEach(function (chip) {
      chip.classList.toggle("active", rosterModalTags.has(chip.dataset.value));
    });
  }

  function addChip(container, value, label, active, onClick, iconPath) {
    var chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip" + (active ? " active" : "");
    chip.dataset.value = value;
    if (iconPath) {
      chip.innerHTML = "<img class=\"chip-icon\" src=\"" + escapeHtml(iconPath) + "\" alt=\"\">" + escapeHtml(label);
    } else {
      chip.textContent = label;
    }
    chip.addEventListener("click", onClick);
    container.appendChild(chip);
  }

  function addIconChip(container, value, active, onClick, iconPath, label) {
    var chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip icon-chip" + (active ? " active" : "");
    chip.dataset.value = value;
    chip.title = label;
    chip.setAttribute("aria-label", label);
    chip.innerHTML = iconPath
      ? "<img class=\"chip-icon\" src=\"" + escapeHtml(iconPath) + "\" alt=\"\">"
      : "<span class=\"chip-icon-fallback\">" + escapeHtml(label.slice(0, 2)) + "</span>";
    chip.addEventListener("click", onClick);
    container.appendChild(chip);
  }

  /* ---------- events ---------- */

  function bindEvents() {
    dom.searchInput.addEventListener("input", renderCharacterList);
    dom.filterToggle.addEventListener("click", function () {
      filterPanelOpen = !filterPanelOpen;
      renderFilterToggle();
    });
    dom.rosterModalFilterToggle.addEventListener("click", function () {
      rosterModalFilterOpen = !rosterModalFilterOpen;
      renderRosterModalFilterToggle();
    });
    dom.showAllToggle.addEventListener("change", renderCharacterList);
    dom.filterResetButton.addEventListener("click", function () {
      activeElement = "all";
      activeTags.clear();
      render();
    });
    dom.rosterModalFilterResetButton.addEventListener("click", function () {
      rosterModalElement = "all";
      rosterModalTags.clear();
      renderRosterModalContent();
    });
    dom.exportPlanButton.addEventListener("click", exportPlan);
    dom.importPlanInput.addEventListener("change", importPlan);
    bindScopedReset(dom.resetAssignmentsButton, "assignments");
    bindScopedReset(dom.resetActionsButton, "actions");
    bindScopedReset(dom.resetBothButton, "both");
    dom.undoResetButton.addEventListener("click", undoReset);

    dom.menuButton.addEventListener("click", function () {
      drawerOpen = !drawerOpen;
      renderDrawer();
    });
    dom.overlay.addEventListener("click", function () {
      drawerOpen = false;
      renderDrawer();
    });

    dom.rosterCount.addEventListener("click", function () { openMenuModal("roster"); });
    dom.howToButton.addEventListener("click", function () { openMenuModal("howto"); });
    dom.menuTabRoster.addEventListener("click", function () { openMenuModal("roster"); });
    dom.menuTabHowTo.addEventListener("click", function () { openMenuModal("howto"); });
    dom.menuModalClose.addEventListener("click", closeMenuModal);
    dom.menuModalOverlay.addEventListener("click", function (event) {
      if (event.target === dom.menuModalOverlay) closeMenuModal();
    });

    dom.characterPanelClose.addEventListener("click", closeCharacterPanel);
    dom.characterPanelOverlay.addEventListener("click", function (event) {
      if (event.target === dom.characterPanelOverlay) closeCharacterPanel();
    });

    dom.rosterTabCharacters.addEventListener("click", function () {
      rosterTab = "characters";
      renderRosterTabs();
    });
    dom.rosterTabOverview.addEventListener("click", function () {
      rosterTab = "overview";
      renderRosterTabs();
    });
    dom.rosterTabSettings.addEventListener("click", function () {
      rosterTab = "settings";
      renderRosterTabs();
    });

    dom.tabBarRoster.addEventListener("click", function () { openMenuModal("roster"); });
    dom.tabBarOverview.addEventListener("click", function () { openRosterTab("overview"); });
    dom.tabBarCharacter.addEventListener("click", openCharacterPanel);
    dom.tabBarHowTo.addEventListener("click", function () { openMenuModal("howto"); });
    dom.tabBarSettings.addEventListener("click", function () { openRosterTab("settings"); });

    dom.darkModeToggle.addEventListener("change", function () {
      state.settings.darkMode = dom.darkModeToggle.checked;
      applyTheme();
      saveState();
    });
    dom.showOwnershipToggle.addEventListener("change", function () {
      state.settings.showOwnership = dom.showOwnershipToggle.checked;
      render();
    });
    dom.autoRosterToggle.addEventListener("change", function () {
      state.settings.autoRoster = dom.autoRosterToggle.checked;
      if (state.settings.autoRoster) {
        applyAutoRosterForCurrentMonth();
        if (!state.autoRosterApplied) state.autoRosterApplied = {};
        state.autoRosterApplied[getCurrentMonth().id] = true;
      }
      render();
    });

    dom.travelerSelect.addEventListener("change", function () {
      state.travelerElement[getCurrentMonth().id] = dom.travelerSelect.value;
      selectedCharacterId = null;
      render();
    });

    dom.ownedInput.addEventListener("change", function () {
      if (!selectedCharacterId) return;
      state.owned[selectedCharacterId] = dom.ownedInput.checked;
      render();
    });
    dom.artifactSetInput.addEventListener("change", function () {
      if (!selectedCharacterId) return;
      state.artifactSet[selectedCharacterId] = dom.artifactSetInput.value;
      render();
    });
    dom.levelInput.addEventListener("change", function () {
      if (!selectedCharacterId) return;
      var value = Math.max(1, Math.min(100, Number(dom.levelInput.value) || 1));
      state.levels[selectedCharacterId] = value;
      render();
    });
    dom.noteInput.addEventListener("input", function () {
      if (!selectedCharacterId) return;
      state.characterNotes[selectedCharacterId] = dom.noteInput.value;
      saveState();
    });
    dom.magicVisibleInput.addEventListener("change", function () {
      if (!selectedCharacterId) return;
      state.magicHidden[selectedCharacterId] = !dom.magicVisibleInput.checked;
      render();
    });
  }

  /* ---------- render ---------- */

  function render() {
    ensureStateShape();
    renderMonthSwitcher();
    renderDrawer();
    renderFilterToggle();
    renderTravelerPicker();
    renderFilterChips();
    renderArcanaControls();
    renderStages();
    renderCharacterList();
    renderPhaseOverview();
    renderRosterTabs();
    renderSummary();
    renderCharacterPanel();
    renderMenuModal();
    saveState();
  }

  function renderMonthSwitcher() {
    var months = getMonths();
    var index = months.findIndex(function (month) { return month.id === state.activeMonthId; });
    if (index < 0) index = 0;
    dom.monthSwitcher.innerHTML = "";

    var prev = document.createElement("button");
    prev.type = "button";
    prev.className = "month-nav";
    prev.textContent = "◀";
    prev.disabled = index <= 0;
    prev.setAttribute("aria-label", "前の月");
    prev.addEventListener("click", function () { switchMonth(months[index - 1]); });

    var select = document.createElement("select");
    select.className = "month-select";
    months.forEach(function (month) {
      var option = document.createElement("option");
      option.value = month.id;
      option.textContent = month.label;
      if (month.id === state.activeMonthId) option.selected = true;
      select.appendChild(option);
    });
    select.addEventListener("change", function () {
      switchMonth(getMonthById(select.value));
    });

    var next = document.createElement("button");
    next.type = "button";
    next.className = "month-nav";
    next.textContent = "▶";
    next.disabled = index >= months.length - 1;
    next.setAttribute("aria-label", "次の月");
    next.addEventListener("click", function () { switchMonth(months[index + 1]); });

    var currentMonth = months[index];
    var elementIcons = document.createElement("span");
    elementIcons.className = "month-element-icons";
    (currentMonth.elements || []).forEach(function (element) {
      var iconPath = elementIconPath(element);
      if (!iconPath) return;
      var icon = document.createElement("img");
      icon.className = "month-element-icon";
      icon.alt = element;
      icon.src = iconPath;
      elementIcons.appendChild(icon);
    });

    dom.monthSwitcher.appendChild(prev);
    dom.monthSwitcher.appendChild(select);
    dom.monthSwitcher.appendChild(next);
    dom.monthSwitcher.appendChild(elementIcons);
  }

  function switchMonth(month) {
    if (!month) return;
    state.activeMonthId = month.id;
    selectedCharacterId = null;
    ensureStateShape();
    selectedStageId = getCurrentStages()[0].id;
    render();
  }

  function renderDrawer() {
    dom.rosterPanel.classList.toggle("open", drawerOpen);
    dom.overlay.classList.toggle("show", drawerOpen);
  }

  function renderRosterTabs() {
    dom.rosterTabCharacters.classList.toggle("active", rosterTab === "characters");
    dom.rosterTabOverview.classList.toggle("active", rosterTab === "overview");
    dom.rosterTabSettings.classList.toggle("active", rosterTab === "settings");
    dom.characterListPanel.classList.toggle("hidden", rosterTab !== "characters");
    dom.phaseOverviewPanel.classList.toggle("hidden", rosterTab !== "overview");
    dom.rosterSettingsPanel.classList.toggle("hidden", rosterTab !== "settings");
    dom.showOwnershipToggle.checked = showOwnership();
    dom.autoRosterToggle.checked = Boolean(state.settings.autoRoster);
    dom.darkModeToggle.checked = isDarkMode();
    renderTabBar();
  }

  function openRosterTab(tab) {
    rosterTab = tab;
    drawerOpen = true;
    renderRosterTabs();
    renderDrawer();
  }

  function openMenuModal(tab) {
    activeMenuTab = tab;
    menuModalOpen = true;
    renderMenuModal();
  }

  function closeMenuModal() {
    menuModalOpen = false;
    renderMenuModal();
  }

  function renderMenuModal() {
    dom.menuModalOverlay.classList.toggle("hidden", !menuModalOpen);
    dom.menuTabRoster.classList.toggle("active", activeMenuTab === "roster");
    dom.menuTabHowTo.classList.toggle("active", activeMenuTab === "howto");
    dom.menuPanelRoster.classList.toggle("hidden", activeMenuTab !== "roster");
    dom.menuPanelHowTo.classList.toggle("hidden", activeMenuTab !== "howto");
    if (menuModalOpen && activeMenuTab === "roster") renderRosterModalContent();
    renderTabBar();
  }

  function openCharacterPanel() {
    characterPanelOpen = true;
    renderCharacterPanel();
  }

  function closeCharacterPanel() {
    characterPanelOpen = false;
    renderCharacterPanel();
  }

  function renderCharacterPanel() {
    dom.characterPanelOverlay.classList.toggle("hidden", !characterPanelOpen);
    renderEditor();
    renderTabBar();
  }

  function applyAutoRosterForCurrentMonth() {
    var month = getCurrentMonth();
    var rosterSet = getRosterSet(month.id);
    var opening = month.openingCast || [];
    master.characters.forEach(function (character) {
      if (opening.indexOf(character.id) !== -1) return;
      if (!isUsableThisMonth(character)) return; // 主人公は今月の元素のものだけ true
      rosterSet[character.id] = true;
    });
  }

  function renderFilterToggle() {
    dom.filterPanel.classList.toggle("hidden", !filterPanelOpen);
    dom.filterToggle.classList.toggle("open", filterPanelOpen);
    dom.filterToggleIcon.textContent = filterPanelOpen ? "隠す ▴" : "表示 ▾";
  }

  function renderRosterModalFilterToggle() {
    dom.rosterModalFilterPanel.classList.toggle("hidden", !rosterModalFilterOpen);
    dom.rosterModalFilterToggle.classList.toggle("open", rosterModalFilterOpen);
    dom.rosterModalFilterIcon.textContent = rosterModalFilterOpen ? "隠す ▴" : "表示 ▾";
  }

  function renderTravelerPicker() {
    var month = getCurrentMonth();
    var options = month.travelerElements || month.elements || [];
    var row = dom.travelerSelect.parentElement;
    if (!options.length) {
      row.classList.add("hidden");
      return;
    }
    row.classList.remove("hidden");
    var current = getTravelerElement(month.id);
    dom.travelerSelect.innerHTML = "";
    options.forEach(function (element) {
      var option = document.createElement("option");
      option.value = element;
      option.textContent = "主人公/" + element;
      if (element === current) option.selected = true;
      dom.travelerSelect.appendChild(option);
    });
  }

  function renderFilterChips() {
    Array.from(dom.elementFilters.children).forEach(function (chip) {
      chip.classList.toggle("active", chip.dataset.value === activeElement);
    });
    Array.from(dom.tagFilters.children).forEach(function (chip) {
      chip.classList.toggle("active", activeTags.has(chip.dataset.value));
    });
  }

  function renderArcanaControls() {
    var month = getCurrentMonth();
    var arcana = getRawStages(month).filter(function (s) { return s.special; });
    dom.arcanaControls.innerHTML = "";
    if (!arcana.length) {
      dom.arcanaControls.classList.add("hidden");
      return;
    }
    dom.arcanaControls.classList.remove("hidden");
    var positions = getArcanaPositions(month.id);
    arcana.forEach(function (arc) {
      var min = parseActNum(arc.allowedFromAfter) || 1;
      var label = document.createElement("label");
      label.className = "arcana-control";
      var arcanaIconPath = arc.id === "arcana-1" ? (master.icons && master.icons.arcanaNum1)
        : arc.id === "arcana-2" ? (master.icons && master.icons.arcanaNum2) : "";
      if (arcanaIconPath) {
        var arcanaIcon = document.createElement("img");
        arcanaIcon.className = "arcana-control-icon";
        arcanaIcon.src = arcanaIconPath;
        arcanaIcon.alt = "";
        label.appendChild(arcanaIcon);
      }
      var textWrap = document.createElement("span");
      textWrap.className = "arcana-control-text";
      label.appendChild(textWrap);
      var labelText = document.createElement("span");
      labelText.className = "arcana-control-label";
      labelText.textContent = arc.name + "の挿入位置";
      textWrap.appendChild(labelText);
      var select = document.createElement("select");
      for (var n = min; n <= 9; n++) {
        var option = document.createElement("option");
        option.value = String(n);
        option.textContent = "第" + n + "幕の後";
        if (positions[arc.id] === n) option.selected = true;
        select.appendChild(option);
      }
      select.addEventListener("change", function () {
        positions[arc.id] = Number(select.value);
        render();
      });
      textWrap.appendChild(select);
      dom.arcanaControls.appendChild(label);
    });
  }

  function vitalityMarks(remaining, max) {
    var marks = [];
    for (var i = 0; i < max; i++) {
      marks.push(i < remaining ? "<span class=\"vital\">⚡</span>" : "<span class=\"spent\">ー</span>");
    }
    return marks.join("");
  }

  function tileLabel(character) {
    var month = getCurrentMonth();
    if (character.isTraveler) return { text: "主人公", cls: "" };
    if ((month.openingCast || []).indexOf(character.id) !== -1) return { text: "開幕", cls: "" };
    if ((month.specialCast || []).indexOf(character.id) !== -1) return { text: "特別招待", cls: "" };
    if ((month.elements || []).indexOf(character.element) !== -1) return { text: "出演元素", cls: "" };
    return { text: "対象外", cls: "gray" };
  }

  function renderRosterCount() {
    var count = countRostered();
    var onFieldCount = countOnFieldRostered();
    dom.rosterCount.classList.remove("ready", "over");
    var remaining = ROSTER_MIN - count;
    var sub;
    if (count >= ROSTER_MAX) {
      sub = "上限に到達";
      dom.rosterCount.classList.add("over");
    } else if (count >= ROSTER_MIN) {
      sub = "開始可能";
      dom.rosterCount.classList.add("ready");
    } else {
      sub = "あと" + remaining + "人";
    }
    var text = "待機キャスト：" + count + "名選択中（" + sub + "）";
    var onFieldWarn = onFieldCount < 7;
    var onFieldIconPath = tagIconPath("オンフィールド");
    var onFieldIcon = onFieldIconPath
      ? "<span class=\"tip-trigger count-onfield-icon-btn\" data-tip=\"推奨：6〜8キャラ\" aria-label=\"オンフィールドキャラについて\"><img class=\"count-onfield-icon\" src=\"" + escapeHtml(onFieldIconPath) + "\" alt=\"オンフィールド\"></span>"
      : "";
    dom.rosterCount.innerHTML = "<span class=\"roster-count-heading\">編成状況</span>" +
      "<span class=\"count-main\">" + escapeHtml(text) + "</span>" +
      "<span class=\"count-onfield" + (onFieldWarn ? " warn" : "") + "\">" + onFieldIcon + escapeHtml(onFieldCount) + "人</span>";
    bindTipTriggers(dom.rosterCount);
  }

  function matchesRosterModalFilter(character) {
    if (rosterModalElement !== "all" && character.element !== rosterModalElement) return false;
    if (rosterModalTags.size) {
      var tags = getVisibleTags(character);
      if (!Array.from(rosterModalTags).every(function (tag) { return tags.indexOf(tag) !== -1; })) return false;
    }
    return true;
  }

  function renderRosterModalContent() {
    var month = getCurrentMonth();
    var opening = month.openingCast || [];
    var specialCast = month.specialCast || [];
    var pool = master.characters.filter(function (character) {
      // 主人公も待機キャスト扱い。今月の元素の主人公だけを候補に出す。
      if (character.isTraveler) return isTravelerActive(character);
      if (opening.indexOf(character.id) !== -1) return false;
      return (month.elements || []).indexOf(character.element) !== -1 || specialCast.indexOf(character.id) !== -1;
    });
    var openingChars = opening.map(getCharacter).filter(Boolean);
    function castRank(character) {
      return specialCast.indexOf(character.id) !== -1 ? 0 : 1;
    }
    function sortForRosterModal(list) {
      return list.slice().sort(function (a, b) {
        var rankDiff = castRank(a) - castRank(b);
        if (rankDiff !== 0) return rankDiff;
        return getLevel(b) - getLevel(a);
      });
    }
    var rosteredChars = sortForRosterModal(pool.filter(function (character) { return isUsableThisMonth(character) && isRostered(character); }).filter(matchesRosterModalFilter));
    var notRosteredChars = sortForRosterModal(pool.filter(function (character) { return isUsableThisMonth(character) && !isRostered(character); }).filter(matchesRosterModalFilter));
    var ineligibleChars = pool.filter(function (character) { return !isUsableThisMonth(character); });

    renderRosterModalFilterToggle();
    renderRosterModalFilterChips();

    var rosterCount = countRostered();
    var rosterOk = rosterCount >= ROSTER_MIN && rosterCount <= ROSTER_MAX;
    dom.rosterModalStatus.className = "roster-modal-status" + (rosterOk ? " ok" : " warn");
    dom.rosterModalStatus.textContent = rosterOk
      ? "待機キャスト：" + rosterCount + "名（開始できます）"
      : "待機キャスト：" + rosterCount + "名（出撃不可※" + ROSTER_MIN + "〜" + ROSTER_MAX + "名で公演開始できます）";

    dom.rosterModalSummary.innerHTML = "";
    (month.elements || []).forEach(function (element) {
      var pill = document.createElement("span");
      pill.className = "roster-modal-summary-pill";
      applyElementColor(pill, element);
      var icon = elementIconPath(element);
      pill.innerHTML = (icon ? "<img class=\"comp-icon\" src=\"" + escapeHtml(icon) + "\" alt=\"\">" : escapeHtml(element)) +
        escapeHtml(String(countSelectedByElement(element)));
      dom.rosterModalSummary.appendChild(pill);
    });
    var onFieldPill = document.createElement("span");
    onFieldPill.className = "roster-modal-summary-pill";
    var onIcon = tagIconPath("オンフィールド");
    var onFieldIconHtml = onIcon
      ? "<span class=\"tip-trigger count-onfield-icon-btn\" data-tip=\"推奨：6〜8キャラ\" aria-label=\"オンフィールドキャラについて\"><img class=\"comp-icon count-onfield-icon\" src=\"" + escapeHtml(onIcon) + "\" alt=\"\"></span>"
      : "オン";
    onFieldPill.innerHTML = onFieldIconHtml + escapeHtml(String(countOnFieldRostered()));
    dom.rosterModalSummary.appendChild(onFieldPill);
    bindTipTriggers(dom.rosterModalSummary);

    // 絞り込みは編成状況ヘッダーの sticky ブロック内に置き、スクロールしても追従させる
    var stickyBlock = document.querySelector(".roster-modal-sticky");
    if (stickyBlock) {
      stickyBlock.appendChild(dom.rosterModalFilterToggle);
      stickyBlock.appendChild(dom.rosterModalFilterPanel);
    }

    dom.rosterModalBody.innerHTML = "";
    dom.rosterModalBody.appendChild(buildBossCoverageSection());
    dom.rosterModalBody.appendChild(buildRosterModalSection("開幕キャスト", openingChars, "fixed"));
    dom.rosterModalBody.appendChild(buildRosterModalSection("待機キャスト：選択済み", rosteredChars, "roster", { noParens: true, numbered: true }));
    dom.rosterModalBody.appendChild(buildRosterModalSection("待機キャスト選択してないキャラ", notRosteredChars, "roster", { muted: true }));
    dom.rosterModalBody.appendChild(buildRosterModalSection("未所持・レベル不足キャラ", ineligibleChars, "ineligible", { muted: true }));
  }

  function isInSelectedCast(character) {
    if (!isUsableThisMonth(character)) return false;
    var opening = getCurrentMonth().openingCast || [];
    return opening.indexOf(character.id) !== -1 || isRostered(character);
  }

  function getStageRecommendCandidates(stage) {
    var enemyTags = getEnemyTags(stage);
    var recommendedIds = getRecommendedCharacterIds(stage);
    if (!enemyTags.length && !recommendedIds.length) return null;
    var eligible = master.characters.filter(function (character) {
      if (character.isTraveler && !isTravelerActive(character)) return false;
      if (!isUsableThisMonth(character)) return false;
      return isRecommendedCandidate(character, stage);
    });
    var pinned = eligible.filter(function (character) { return recommendedIds.indexOf(character.id) !== -1; });
    var rest = eligible.filter(function (character) { return recommendedIds.indexOf(character.id) === -1; });
    return pinned.concat(rest);
  }

  function hasNonElementMatch(character, stage) {
    if (getRecommendedCharacterIds(stage).indexOf(character.id) !== -1) return true;
    var enemy = getSelectedEnemy(stage);
    var otherTags = enemy.tags || [];
    if (!otherTags.length) return false;
    var charTags = getMatchableTags(character);
    return otherTags.some(function (tag) { return charTags.indexOf(tag) !== -1; });
  }

  function buildBossCoverageSection() {
    var section = document.createElement("section");
    section.className = "roster-modal-section";
    var heading = document.createElement("h3");
    heading.textContent = "ボス相性チェック";
    section.appendChild(heading);

    var entries = getCurrentStages().map(function (stage) {
      return { stage: stage, candidates: getStageRecommendCandidates(stage) };
    }).filter(function (entry) { return entry.candidates !== null; });

    if (!entries.length) {
      var empty = document.createElement("p");
      empty.className = "roster-modal-empty";
      empty.textContent = "相性タグ・おすすめキャラが設定された幕はありません。";
      section.appendChild(empty);
      return section;
    }

    var grid = document.createElement("div");
    grid.className = "boss-coverage-grid";
    entries.forEach(function (entry) {
      grid.appendChild(buildBossCoverageCard(entry.stage, entry.candidates));
    });
    section.appendChild(grid);
    return section;
  }

  function buildBossCoverageCard(stage, candidates) {
    var enemy = getSelectedEnemy(stage);
    var card = document.createElement("div");
    card.className = "boss-coverage-card";

    var head = document.createElement("div");
    head.className = "boss-coverage-head";
    var bossIcon = document.createElement("span");
    bossIcon.className = "boss-coverage-icon";
    if (enemy.image) {
      bossIcon.classList.add("has-image");
      var bossImg = document.createElement("img");
      bossImg.src = enemy.image;
      bossImg.alt = "";
      bossIcon.appendChild(bossImg);
    } else {
      bossIcon.textContent = enemy.icon || "?";
    }
    head.appendChild(bossIcon);
    var title = document.createElement("span");
    title.className = "boss-coverage-title";
    title.textContent = stage.name;
    head.appendChild(title);
    card.appendChild(head);

    var covered = candidates.some(isInSelectedCast);
    var elementOnly = !getRecommendedCharacterIds(stage).length && !(enemy.tags || []).length && (enemy.element || []).length > 0;
    var status = document.createElement("div");
    status.className = "boss-coverage-status" + (covered ? " covered" : " missing");

    if (covered && elementOnly) {
      var check0 = document.createElement("span");
      check0.className = "boss-coverage-check";
      check0.textContent = "✓";
      status.appendChild(check0);
      var elemText = document.createElement("span");
      elemText.textContent = "相性のいい元素：";
      status.appendChild(elemText);
      var elemWrap = document.createElement("span");
      elemWrap.className = "boss-coverage-elem-icons";
      (enemy.element || []).forEach(function (elementName) {
        var iconPath = elementIconPath(elementName);
        if (iconPath) {
          var elemIcon = document.createElement("img");
          elemIcon.className = "comp-icon boss-coverage-elem-icon";
          elemIcon.src = iconPath;
          elemIcon.alt = elementName;
          elemWrap.appendChild(elemIcon);
        } else {
          var elemFallback = document.createElement("span");
          elemFallback.textContent = elementName;
          elemWrap.appendChild(elemFallback);
        }
      });
      status.appendChild(elemWrap);
    } else if (covered) {
      var check = document.createElement("span");
      check.className = "boss-coverage-check";
      check.textContent = "✓";
      status.appendChild(check);
      var okText = document.createElement("span");
      okText.textContent = "相性の良いキャストが選出済み";
      status.appendChild(okText);
      var taggedCovered = candidates.filter(isInSelectedCast).filter(function (character) {
        return hasNonElementMatch(character, stage);
      });
      if (taggedCovered.length) {
        var iconsWrap = document.createElement("span");
        iconsWrap.className = "boss-coverage-covered-icons";
        taggedCovered.forEach(function (character) {
          var icon = document.createElement("span");
          icon.className = "portrait boss-coverage-mini-portrait";
          icon.title = character.name;
          setPortrait(icon, character);
          iconsWrap.appendChild(icon);
        });
        status.appendChild(iconsWrap);
      }
    } else if (candidates.length) {
      var suggestion = candidates[0];
      var portrait = document.createElement("span");
      portrait.className = "portrait boss-coverage-portrait";
      setPortrait(portrait, suggestion);
      status.appendChild(portrait);
      var suggestText = document.createElement("span");
      suggestText.textContent = suggestion.name + " がおすすめ";
      status.appendChild(suggestText);
    } else {
      status.textContent = "該当キャラなし";
    }
    card.appendChild(status);

    if (enemy.note) {
      var note = document.createElement("p");
      note.className = "boss-coverage-note";
      note.textContent = enemy.note;
      card.appendChild(note);
    }

    return card;
  }

  function buildRosterModalSection(title, characters, mode, options) {
    options = options || {};
    var section = document.createElement("section");
    section.className = "roster-modal-section" + (options.muted ? " roster-modal-section-muted" : "");
    var heading = document.createElement("h3");
    heading.textContent = options.noParens ? (title + characters.length + "名") : (title + "（" + characters.length + "名）");
    section.appendChild(heading);
    if (!characters.length) {
      var empty = document.createElement("p");
      empty.className = "roster-modal-empty";
      empty.textContent = "該当キャラはいません。";
      section.appendChild(empty);
      return section;
    }
    var grid = document.createElement("div");
    grid.className = "roster-modal-tile-grid";
    characters.forEach(function (character, index) {
      grid.appendChild(buildRosterModalTile(character, mode, options.numbered ? index + 1 : null));
    });
    section.appendChild(grid);
    return section;
  }

  function buildRosterModalTile(character, mode, number) {
    var tile = document.createElement("article");
    tile.className = "tile modal-tile" + (isRostered(character) ? " is-rostered" : "");

    var select = document.createElement("div");
    select.className = "tile-select";
    applyElementColor(select, character.element);

    if (number) {
      var badge = document.createElement("span");
      badge.className = "modal-tile-number";
      badge.textContent = number;
      select.appendChild(badge);
    }

    var portraitWrap = document.createElement("span");
    portraitWrap.className = "modal-tile-portrait-wrap";
    var portrait = document.createElement("span");
    portrait.className = "portrait tile-portrait";
    setPortrait(portrait, character);
    portraitWrap.appendChild(portrait);
    portraitWrap.appendChild(buildElemBadge(character, "modal-tile-elem-corner"));
    select.appendChild(portraitWrap);

    var name = document.createElement("span");
    name.className = "tile-name";
    name.textContent = character.name;
    select.appendChild(name);

    var meta = document.createElement("span");
    meta.className = "modal-tile-meta";
    meta.textContent = "Lv." + getLevel(character);
    select.appendChild(meta);

    select.appendChild(buildModalTileBadges(character));

    if (mode === "roster") {
      select.classList.add("tile-select-toggle");
      select.setAttribute("role", "button");
      select.setAttribute("tabindex", "0");
      select.setAttribute("aria-pressed", String(isRostered(character)));
      select.setAttribute("aria-label", (isRostered(character) ? "待機キャストから外す：" : "待機キャストに追加：") + character.name);
      var toggleRoster = function () {
        var rosterSet = getRosterSet(getCurrentMonth().id);
        rosterSet[character.id] = !rosterSet[character.id];
        render();
      };
      select.addEventListener("click", toggleRoster);
      select.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleRoster();
        }
      });
    }

    tile.appendChild(select);

    if (mode === "ineligible") {
      var controls = document.createElement("div");
      controls.className = "modal-tile-controls";

      var ownedLabel = document.createElement("label");
      ownedLabel.className = "tile-check";
      var ownedCheckbox = document.createElement("input");
      ownedCheckbox.type = "checkbox";
      ownedCheckbox.checked = isOwned(character.id);
      ownedCheckbox.addEventListener("change", function () {
        state.owned[character.id] = ownedCheckbox.checked;
        render();
      });
      ownedLabel.appendChild(ownedCheckbox);
      ownedLabel.appendChild(document.createTextNode("所持"));
      controls.appendChild(ownedLabel);

      var levelInput = document.createElement("input");
      levelInput.type = "number";
      levelInput.min = "1";
      levelInput.max = "100";
      levelInput.className = "roster-modal-level";
      levelInput.value = String(getLevel(character));
      levelInput.addEventListener("change", function () {
        var value = Math.max(1, Math.min(100, Number(levelInput.value) || 1));
        state.levels[character.id] = value;
        render();
      });
      controls.appendChild(levelInput);
      tile.appendChild(controls);
    }

    return tile;
  }

  function renderCharacterList() {
    var usage = calculateUsage();
    var query = dom.searchInput.value.trim().toLowerCase();
    var showAll = dom.showAllToggle.checked;
    var month = getCurrentMonth();
    var opening = month.openingCast || [];
    var special = month.specialCast || [];
    var characters = master.characters.filter(function (character) {
      if (character.isTraveler && !isTravelerActive(character)) return false;
      if (!showAll && !isUsableThisMonth(character)) return false;
      var tags = getVisibleTags(character);
      var text = [character.name, character.element, getLevel(character)].concat(tags).join(" ").toLowerCase();
      if (query && !text.includes(query)) return false;
      if (activeElement !== "all" && character.element !== activeElement) return false;
      if (activeTags.size && !Array.from(activeTags).every(function (tag) { return tags.includes(tag); })) return false;
      return true;
    });

    function castTier(character) {
      if (opening.indexOf(character.id) !== -1) return 0;
      if (special.indexOf(character.id) !== -1 && isRostered(character)) return 1;
      return 2;
    }
    function rosterRank(character) {
      return castTier(character) === 0 ? 0 : (isRostered(character) ? 0 : 1);
    }
    characters.sort(function (a, b) {
      var tierDiff = castTier(a) - castTier(b);
      if (tierDiff !== 0) return tierDiff;
      return rosterRank(a) - rosterRank(b);
    });

    renderRosterCount();

    dom.characterList.innerHTML = "";
    var template = document.getElementById("tileTemplate");
    characters.forEach(function (character) {
      var clone = template.content.firstElementChild.cloneNode(true);
      var remaining = master.rules.maxVitality - (usage[character.id] || 0);
      var usable = isUsableThisMonth(character);
      var needsRoster = castTier(character) !== 0 && !isRostered(character);
      clone.classList.toggle("selected", character.id === selectedCharacterId);
      clone.classList.toggle("dimmed", !usable);
      clone.classList.toggle("not-rostered", usable && needsRoster);
      clone.classList.toggle("rostered", isRostered(character));
      applyElementColor(clone, character.element);

      var label = tileLabel(character);
      var labelEl = clone.querySelector(".tile-label");
      labelEl.textContent = label.text;
      labelEl.className = "tile-label" + (label.cls ? " " + label.cls : "");

      setPortrait(clone.querySelector(".tile-portrait"), character);
      clone.querySelector(".tile-select").appendChild(buildElemBadge(character, "tile-elem-badge"));
      clone.querySelector(".tile-vitality").innerHTML = vitalityMarks(remaining, master.rules.maxVitality);
      clone.querySelector(".tile-name").textContent = character.name;

      var badges = clone.querySelector(".tile-badges");
      var badgeHtml = "";
      var positions = (character.tags && character.tags.positions) || [];
      positions.forEach(function (position) {
        var posIcon = tagIconPath(position);
        var posLabel = position === "オンフィールド" ? "オン" : "オフ";
        badgeHtml += "<span class=\"mini-badge mini-badge-icon-only\">" + (posIcon ? "<img class=\"badge-icon\" src=\"" + escapeHtml(posIcon) + "\" alt=\"" + escapeHtml(posLabel) + "\">" : escapeHtml(posLabel)) + "</span>";
      });
      (character.tags && character.tags.roles || []).slice(0, 1).forEach(function (role) {
        var roleIcon = tagIconPath(role);
        badgeHtml += "<span class=\"mini-badge mini-badge-icon-only\">" + (roleIcon ? "<img class=\"badge-icon\" src=\"" + escapeHtml(roleIcon) + "\" alt=\"" + escapeHtml(role) + "\">" : escapeHtml(role)) + "</span>";
      });
      badges.innerHTML = badgeHtml;

      clone.querySelector(".tile-select").addEventListener("click", function () {
        if (activeSlot) {
          placeCharacterInActiveSlot(character.id);
          return;
        }
        selectedCharacterId = character.id;
        openCharacterPanel();
      });

      var isOpeningCast = (month.openingCast || []).indexOf(character.id) !== -1;
      var rosterCheck = clone.querySelector(".tile-check");
      if (isOpeningCast) {
        rosterCheck.classList.add("hidden");
        clone.querySelector(".tile-roster").disabled = true;
      } else {
        var checkbox = clone.querySelector(".tile-roster");
        checkbox.checked = isRostered(character);
        checkbox.disabled = !usable;
        checkbox.addEventListener("change", function (event) {
          event.stopPropagation();
          getRosterSet(month.id)[character.id] = checkbox.checked;
          render();
        });
        rosterCheck.addEventListener("click", function (event) { event.stopPropagation(); });
      }

      dom.characterList.appendChild(clone);
    });

    if (!characters.length) {
      dom.characterList.innerHTML = "<div class=\"empty-editor\">条件に合うキャラがいません。</div>";
    }
  }

  function renderStages() {
    dom.stageList.innerHTML = "";
    var template = document.getElementById("stageTemplate");
    var flow = calculateFlowerFlow();
    var usage = calculateUsage();
    var buffs = getCurrentBuffs();
    var inviteGuide = calculateInviteGuide();
    var monthId = getCurrentMonth().id;
    var assignments = getMonthStore(state.assignments, monthId);
    var actions = getMonthStore(state.actions, monthId);
    var notes = getMonthStore(state.stageNotes, monthId);

    getCurrentStages().forEach(function (stage, index) {
      var clone = template.content.firstElementChild.cloneNode(true);
      clone.classList.toggle("active", stage.id === selectedStageId);
      clone.dataset.stageId = stage.id;
      clone.classList.toggle("special", Boolean(stage.special));
      var stageTitle = clone.querySelector(".stage-title");
      // 「第10幕（ボス）　フェーズ12」の順で表示。フェーズ番号は灰色・小さめ。
      stageTitle.textContent = "";
      stageTitle.appendChild(document.createTextNode(stage.name));
      var stageArcanaPath = arcanaIconForStage(stage);
      if (stageArcanaPath) {
        var stageArcanaIcon = document.createElement("img");
        stageArcanaIcon.className = "stage-title-arcana-icon";
        stageArcanaIcon.src = stageArcanaPath;
        stageArcanaIcon.alt = "";
        stageTitle.appendChild(stageArcanaIcon);
      }
      var stagePhaseLabel = document.createElement("span");
      stagePhaseLabel.className = "stage-phase-label";
      stagePhaseLabel.textContent = "フェーズ" + (index + 1);
      stageTitle.appendChild(stagePhaseLabel);
      stageTitle.addEventListener("click", function () {
        selectedStageId = stage.id;
        render();
      });

      var stageType = STAGE_TYPE_BY_ID[stage.id];
      var objective = STAGE_OBJECTIVE_BY_ID[stage.id];
      var metaParts = [];
      if (stage.special) metaParts.push({ text: "特別挑戦", cls: "type-special" });
      if (stage.final) metaParts.push({ text: "最終戦", cls: "" });
      if (stageType === "boss") metaParts.push({ text: "ボス", cls: "type-boss" });
      if (objective) metaParts.push({ text: objective, cls: "type-objective" });

      clone.querySelector(".stage-meta").innerHTML = metaParts.map(function (part) {
        return "<span" + (part.cls ? " class=\"" + part.cls + "\"" : "") + ">" + escapeHtml(part.text) + "</span>";
      }).join("");

      renderEnemyBox(clone.querySelector(".enemy-box"), stage);
      renderEnemyChoiceRow(clone.querySelector(".enemy-choice-row"), clone.querySelector(".enemy-choice-overlay"), stage);

      var controls = clone.querySelector(".stage-controls");
      controls.appendChild(numberControl("キャラ招待", actions[stage.id].invites, 0, 8, function (value) {
        actions[stage.id].invites = value;
        render();
      }));
      buffs.forEach(function (buff) {
        var currentLevel = flow.byStage[stage.id].buffLevelsAfter[buff.id];
        var reactionIcon = (master.icons && master.icons.reactions && master.icons.reactions[buff.name]) || "";
        controls.appendChild(numberControl(buff.name + " 現在Lv." + currentLevel, actions[stage.id].buffs[buff.id], 0, master.rules.buffMaxLevel, function (value) {
          actions[stage.id].buffs[buff.id] = value;
          render();
        }, reactionIcon));
      });
      var flower = document.createElement("div");
      flower.className = "flower-readout";
      var flowerIconPath = (master.icons && master.icons.flower) || "";
      var flowerIconHtml = flowerIconPath ? "<img class=\"inline-icon\" src=\"" + escapeHtml(flowerIconPath) + "\" alt=\"\">" : "";
      var stageCost = flow.byStage[stage.id].before - flow.byStage[stage.id].afterAction;
      var costLine = "<div class=\"flower-cost\">" + flowerIconHtml + (stageCost > 0 ? "-" + stageCost : "±0") + "</div>";
      var detailLine = "<div class=\"flower-detail\">" + flow.byStage[stage.id].before + " → " + flow.byStage[stage.id].afterAction + " ・終了後" + flow.byStage[stage.id].afterReward + "</div>";
      flower.innerHTML = costLine + detailLine;
      controls.appendChild(flower);

      renderCompositionStrip(clone.querySelector(".composition-strip"), assignments[stage.id]);

      var guideRow = document.createElement("div");
      guideRow.className = "invite-guide";
      renderInviteGuide(guideRow, inviteGuide[stage.id]);
      clone.querySelector(".composition-strip").insertAdjacentElement("afterend", guideRow);

      var slots = clone.querySelector(".slot-grid");
      assignments[stage.id].forEach(function (characterId, slotIndex) {
        slots.appendChild(renderSlot(stage, index, slotIndex, characterId, usage));
      });

      renderRecommendRow(clone.querySelector(".recommend-row"), stage, assignments[stage.id], index);

      var stageNote = clone.querySelector(".stage-note textarea");
      stageNote.value = notes[stage.id] || "";
      stageNote.addEventListener("input", function () {
        notes[stage.id] = stageNote.value;
        saveState();
      });

      dom.stageList.appendChild(clone);
    });
  }

  function renderCompositionStrip(container, slotIds) {
    var placed = slotIds.filter(Boolean).map(getCharacter).filter(Boolean);
    container.innerHTML = "";
    if (!placed.length) {
      container.classList.add("hidden");
      return;
    }
    container.classList.remove("hidden");

    var byElement = {};
    var onField = 0;
    var offField = 0;
    var lunarCount = 0;
    var magicCount = 0;
    var artifactCounts = {};
    placed.forEach(function (character) {
      byElement[character.element] = (byElement[character.element] || 0) + 1;
      var positions = (character.tags && character.tags.positions) || [];
      if (positions.indexOf("オンフィールド") !== -1) onField += 1;
      if (positions.indexOf("オフフィールド") !== -1) offField += 1;
      if (character.tags && character.tags.lunar) lunarCount += 1;
      if (character.tags && character.tags.magic && getLevel(character) >= 70) magicCount += 1;
      var setId = getArtifactSet(character.id);
      if (setId && setId !== "none") artifactCounts[setId] = (artifactCounts[setId] || 0) + 1;
    });

    Object.keys(byElement).forEach(function (element) {
      var pill = document.createElement("span");
      pill.className = "comp-pill";
      applyElementColor(pill, element);
      var elemIcon = elementIconPath(element);
      pill.innerHTML = (elemIcon ? "<img class=\"comp-icon\" src=\"" + escapeHtml(elemIcon) + "\" alt=\"" + escapeHtml(element) + "\">" : escapeHtml(element)) + escapeHtml(String(byElement[element]));
      container.appendChild(pill);
    });
    var divider = document.createElement("span");
    divider.className = "comp-divider";
    divider.textContent = "／";
    container.appendChild(divider);
    var onPill = document.createElement("span");
    onPill.className = "comp-pill neutral";
    var onIcon = tagIconPath("オンフィールド");
    onPill.innerHTML = (onIcon ? "<img class=\"comp-icon\" src=\"" + escapeHtml(onIcon) + "\" alt=\"オン\">" : "オン") + escapeHtml(String(onField));
    container.appendChild(onPill);
    var offPill = document.createElement("span");
    offPill.className = "comp-pill neutral";
    var offIcon = tagIconPath("オフフィールド");
    offPill.innerHTML = (offIcon ? "<img class=\"comp-icon\" src=\"" + escapeHtml(offIcon) + "\" alt=\"オフ\">" : "オフ") + escapeHtml(String(offField));
    container.appendChild(offPill);

    if (lunarCount >= 2) {
      var lunarPill = document.createElement("span");
      lunarPill.className = "comp-pill tagged";
      lunarPill.textContent = "月兆✅";
      container.appendChild(lunarPill);
    }
    if (magicCount >= 2) {
      var magicPill = document.createElement("span");
      magicPill.className = "comp-pill tagged";
      magicPill.textContent = "魔導✅";
      container.appendChild(magicPill);
    }

    Object.keys(artifactCounts).forEach(function (setId) {
      if (artifactCounts[setId] < 2) return;
      var set = getArtifactSetInfo(setId);
      var warnPill = document.createElement("span");
      warnPill.className = "comp-pill warn-pill";
      warnPill.textContent = (set ? set.name : setId) + " 重複×" + artifactCounts[setId];
      warnPill.appendChild(document.createRange().createContextualFragment(renderTipHtml("artifactSet", "聖遺物セットの重複について")));
      container.appendChild(warnPill);
    });
    bindTipTriggers(container);
  }

  function renderEnemyBox(container, stage) {
    var enemy = getSelectedEnemy(stage);
    if (!enemy.name && !enemy.note && !enemy.icon && !enemy.image) {
      container.classList.add("hidden");
      return;
    }
    var iconHtml = enemy.image
      ? "<span class=\"enemy-icon has-image\"><img src=\"" + escapeHtml(enemy.image) + "\" alt=\"\"></span>"
      : "<span class=\"enemy-icon\">" + escapeHtml(enemy.icon || "敵") + "</span>";
    container.innerHTML =
      iconHtml +
      "<span class=\"enemy-text\"><strong>" + escapeHtml(enemy.name || "敵情報") + "</strong><span>" + escapeHtml(enemy.note || "") + "</span></span>";
  }

  function renderEnemyChoiceRow(container, overlaySelect, stage) {
    var options = getEnemyOptions(stage);
    container.innerHTML = "";
    overlaySelect.innerHTML = "";
    if (options.length < 2) {
      container.classList.add("hidden");
      overlaySelect.classList.add("hidden");
      return;
    }
    container.classList.remove("hidden");
    overlaySelect.classList.remove("hidden");
    var selectedIndex = getSelectedEnemyIndex(stage);

    var labelText = document.createElement("span");
    labelText.textContent = "選択";
    container.appendChild(labelText);
    var arrow = document.createElement("span");
    arrow.className = "enemy-choice-arrow";
    arrow.textContent = "▾";
    container.appendChild(arrow);

    options.forEach(function (enemy, index) {
      var option = document.createElement("option");
      option.value = String(index);
      option.textContent = (enemy.icon ? enemy.icon + " " : "") + (enemy.name || "敵" + (index + 1));
      if (index === selectedIndex) option.selected = true;
      overlaySelect.appendChild(option);
    });
    overlaySelect.addEventListener("change", function () {
      setSelectedEnemyIndex(stage, Number(overlaySelect.value));
      render();
    });
  }

  function numberControl(label, value, min, max, onChange, iconPath) {
    value = value || 0;
    var wrapper = document.createElement("div");
    wrapper.className = "stepper-control";

    var labelEl = document.createElement("span");
    labelEl.className = "stepper-label";
    if (iconPath) {
      var icon = document.createElement("img");
      icon.className = "pill-icon";
      icon.src = iconPath;
      icon.alt = "";
      labelEl.appendChild(icon);
    }
    labelEl.appendChild(document.createTextNode(label));
    wrapper.appendChild(labelEl);

    var row = document.createElement("div");
    row.className = "stepper-row";

    var minus = document.createElement("button");
    minus.type = "button";
    minus.className = "stepper-btn";
    minus.textContent = "－";
    minus.disabled = value <= min;
    minus.addEventListener("click", function () { onChange(Math.max(min, value - 1)); });
    row.appendChild(minus);

    var valueEl = document.createElement("span");
    valueEl.className = "stepper-value";
    valueEl.textContent = value > 0 ? "+" + value : String(value);
    row.appendChild(valueEl);

    var plus = document.createElement("button");
    plus.type = "button";
    plus.className = "stepper-btn";
    plus.textContent = "＋";
    plus.disabled = value >= max;
    plus.addEventListener("click", function () { onChange(Math.min(max, value + 1)); });
    row.appendChild(plus);

    wrapper.appendChild(row);
    return wrapper;
  }

  function slotKey(stageId, slotIndex) {
    return stageId + "::" + slotIndex;
  }

  function placeCharacterInActiveSlot(characterId) {
    if (!activeSlot) return;
    var character = getCharacter(characterId);
    var month = getCurrentMonth();
    var opening = month.openingCast || [];
    var monthId = month.id;
    var assignments = getMonthStore(state.assignments, monthId);
    var stageId = activeSlot.stageId;
    var slotIndex = activeSlot.slotIndex;
    var alreadyPlaced = assignments[stageId].some(function (id, index) {
      return id === characterId && index !== slotIndex;
    });
    activeSlot = null;
    if (alreadyPlaced) {
      var duplicate = getCharacter(characterId);
      toast((duplicate ? duplicate.name : "このキャラ") + "は同じフェーズにすでにいます");
      render();
      return;
    }
    // 配置したら自動で待機キャストに追加（開幕キャスト以外の出演可能キャラ。主人公も待機キャスト扱い）
    if (character && opening.indexOf(characterId) === -1 &&
        isUsableThisMonth(character) && !isRostered(character)) {
      getRosterSet(monthId)[characterId] = true;
      toast(character.name + "を待機キャストに追加しました");
    }
    assignments[stageId][slotIndex] = characterId;
    render();
  }

  var slotPickerEl = null;
  var slotPickerOutsideHandler = null;

  function closeSlotPicker() {
    if (slotPickerOutsideHandler) {
      document.removeEventListener("click", slotPickerOutsideHandler, true);
      slotPickerOutsideHandler = null;
    }
    if (slotPickerEl) {
      slotPickerEl.remove();
      slotPickerEl = null;
    }
  }

  function placeAndAdvance(stage, slotIndex, characterId) {
    activeSlot = { stageId: stage.id, slotIndex: slotIndex };
    placeCharacterInActiveSlot(characterId); // 配置＋自動待機キャスト＋render

    // 同フェーズの次の空き枠へ自動でpickerを移す
    var assignments = getMonthStore(state.assignments, getCurrentMonth().id);
    var arr = assignments[stage.id] || [];
    var nextEmpty = -1;
    for (var i = 0; i < arr.length; i++) {
      if (!arr[i]) { nextEmpty = i; break; }
    }
    if (nextEmpty !== -1) {
      activeSlot = { stageId: stage.id, slotIndex: nextEmpty };
      render();
      showSlotPicker(stage, nextEmpty);
    } else {
      closeSlotPicker();
    }
  }

  function showSlotPicker(stage, slotIndex) {
    closeSlotPicker();
    var monthId = getCurrentMonth().id;
    var assignments = getMonthStore(state.assignments, monthId);
    var placedInPhase = (assignments[stage.id] || []).filter(Boolean);
    var usage = calculateUsage();
    var elementOrder = master.elements || [];
    var maxVit = master.rules.maxVitality;

    var candidates = master.characters.filter(function (c) {
      if (c.isTraveler && !isTravelerActive(c)) return false;
      if (!isUsableThisMonth(c)) return false;
      if (placedInPhase.indexOf(c.id) !== -1) return false; // 同フェーズ重複は非表示
      return true;
    });
    candidates.sort(function (a, b) {
      var ra = isRecommendedCandidate(a, stage) ? 0 : 1;
      var rb = isRecommendedCandidate(b, stage) ? 0 : 1;
      if (ra !== rb) return ra - rb;
      var ea = (usage[a.id] || 0) >= maxVit ? 1 : 0;
      var eb = (usage[b.id] || 0) >= maxVit ? 1 : 0;
      if (ea !== eb) return ea - eb;
      return elementOrder.indexOf(a.element) - elementOrder.indexOf(b.element);
    });

    var bubble = document.createElement("div");
    bubble.className = "slot-picker";
    var header = document.createElement("div");
    header.className = "slot-picker-header";
    header.textContent = "配置するキャラを選ぶ（" + (slotIndex + 1) + "枠目）";
    bubble.appendChild(header);

    if (!candidates.length) {
      var empty = document.createElement("div");
      empty.className = "slot-picker-empty";
      empty.textContent = "配置できるキャラがいません";
      bubble.appendChild(empty);
    } else {
      var grid = document.createElement("div");
      grid.className = "slot-picker-grid";
      candidates.forEach(function (c) {
        var remaining = maxVit - (usage[c.id] || 0);
        var exhausted = remaining <= 0;
        var item = document.createElement("button");
        item.type = "button";
        item.className = "slot-picker-item" + (exhausted ? " exhausted" : "");
        item.title = c.name + (exhausted ? "（活力切れ）" : "");
        applyElementColor(item, c.element);
        var wrap = document.createElement("span");
        wrap.className = "slot-picker-portrait-wrap";
        var portrait = document.createElement("span");
        portrait.className = "portrait slot-picker-portrait";
        setPortrait(portrait, c);
        wrap.appendChild(portrait);
        wrap.appendChild(buildElemBadge(c, "slot-picker-elem"));
        if (isRecommendedCandidate(c, stage)) {
          var star = document.createElement("span");
          star.className = "slot-picker-star";
          star.textContent = "★";
          wrap.appendChild(star);
        }
        item.appendChild(wrap);
        var vit = document.createElement("span");
        vit.className = "slot-picker-vitality";
        vit.innerHTML = vitalityMarks(remaining, maxVit);
        item.appendChild(vit);
        if (exhausted) {
          item.disabled = true;
        } else {
          item.addEventListener("click", function () {
            placeAndAdvance(stage, slotIndex, c.id);
          });
        }
        grid.appendChild(item);
      });
      bubble.appendChild(grid);
    }

    bubble.style.left = "0px";
    bubble.style.top = "0px";
    document.body.appendChild(bubble);
    slotPickerEl = bubble;

    // 位置は「その幕のキャラ枠グリッド」を基準にして、枠ごとに左右へ動かないようにする
    var gridEl = dom.stageList.querySelector("[data-stage-id=\"" + stage.id + "\"] .slot-grid");
    var anchor = gridEl ? gridEl.getBoundingClientRect() : { left: 24, top: 100, bottom: 140 };
    placeFixedInViewport(bubble, anchor, 6);

    slotPickerOutsideHandler = function (event) {
      if (slotPickerEl && !slotPickerEl.contains(event.target)) closeSlotPicker();
    };
    setTimeout(function () {
      document.addEventListener("click", slotPickerOutsideHandler, true);
    }, 0);
  }

  function getEnemyOptions(stage) {
    if (stage.enemyOptions && stage.enemyOptions.length) return stage.enemyOptions;
    return stage.enemy ? [stage.enemy] : [];
  }

  function getSelectedEnemyIndex(stage) {
    var monthId = getCurrentMonth().id;
    if (!state.enemyChoice) state.enemyChoice = {};
    if (!state.enemyChoice[monthId]) state.enemyChoice[monthId] = {};
    var options = getEnemyOptions(stage);
    var stored = state.enemyChoice[monthId][stage.id];
    if (typeof stored !== "number" || stored < 0 || stored >= options.length) {
      stored = 0;
      state.enemyChoice[monthId][stage.id] = stored;
    }
    return stored;
  }

  function setSelectedEnemyIndex(stage, index) {
    var monthId = getCurrentMonth().id;
    if (!state.enemyChoice) state.enemyChoice = {};
    if (!state.enemyChoice[monthId]) state.enemyChoice[monthId] = {};
    state.enemyChoice[monthId][stage.id] = index;
  }

  function getSelectedEnemy(stage) {
    var options = getEnemyOptions(stage);
    if (!options.length) return {};
    return options[getSelectedEnemyIndex(stage)] || options[0];
  }

  // 「精鋭襲来」「重圧ディフェンス」を選んだ幕は報酬が+20（90→110）される。
  // 敵オプションに数値 reward があればそれを優先。
  function getStageReward(stage) {
    var enemy = getSelectedEnemy(stage);
    if (typeof enemy.reward === "number") return enemy.reward;
    var name = enemy.name || "";
    if (name.indexOf("精鋭襲来") !== -1 || name.indexOf("重圧ディフェンス") !== -1) {
      return (stage.reward || 0) + 20;
    }
    return stage.reward || 0;
  }

  function getEnemyTags(stage) {
    var enemy = getSelectedEnemy(stage);
    var tags = enemy.tags || [];
    var elementTags = enemy.element || [];
    if (!elementTags.length) return tags;
    return tags.concat(elementTags.filter(function (tag) { return tags.indexOf(tag) === -1; }));
  }

  function getRecommendedCharacterIds(stage) {
    return getSelectedEnemy(stage).recommendedCharacterIds || [];
  }

  function getMatchableTags(character) {
    var tags = getVisibleTags(character, { ignoreMagicHidden: true });
    if (character.element && tags.indexOf(character.element) === -1) {
      tags = tags.concat(character.element);
    }
    if (character.tags && Array.isArray(character.tags.matchOnly)) {
      tags = tags.concat(character.tags.matchOnly);
    }
    return tags;
  }

  function matchesEnemyTags(character, stage) {
    var charTags = getMatchableTags(character);
    var andGroups = getSelectedEnemy(stage).matchGroups;
    if (andGroups && andGroups.length) {
      return andGroups.every(function (group) {
        return group.some(function (tag) { return charTags.indexOf(tag) !== -1; });
      });
    }
    var enemyTags = getEnemyTags(stage);
    if (!enemyTags.length) return false;
    return enemyTags.some(function (tag) { return charTags.indexOf(tag) !== -1; });
  }

  function isRecommendedCandidate(character, stage) {
    if (getRecommendedCharacterIds(stage).indexOf(character.id) !== -1) return true;
    return matchesEnemyTags(character, stage);
  }

  function getMatchReasons(character, stage) {
    var enemyTags = getEnemyTags(stage);
    var charTags = getMatchableTags(character);
    var reasons = enemyTags.filter(function (tag) { return charTags.indexOf(tag) !== -1; });
    if (getRecommendedCharacterIds(stage).indexOf(character.id) !== -1 && reasons.indexOf("指定") === -1) {
      reasons = reasons.concat("指定");
    }
    return reasons;
  }

  function getUsageBeforeStageIndex(stageIndex) {
    var usage = {};
    var monthId = getCurrentMonth().id;
    var assignments = getMonthStore(state.assignments, monthId);
    getCurrentStages().slice(0, stageIndex).forEach(function (stage) {
      assignments[stage.id].forEach(function (characterId) {
        if (characterId) usage[characterId] = (usage[characterId] || 0) + 1;
      });
    });
    return usage;
  }

  function renderRecommendRow(container, stage, slotIds, stageIndex) {
    var enemyTags = getEnemyTags(stage);
    var recommendedIds = getRecommendedCharacterIds(stage);
    container.innerHTML = "";
    if (!enemyTags.length && !recommendedIds.length) {
      container.classList.add("hidden");
      return;
    }
    var placedIds = slotIds.filter(Boolean);
    var usageBefore = getUsageBeforeStageIndex(stageIndex);
    var eligible = master.characters.filter(function (character) {
      if (placedIds.indexOf(character.id) !== -1) return false;
      if (character.isTraveler && !isTravelerActive(character)) return false;
      if (!isUsableThisMonth(character)) return false;
      if ((usageBefore[character.id] || 0) >= master.rules.maxVitality) return false;
      return isRecommendedCandidate(character, stage);
    });
    var pinned = eligible.filter(function (character) { return recommendedIds.indexOf(character.id) !== -1; });
    var rest = eligible.filter(function (character) { return recommendedIds.indexOf(character.id) === -1; });
    var candidates = pinned.concat(rest).slice(0, 6);

    if (!candidates.length) {
      container.classList.add("hidden");
      return;
    }
    container.classList.remove("hidden");

    var label = document.createElement("span");
    label.className = "recommend-label";
    label.textContent = "この幕と相性が良さそうなキャラ:";
    container.appendChild(label);

    candidates.forEach(function (character) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "recommend-chip";
      applyElementColor(button, character.element);
      var portrait = document.createElement("span");
      portrait.className = "portrait recommend-portrait";
      setPortrait(portrait, character);
      button.appendChild(portrait);
      var name = document.createElement("span");
      name.textContent = character.name;
      button.appendChild(name);
      var reasons = getMatchReasons(character, stage);
      if (reasons.length) {
        var reasonEl = document.createElement("span");
        reasonEl.className = "recommend-reason";
        reasonEl.textContent = "・" + reasons.join("・");
        button.appendChild(reasonEl);
      }
      button.addEventListener("click", function () {
        if (activeSlot) {
          placeCharacterInActiveSlot(character.id);
        } else {
          selectedCharacterId = character.id;
          render();
        }
      });
      container.appendChild(button);
    });
  }

  function renderSlot(stage, stageIndex, slotIndex, characterId, usage) {
    var button = document.createElement("button");
    var monthId = getCurrentMonth().id;
    var assignments = getMonthStore(state.assignments, monthId);
    button.type = "button";
    button.className = "slot";
    var isArmed = activeSlot && activeSlot.stageId === stage.id && activeSlot.slotIndex === slotIndex;
    button.classList.toggle("armed", Boolean(isArmed));
    button.addEventListener("click", function () {
      selectedStageId = stage.id;
      if (characterId) {
        selectedCharacterId = characterId;
        characterPanelOpen = true;
      }
      if (isArmed) {
        activeSlot = null;
        closeSlotPicker();
        render();
        return;
      }
      activeSlot = { stageId: stage.id, slotIndex: slotIndex };
      render();
      if (!characterId) {
        showSlotPicker(stage, slotIndex);
      }
    });

    if (!characterId) {
      button.innerHTML = isArmed
        ? "<span class=\"portrait\">👆</span><span class=\"slot-name\"><strong>キャラを選択中</strong><span>一覧からタップ</span></span>"
        : "<span class=\"portrait\">+</span><span class=\"slot-name\"><strong>空き枠</strong><span>タップして選択</span></span>";
      return button;
    }

    var character = getCharacter(characterId);
    if (!character) {
      button.innerHTML = "<span class=\"portrait\">?</span><span class=\"slot-name\"><strong>不明なキャラ</strong><span>マスターから削除済み</span></span>";
      button.classList.add("invalid");
      return button;
    }

    var invalid = !canUseInStage(character) || usage[character.id] > master.rules.maxVitality || duplicatedInStage(stage.id, character.id);
    button.classList.add("filled");
    button.classList.toggle("invalid", invalid);
    applyElementColor(button, character.element);
    var portraitWrap = document.createElement("span");
    portraitWrap.className = "slot-portrait-wrap";
    var portrait = document.createElement("span");
    portrait.className = "portrait";
    setPortrait(portrait, character);
    portraitWrap.appendChild(portrait);
    portraitWrap.appendChild(buildElemBadge(character, "slot-elem-badge"));
    button.appendChild(portraitWrap);
    if (matchesEnemyTags(character, stage)) {
      var star = document.createElement("span");
      star.className = "match-star";
      star.textContent = "★";
      star.setAttribute("aria-label", "この幕の敵タグと相性が良いキャラです");
      button.appendChild(star);
    }
    var setId = getArtifactSet(character.id);
    if (setId && setId !== "none") {
      var setInfo = getArtifactSetInfo(setId);
      var setBadge = document.createElement("span");
      setBadge.className = "artifact-badge";
      setBadge.textContent = setInfo ? setInfo.name : setId;
      button.appendChild(setBadge);
    }
    var name = document.createElement("span");
    name.className = "slot-name";
    var remainingVitality = master.rules.maxVitality - usage[character.id];
    var remainingCls = remainingVitality <= 0 ? "remaining-zero" : "";
    name.innerHTML = "<strong>" + escapeHtml(character.name) + "</strong><span class=\"" + remainingCls + "\">活力残り" + remainingVitality + "</span>";
    button.appendChild(name);
    var clear = document.createElement("span");
    clear.className = "clear-slot";
    clear.textContent = "×";
    clear.setAttribute("aria-label", "外す");
    clear.addEventListener("click", function (event) {
      event.stopPropagation();
      assignments[stage.id][slotIndex] = null;
      render();
    });
    button.appendChild(clear);
    return button;
  }

  function renderEditor() {
    var character = selectedCharacterId ? getCharacter(selectedCharacterId) : null;
    dom.editorEmpty.classList.toggle("hidden", Boolean(character));
    dom.characterEditor.classList.toggle("hidden", !character);
    if (!character) return;

    setPortrait(dom.editorPortrait, character);
    dom.editorStatus.textContent = usabilityLabel(character);
    dom.editorStatus.className = "editor-status" + (isUsableThisMonth(character) ? " ok" : " off");
    dom.nameInput.textContent = character.name || "";
    dom.levelInput.value = getLevel(character);
    setElementIcon(dom.editorElementIcon, character.element);
    dom.noteInput.value = state.characterNotes[character.id] || "";

    var canOwn = !character.isTraveler;
    dom.ownershipRow.classList.toggle("hidden", !(showOwnership() && canOwn));
    dom.ownedInput.checked = isOwned(character.id);
    dom.artifactSetInput.value = getArtifactSet(character.id);

    var tagTipKeys = { "夜魂の加護": "nightsoul", "月兆": "lunar", "魔導": "magic", "プネウマ": "pneumaOusia", "ウーシア": "pneumaOusia" };
    var tags = getVisibleTags(character, { ignoreMagicHidden: true });
    dom.editorTags.innerHTML = tags.map(function (tag) {
      var hidden = tag === "魔導" && state.magicHidden[character.id];
      var tipKey = tagTipKeys[tag];
      var tip = tipKey ? renderTipHtml(tipKey, tag + "とは？") : "";
      var iconPath = tagIconPath(tag);
      var icon = iconPath ? "<img class=\"tag-icon\" src=\"" + escapeHtml(iconPath) + "\" alt=\"\">" : "";
      return "<span class=\"tag-badge" + (hidden ? " muted" : "") + "\">" + icon + escapeHtml(tag) + (hidden ? "（非表示）" : "") + tip + "</span>";
    }).join("");
    bindTipTriggers(dom.editorTags);

    var hasMagic = shouldShowMagicToggle(character);
    dom.magicToggleRow.classList.toggle("hidden", !hasMagic);
    dom.magicVisibleInput.checked = !state.magicHidden[character.id];
  }

  function renderTabBar() {
    if (!dom.tabBarRoster) return;
    dom.tabBarRoster.classList.toggle("active", menuModalOpen && activeMenuTab === "roster");
    dom.tabBarOverview.classList.toggle("active", drawerOpen && rosterTab === "overview");
    dom.tabBarCharacter.classList.toggle("active", characterPanelOpen);
    dom.tabBarHowTo.classList.toggle("active", menuModalOpen && activeMenuTab === "howto");
    dom.tabBarSettings.classList.toggle("active", drawerOpen && rosterTab === "settings");
  }

  function scrollToStage(target) {
    var header = document.querySelector(".app-header");
    var stickyHead = document.querySelector(".planner-sticky-head");
    var offset = (header ? header.offsetHeight : 0) + (stickyHead ? stickyHead.offsetHeight : 0) + 16;
    var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  function arcanaIconForStage(stage) {
    if (stage.id === "arcana-1") return (master.icons && master.icons.arcanaNum1) || "";
    if (stage.id === "arcana-2") return (master.icons && master.icons.arcanaNum2) || "";
    return "";
  }

  function getPhaseCompatIcons(stage) {
    var enemy = getSelectedEnemy(stage);
    var allowedTags = ["夜魂の加護", "月兆", "プネウマ", "ウーシア"];
    var result = [];
    (enemy.element || []).forEach(function (element) {
      var path = elementIconPath(element);
      if (path) result.push({ path: path, label: element });
    });
    (enemy.tags || []).forEach(function (tag) {
      if (allowedTags.indexOf(tag) === -1) return;
      var path = tagIconPath(tag);
      if (path) result.push({ path: path, label: tag });
    });
    return result;
  }

  function renderPhaseOverview() {
    var monthId = getCurrentMonth().id;
    var assignments = getMonthStore(state.assignments, monthId);
    dom.phaseOverviewList.innerHTML = "";
    getCurrentStages().forEach(function (stage, index) {
      var row = document.createElement("button");
      row.type = "button";
      row.className = "phase-overview-row" + (stage.id === selectedStageId ? " active" : "") + (stage.special ? " special" : "");

      var enemy = getSelectedEnemy(stage);

      // 左群: 敵アイコン・第◯幕・アルカナアイコン（左揃え）
      var leftGroup = document.createElement("span");
      leftGroup.className = "phase-overview-left";

      var enemyIcon = document.createElement("span");
      var stageIsHighlighted = STAGE_TYPE_BY_ID[stage.id] === "boss" || Boolean(stage.special);
      enemyIcon.className = "phase-overview-enemy" + (stageIsHighlighted ? " phase-overview-enemy-highlight" : "");
      if (enemy.image) {
        enemyIcon.classList.add("has-image");
        var enemyImg = document.createElement("img");
        enemyImg.src = enemy.image;
        enemyImg.alt = "";
        enemyIcon.appendChild(enemyImg);
      } else {
        enemyIcon.textContent = enemy.icon || "?";
      }
      leftGroup.appendChild(enemyIcon);

      var label = document.createElement("span");
      label.className = "phase-overview-label";
      label.textContent = stage.name;
      leftGroup.appendChild(label);

      var arcanaPath = arcanaIconForStage(stage);
      if (arcanaPath) {
        var arcanaIcon = document.createElement("img");
        arcanaIcon.className = "phase-overview-arcana-icon";
        arcanaIcon.src = arcanaPath;
        arcanaIcon.alt = "";
        leftGroup.appendChild(arcanaIcon);
      }
      row.appendChild(leftGroup);

      // 右群: 推奨元素/属性・キャラ枠（右寄せ）
      var rightGroup = document.createElement("span");
      rightGroup.className = "phase-overview-right";

      var compat = getPhaseCompatIcons(stage);
      if (compat.length) {
        var compatWrap = document.createElement("span");
        compatWrap.className = "phase-overview-compat";
        compat.forEach(function (item) {
          var chip = document.createElement("span");
          chip.className = "phase-compat-chip";
          chip.title = item.label;
          var img = document.createElement("img");
          img.src = item.path;
          img.alt = item.label;
          chip.appendChild(img);
          compatWrap.appendChild(chip);
        });
        rightGroup.appendChild(compatWrap);
      }

      var slots = document.createElement("span");
      slots.className = "phase-overview-slots";
      (assignments[stage.id] || []).forEach(function (characterId, slotIndex) {
        if (slotIndex > 0) {
          var sep = document.createElement("span");
          sep.className = "phase-overview-sep";
          sep.textContent = "-";
          slots.appendChild(sep);
        }
        var portrait = document.createElement("span");
        portrait.className = "portrait phase-overview-portrait";
        var character = characterId ? getCharacter(characterId) : null;
        if (character) {
          setPortrait(portrait, character);
        } else {
          portrait.classList.add("empty");
        }
        slots.appendChild(portrait);
      });
      rightGroup.appendChild(slots);
      row.appendChild(rightGroup);

      row.addEventListener("click", function () {
        selectedStageId = stage.id;
        drawerOpen = false;
        render();
        var target = dom.stageList.querySelector("[data-stage-id=\"" + stage.id + "\"]");
        if (target) scrollToStage(target);
      });

      dom.phaseOverviewList.appendChild(row);
    });
  }

  function renderSummary() {
    var flow = calculateFlowerFlow();
    var warnings = collectWarnings(flow);
    var buffLevels = flow.buffLevels;
    var buffs = getCurrentBuffs();
    var monthId = getCurrentMonth().id;
    var actions = getMonthStore(state.actions, monthId);
    var totalInvites = Object.values(actions).reduce(function (sum, action) {
      return sum + (action.invites || 0);
    }, 0);
    dom.inviteTotal.textContent = totalInvites;
    dom.finalFlower.textContent = flow.finalFlower;
    var tipHtml = renderTipHtml("buff", "バフとは？");
    dom.buffStatus.innerHTML = tipHtml + buffs.map(function (buff) {
      var iconPath = (master.icons && master.icons.reactions && master.icons.reactions[buff.name]) || "";
      var icon = iconPath ? "<img class=\"pill-icon\" src=\"" + escapeHtml(iconPath) + "\" alt=\"\">" : "";
      return "<span class=\"status-pill\">" + icon + escapeHtml(buff.name) + " Lv." + (buffLevels[buff.id] || 0) + "/" + flow.maxLevel + "</span>";
    }).join("");
    bindTipTriggers(dom.buffStatus);

    if (warnings.length) {
      dom.warnings.classList.add("show");
      dom.warnings.innerHTML = "<ul>" + warnings.map(function (warning) {
        return "<li>" + escapeHtml(warning) + "</li>";
      }).join("") + "</ul>";
    } else {
      dom.warnings.classList.remove("show");
      dom.warnings.innerHTML = "";
    }
  }

  /* ---------- calculations ---------- */

  function getCharacter(id) {
    return master.characters.find(function (character) { return character.id === id; }) || null;
  }

  function getVisibleTags(character, options) {
    options = options || {};
    var tags = character.tags || {};
    var result = [];
    (tags.positions || []).forEach(function (position) { result.push(position); });
    (tags.roles || []).forEach(function (role) { result.push(role); });
    if (tags.weapon) result.push(tags.weapon);
    if (tags.nightsoul) result.push("夜魂の加護");
    var pneumaOusia = Array.isArray(tags.pneumaOusia) ? tags.pneumaOusia : (tags.pneumaOusia ? [tags.pneumaOusia] : []);
    pneumaOusia.forEach(function (value) { result.push(value); });
    if (tags.lunar) result.push("月兆");
    if (tags.magic && getLevel(character) >= 70 && (options.ignoreMagicHidden || !state.magicHidden[character.id])) result.push("魔導");
    return result;
  }

  function shouldShowMagicToggle(character) {
    return Boolean(character.tags && character.tags.magic && getLevel(character) >= 70);
  }

  function calculateUsage() {
    var usage = {};
    var monthId = getCurrentMonth().id;
    var assignments = getMonthStore(state.assignments, monthId);
    getCurrentStages().forEach(function (stage) {
      assignments[stage.id].forEach(function (characterId) {
        if (characterId) usage[characterId] = (usage[characterId] || 0) + 1;
      });
    });
    return usage;
  }

  function computeInitialFlower() {
    var clamped = Math.max(ROSTER_MIN, Math.min(ROSTER_MAX, countRostered()));
    return 160 + (clamped - ROSTER_MIN) * 30;
  }

  function calculateFlowerFlow() {
    var flower = computeInitialFlower();
    var maxLevel = (master.rules && master.rules.buffMaxLevel) || 4;
    var buffLevels = {};
    var byStage = {};
    var buffs = getCurrentBuffs();
    var actions = getMonthStore(state.actions, getCurrentMonth().id);
    buffs.forEach(function (buff) { buffLevels[buff.id] = 0; });

    getCurrentStages().forEach(function (stage) {
      var action = actions[stage.id];
      var buffCount = buffs.reduce(function (sum, buff) {
        return sum + (action.buffs[buff.id] || 0);
      }, 0);
      var cost = (action.invites || 0) * master.rules.inviteCost + buffCount * master.rules.buffCost;
      var reward = getStageReward(stage);
      byStage[stage.id] = {
        before: flower,
        afterAction: flower - cost,
        afterReward: flower - cost + reward,
        buffLevelsAfter: {}
      };
      flower = flower - cost + reward;
      buffs.forEach(function (buff) {
        // 累積は非負の増分のみなので単調増加。表示・判定は最大レベルで頭打ちにする。
        buffLevels[buff.id] = Math.min(maxLevel, buffLevels[buff.id] + (action.buffs[buff.id] || 0));
        byStage[stage.id].buffLevelsAfter[buff.id] = buffLevels[buff.id];
      });
    });

    return { byStage: byStage, finalFlower: flower, buffLevels: buffLevels, maxLevel: maxLevel };
  }

  function collectWarnings(flow) {
    var warnings = [];
    var usage = calculateUsage();
    var totalInvites = 0;
    var lateInvites = 0;
    var stages = getCurrentStages();
    var monthId = getCurrentMonth().id;
    var actions = getMonthStore(state.actions, monthId);
    var assignments = getMonthStore(state.assignments, monthId);
    var buffs = getCurrentBuffs();
    var opening = getCurrentMonth().openingCast || [];

    stages.forEach(function (stage, index) {
      var action = actions[stage.id];
      totalInvites += action.invites || 0;
      if (index >= stages.length - 1) lateInvites += action.invites || 0;
      if (flow.byStage[stage.id].afterAction < 0) warnings.push(stage.name + "開始時の幻戯の花が足りません。");

      var seen = new Set();
      assignments[stage.id].forEach(function (characterId) {
        if (!characterId) return;
        var character = getCharacter(characterId);
        if (!character) {
          warnings.push(stage.name + "にマスター外のキャラがいます。");
          return;
        }
        if (seen.has(characterId)) warnings.push(stage.name + "で同じキャラが重複しています。");
        seen.add(characterId);
        if (!isUsableThisMonth(character)) {
          warnings.push(character.name + "は今月使用できません。");
        } else if (opening.indexOf(characterId) === -1 && !isRostered(character)) {
          warnings.push(stage.name + "に待機キャストとして選択されていないキャラがいます。");
        }
      });
    });

    Object.keys(usage).forEach(function (characterId) {
      if (usage[characterId] > master.rules.maxVitality) {
        var character = getCharacter(characterId);
        var locations = [];
        stages.forEach(function (stage) {
          if (assignments[stage.id].indexOf(characterId) !== -1) locations.push(stage.name);
        });
        warnings.push((character ? character.name : characterId) + "の活力（" + usage[characterId] + "/" + master.rules.maxVitality + "）を超えています。配置先：" + locations.join("・"));
      }
    });

    if (totalInvites < 8) warnings.push("キャラ招待が8回未満です。理論上、12フェーズ分の参加枠が不足します。");
    if (lateInvites > 0) warnings.push("最終フェーズでキャラ招待すると1回分しか使えないため非効率です。");
    if (flow.finalFlower < 0) warnings.push("最終的な幻戯の花がマイナスです。キャラ招待かバフ取得を前倒ししすぎています。");

    return warnings;
  }

  // 「開幕キャスト以外」を何人使うかから、必要なキャラ招待の累計回数を概算する（目安）。
  // 各幕をクリアするたびに仲間が1人増える前提（＝その幕の開始時点で index 人ぶん確保済み）。
  function calculateInviteGuide() {
    var stages = getCurrentStages();
    var monthId = getCurrentMonth().id;
    var assignments = getMonthStore(state.assignments, monthId);
    var actions = getMonthStore(state.actions, monthId);
    var opening = getCurrentMonth().openingCast || [];
    var seen = {};
    var distinct = 0;
    var cumulativeInvites = 0;
    var neededSoFar = 0;
    var byStage = {};

    stages.forEach(function (stage, index) {
      var debut = [];
      (assignments[stage.id] || []).forEach(function (characterId) {
        if (!characterId) return;
        var character = getCharacter(characterId);
        if (!character) return;
        if (opening.indexOf(characterId) !== -1) return; // 主人公も待機キャスト扱いなので招待の対象に含める
        if (!seen[characterId]) {
          seen[characterId] = true;
          distinct += 1;
          debut.push(character);
        }
      });
      cumulativeInvites += (actions[stage.id] && actions[stage.id].invites) || 0;
      // 後の幕ほど自動でもらえる仲間が増えるので単発の必要数は下がるが、
      // 「この幕までに済ませておくべき回数」は減らないので走行中の最大値を使う。
      neededSoFar = Math.max(neededSoFar, distinct - index);
      byStage[stage.id] = {
        debut: debut,
        needed: neededSoFar,
        current: cumulativeInvites,
        short: Math.max(0, neededSoFar - cumulativeInvites)
      };
    });
    return byStage;
  }

  function renderInviteGuide(container, guide) {
    container.innerHTML = "";
    if (!guide || (!guide.debut.length && guide.needed === 0)) {
      container.classList.add("hidden");
      return;
    }
    container.classList.remove("hidden");
    container.classList.toggle("short", guide.short > 0);

    if (guide.debut.length) {
      var debutLabel = document.createElement("span");
      debutLabel.className = "invite-guide-label";
      debutLabel.textContent = "この幕で初登場:";
      container.appendChild(debutLabel);
      guide.debut.forEach(function (character) {
        var portrait = document.createElement("span");
        portrait.className = "portrait invite-guide-portrait";
        portrait.title = character.name;
        setPortrait(portrait, character);
        container.appendChild(portrait);
      });
    }

    var summary = document.createElement("span");
    summary.className = "invite-guide-summary";
    summary.textContent = "招待の目安：累計" + guide.needed + "回（現在" + guide.current + "回）" +
      (guide.short > 0 ? " → あと" + guide.short + "回" : "");
    container.appendChild(summary);
    container.appendChild(document.createRange().createContextualFragment(renderTipHtml("inviteGuide", "招待の目安について")));
    bindTipTriggers(container);
  }

  function duplicatedInStage(stageId, characterId) {
    var assignments = getMonthStore(state.assignments, getCurrentMonth().id);
    return assignments[stageId].filter(function (id) { return id === characterId; }).length > 1;
  }

  /* ---------- helpers ---------- */

  // fixed 表示の吹き出しを、アンカーの下（入らなければ上）にビューポート内で収めて置く。
  function placeFixedInViewport(element, anchorRect, gap) {
    var margin = 8;
    var viewW = window.innerWidth || document.documentElement.clientWidth || 0;
    var viewH = window.innerHeight || document.documentElement.clientHeight || 0;
    var rect = element.getBoundingClientRect();
    var width = rect.width;
    var height = rect.height;
    var left = anchorRect.left;
    if (viewW > 0) {
      if (left + width > viewW - margin) left = viewW - margin - width;
      if (left < margin) left = margin;
    }
    var top = anchorRect.bottom + gap;
    if (viewH > 0 && top + height > viewH - margin) {
      var above = anchorRect.top - height - gap;
      top = above >= margin ? above : Math.max(margin, viewH - margin - height);
    }
    element.style.left = left + "px";
    element.style.top = top + "px";
  }

  function hexToRgba(hex, alpha) {
    var value = String(hex || "").replace("#", "");
    if (value.length !== 6) return "rgba(123,116,108," + alpha + ")";
    var r = parseInt(value.substring(0, 2), 16);
    var g = parseInt(value.substring(2, 4), 16);
    var b = parseInt(value.substring(4, 6), 16);
    return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
  }

  function applyElementColor(element, elementName) {
    var color = elementColor[elementName] || "#7b746c";
    element.style.setProperty("--elem", color);
    element.style.setProperty("--elem-soft", hexToRgba(color, 0.14));
    element.style.setProperty("--elem-mid", hexToRgba(color, 0.22));
  }

  function getGlossary() {
    return master.glossary || master.tips || {};
  }

  function renderTipHtml(key, label) {
    var text = getGlossary()[key];
    if (!text) return "";
    return "<button type=\"button\" class=\"tip-trigger\" data-tip=\"" + escapeHtml(text) + "\" aria-label=\"" + escapeHtml(label || "説明") + "\">ⓘ</button>";
  }

  function bindTipTriggers(root) {
    root.querySelectorAll(".tip-trigger").forEach(function (button) {
      if (button.dataset.tipBound) return;
      button.dataset.tipBound = "1";
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        var existing = document.querySelector(".tip-bubble");
        if (existing) existing.remove();
        var bubble = document.createElement("div");
        bubble.className = "tip-bubble";
        bubble.textContent = button.dataset.tip;
        // 先に左上へ置いて自然な幅を測ってからクランプする（右端で潰れて縦長になるのを防ぐ）
        bubble.style.left = "0px";
        bubble.style.top = "0px";
        document.body.appendChild(bubble);
        placeFixedInViewport(bubble, button.getBoundingClientRect(), 6);
        var closeOnOutside = function (e) {
          if (!bubble.contains(e.target) && e.target !== button) {
            bubble.remove();
            document.removeEventListener("click", closeOnOutside);
          }
        };
        setTimeout(function () { document.addEventListener("click", closeOnOutside); }, 0);
      });
    });
  }

  var toastTimer = null;
  function toast(message) {
    var existing = document.querySelector(".toast");
    if (existing) existing.remove();
    var element = document.createElement("div");
    element.className = "toast";
    element.textContent = message;
    document.body.appendChild(element);
    requestAnimationFrame(function () { element.classList.add("show"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      element.classList.remove("show");
      setTimeout(function () { element.remove(); }, 300);
    }, 1800);
  }

  function buildElemBadge(character, className) {
    var badge = document.createElement("span");
    badge.className = "elem-badge" + (className ? " " + className : "");
    var iconPath = elementIconPath(character.element);
    if (iconPath) {
      var img = document.createElement("img");
      img.src = iconPath;
      img.alt = character.element || "";
      badge.appendChild(img);
    } else {
      badge.classList.add("elem-badge-fallback");
      badge.textContent = (character.element || "?").slice(0, 1);
    }
    return badge;
  }

  function makeTagIconBadge(tag, label) {
    var span = document.createElement("span");
    span.className = "modal-tag-icon";
    span.title = label;
    var path = tagIconPath(tag);
    if (path) {
      var img = document.createElement("img");
      img.src = path;
      img.alt = label;
      span.appendChild(img);
    } else {
      span.classList.add("modal-tag-icon-text");
      span.textContent = label;
    }
    return span;
  }

  function buildModalTileBadges(character) {
    var row = document.createElement("span");
    row.className = "modal-tile-badges";
    var tags = character.tags || {};

    // 位置（オン/オフ）
    var posGroup = document.createElement("span");
    posGroup.className = "modal-tile-badge-group";
    (tags.positions || []).forEach(function (position) {
      posGroup.appendChild(makeTagIconBadge(position, position === "オンフィールド" ? "オン" : "オフ"));
    });
    if (posGroup.children.length) row.appendChild(posGroup);

    // 役割（先頭1つ）
    var roleGroup = document.createElement("span");
    roleGroup.className = "modal-tile-badge-group";
    (tags.roles || []).slice(0, 1).forEach(function (role) {
      roleGroup.appendChild(makeTagIconBadge(role, role));
    });
    if (roleGroup.children.length) row.appendChild(roleGroup);

    // その他（夜魂/月兆/魔導/プネウマ/ウーシア）
    var otherGroup = document.createElement("span");
    otherGroup.className = "modal-tile-badge-group";
    if (tags.nightsoul) otherGroup.appendChild(makeTagIconBadge("夜魂の加護", "夜魂の加護"));
    if (tags.lunar) otherGroup.appendChild(makeTagIconBadge("月兆", "月兆"));
    if (tags.magic && getLevel(character) >= 70) otherGroup.appendChild(makeTagIconBadge("魔導", "魔導"));
    var pneumaOusia = Array.isArray(tags.pneumaOusia) ? tags.pneumaOusia : (tags.pneumaOusia ? [tags.pneumaOusia] : []);
    pneumaOusia.forEach(function (value) { otherGroup.appendChild(makeTagIconBadge(value, value)); });
    if (otherGroup.children.length) row.appendChild(otherGroup);

    return row;
  }

  function setPortrait(container, character) {
    container.innerHTML = "";
    if (character.image) {
      var image = document.createElement("img");
      image.src = character.image;
      image.alt = "";
      container.appendChild(image);
      return;
    }
    container.style.background = elementColor[character.element] || "#7b746c";
    container.style.color = "#fff";
    container.textContent = (character.name || "?").slice(0, 1);
  }

  function setElementIcon(container, elementName) {
    container.innerHTML = "";
    container.style.background = "";
    var iconPath = master.icons && master.icons.elements && master.icons.elements[elementName];
    if (iconPath) {
      var image = document.createElement("img");
      image.src = iconPath;
      image.alt = elementName || "";
      container.appendChild(image);
      return;
    }
    container.style.background = elementColor[elementName] || "#7b746c";
    container.style.color = "#fff";
    container.textContent = elementName || "";
  }

  function tagIconPath(tag) {
    var icons = master.icons || {};
    if (icons.positions && icons.positions[tag]) return icons.positions[tag];
    if (icons.roles && icons.roles[tag]) return icons.roles[tag];
    if (tag === "夜魂の加護" && icons.nightsoul) return icons.nightsoul;
    if (tag === "月兆" && icons.lunar) return icons.lunar;
    if (tag === "魔導" && icons.magic) return icons.magic;
    if (tag === "プネウマ" && icons.pneuma) return icons.pneuma;
    if (tag === "ウーシア" && icons.ousia) return icons.ousia;
    return "";
  }

  function elementIconPath(elementName) {
    var icons = master.icons || {};
    return (icons.elements && icons.elements[elementName]) || "";
  }

  function exportPlan() {
    var blob = new Blob([JSON.stringify({ masterVersion: master.version, state: state }, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "gengeki-plan.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function importPlan(event) {
    var file = event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        state = Object.assign(createDefaultState(), data.state || data);
        state.settings = Object.assign({ showOwnership: true }, (data.state || data).settings || {});
        selectedCharacterId = null;
        ensureStateShape();
        selectedStageId = getCurrentStages()[0].id;
        render();
      } catch (error) {
        alert("読み込みに失敗しました。JSONファイルを確認してください。");
      }
      dom.importPlanInput.value = "";
    };
    reader.readAsText(file);
  }

  var armedResetButton = null;
  var armedResetTimer = null;

  function disarmResetButtons() {
    clearTimeout(armedResetTimer);
    if (armedResetButton) {
      armedResetButton.textContent = armedResetButton.dataset.label;
      armedResetButton.classList.remove("armed");
      armedResetButton = null;
    }
  }

  function bindScopedReset(button, scope) {
    if (!button) return;
    button.addEventListener("click", function () {
      if (armedResetButton === button) {
        disarmResetButtons();
        applyScopedReset(scope);
        return;
      }
      disarmResetButtons();
      armedResetButton = button;
      button.textContent = "実行（もう一度押すと確定）";
      button.classList.add("armed");
      armedResetTimer = setTimeout(disarmResetButtons, 3500);
    });
  }

  function applyScopedReset(scope) {
    var monthId = getCurrentMonth().id;
    lastStateBeforeReset = JSON.parse(JSON.stringify(state));
    if (scope === "assignments" || scope === "both") {
      state.assignments[monthId] = {};
    }
    if (scope === "actions" || scope === "both") {
      state.actions[monthId] = {};
    }
    dom.undoResetButton.classList.remove("hidden");
    selectedCharacterId = null;
    ensureStateShape();
    render();
    var label = scope === "assignments" ? "配置状況" : (scope === "actions" ? "シャイニングブレス・キャラ招待" : "配置状況とシャイニングブレス・キャラ招待");
    toast("今月の" + label + "を初期化しました");
  }

  function undoReset() {
    if (!lastStateBeforeReset) return;
    state = lastStateBeforeReset;
    lastStateBeforeReset = null;
    dom.undoResetButton.classList.add("hidden");
    selectedCharacterId = null;
    ensureStateShape();
    selectedStageId = getCurrentStages()[0].id;
    render();
    toast("初期化前の状態に戻しました");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" })[char];
    });
  }
})();
