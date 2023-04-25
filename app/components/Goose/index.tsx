import { useCallback, useRef } from "react";

import styles from "./Goose.module.css";
import goose from "./goose.png";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

const TOOLTIP_TIMEOUT = 3000;
const TRANSITION_DURATION = 200;
const SCALE_SCALE = 100;
const HEARTS = ["❤️", "🧡", "💛", "💚", "💙", "💜"];
const NOTES = ["🎵", "🎶", "🎼"];

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function createHeart(index: number, count: number) {
  const heart = document.createElement("div");
  heart.classList.add("goose-heart");
  heart.textContent = HEARTS[index]!;
  heart.ariaHidden = "true";

  const translateX = Math.floor(Math.random() * 100);
  const translateY = Math.floor(Math.random() * 10);
  heart.style.left = `${translateX}%`;
  heart.style.transform = `translateX(-${translateX}%) translateY(${translateY}px) scale(${
    (count + SCALE_SCALE) / SCALE_SCALE
  })`;

  return heart;
}

function createNote(index: number, count: number) {
  const heart = document.createElement("a");
  heart.href = "https://goose.sthom.kiwi";
  heart.rel = "external";
  heart.dataset.umamiEvent = "goose-note";
  heart.textContent = NOTES[index]!;
  heart.ariaHidden = "true";

  const translateX = Math.floor(Math.random() * 100);
  const translateY = Math.floor(Math.random() * 10);
  heart.style.left = `${translateX}%`;
  heart.style.transform = `translateX(-${translateX}%) translateY(${translateY}px) scale(${
    (count + SCALE_SCALE) / SCALE_SCALE
  })`;

  return heart;
}

export function Goose() {
  const ref = useRef<HTMLButtonElement>(null);
  const settingsRef = useRef({ current: 0, count: 0 });

  const onClick = useCallback(async () => {
    const parent = ref.current;
    const settings = settingsRef.current;
    if (!parent) {
      return;
    }

    // The hearts are looped over backwards. Why didn't I just reverse the array?
    // ¯\_(ツ)_/¯
    settings.current = (settings.current - 1 + HEARTS.length) % HEARTS.length;
    // eslint-disable-next-line no-plusplus
    settings.count++;

    let child: Element;
    if (settings.count % 10 === 0) {
      child = createNote(settings.count % NOTES.length, settings.count);
    } else {
      child = createHeart(settings.current, settings.count);
    }

    parent.appendChild(child);

    await delay(TOOLTIP_TIMEOUT);
    child.classList.add("goose-heart-exit");

    await delay(TRANSITION_DURATION);
    parent.removeChild(child);
  }, []);

  return (
    <button
      id="goose"
      className="goose-button"
      aria-label="Goose"
      onClick={onClick}
      ref={ref}
      data-umami-event="goose"
    >
      <img src={goose} alt="" width={48} height={48} />
    </button>
  );
}
