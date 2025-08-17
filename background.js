const urlDict = {
  genshin: 'https://sg-hk4e-api.hoyolab.com/event/sol/sign?lang=en-us&act_id=e202102251931481',
  starrail: 'https://sg-public-api.hoyolab.com/event/luna/os/sign?lang=en-us&act_id=e202303301540311',
  honkai3: 'https://sg-public-api.hoyolab.com/event/mani/sign?lang=en-us&act_id=e202110291205111',
  tot: 'https://sg-public-api.hoyolab.com/event/luna/os/sign?lang=en-us&act_id=e202308141137581',
  zzz: 'https://sg-public-api.hoyolab.com/event/luna/zzz/os/sign?lang=en-us&act_id=e202406031448091'
};

const headerDefault = {
  'Accept': 'application/json, text/plain, */*',
  'x-rpc-app_version': '2.34.1',
  'User-Agent': 'Mozilla/5.0',
  'x-rpc-client_type': '4',
  'Referer': 'https://act.hoyolab.com/',
  'Origin': 'https://act.hoyolab.com'
};

async function getCookies() {
  const [ltoken, ltuid] = await Promise.all([
    chrome.cookies.get({ url: "https://www.hoyolab.com", name: "ltoken_v2" }),
    chrome.cookies.get({ url: "https://www.hoyolab.com", name: "ltuid_v2" })
  ]);
  if (!ltoken || !ltuid) return null;
  return `ltoken_v2=${ltoken.value}; ltuid_v2=${ltuid.value};`;
}

async function doCheckIn() {
  const token = await getCookies();
  if (!token) return;

  chrome.storage.local.get("games", async (data) => {
    const games = data.games || {};
    for (const [key, url] of Object.entries(urlDict)) {
      if (!games[key]) continue;

      let headers = { ...headerDefault, Cookie: token };
      if (key === "zzz") headers["x-rpc-signgame"] = "zzz";

      try {
        let resp = await fetch(url, { method: "POST", headers });
        let json = await resp.json();
        console.log(`[${key}]`, json.message);
      } catch (e) {
        console.error(`[${key}] Error`, e);
      }
    }
  });
}

// каждый день в 9:00 утра
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("dailyCheckin", { when: Date.now(), periodInMinutes: 60 * 24 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "dailyCheckin") doCheckIn();
});
