import type { SoundType } from "../../types/types";

export default class SoundManager {
  private enabled: boolean = true;
  private sounds: Map<SoundType, string> = new Map([
    ["flip", "🔄"],
    ["match", "✨"],
    ["mismatch", "❌"],
    ["win", "🎉"],
    ["lose", "😞"],
    ["streak", "🔥"],
  ]);

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  play(type: SoundType) {
    if (!this.enabled) return;

    const emoji = this.sounds.get(type) || "🔊";
    this.showSoundFeedback(emoji);
  }

  private showSoundFeedback(emoji: string) {
    const feedback = document.createElement("div");
    feedback.textContent = emoji;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        font-size: 24px;
        z-index: 1000;
        animation: soundFeedback 1s ease-out forwards;
        pointer-events: none;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => {
      if (document.body.contains(feedback)) {
        document.body.removeChild(feedback);
      }
    }, 1000);
  }
}
