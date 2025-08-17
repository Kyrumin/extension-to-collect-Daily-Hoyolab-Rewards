document.addEventListener("DOMContentLoaded", async () => {
  const checkboxes = {
    genshin: document.getElementById("genshin"),
    starrail: document.getElementById("starrail"),
    honkai3: document.getElementById("honkai3"),
    tot: document.getElementById("tot"),
    zzz: document.getElementById("zzz"),
  };

  const saveBtn = document.getElementById("save");


  chrome.storage.local.get("games", (data) => {
    if (data.games) {
      Object.entries(checkboxes).forEach(([key, el]) => {
        el.checked = data.games[key] || false;
      });
    }
  });

  saveBtn.addEventListener("click", () => {
    const selected = {};
    Object.entries(checkboxes).forEach(([key, el]) => {
      selected[key] = el.checked;
    });
    chrome.storage.local.set({ games: selected }, () => {

      saveBtn.textContent = "Saved";
      saveBtn.classList.add("saved");

      setTimeout(() => {
        saveBtn.textContent = "Save";
        saveBtn.classList.remove("saved");
      }, 2000);
    });
  });
});
