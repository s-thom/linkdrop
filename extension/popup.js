async function loadFrame() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const params = new URLSearchParams({
    url: tab.url,
    description: tab.title,
  });

  const frame = document.createElement("iframe");
  frame.src = `https://linkdrop.sthom.kiwi/links/new?${params.toString()}`;

  document.querySelector("#frame-container").appendChild(frame);
}

loadFrame();
