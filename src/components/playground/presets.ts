export interface PlaygroundPreset {
  html: string;
  css: string;
  js: string;
}

export const PRESETS: Record<string, PlaygroundPreset> = {
  "spacing-hierarchy": {
    html: `<div class="card">
  <h2>Plan your trip</h2>
  <p>Pick a destination, dates, and we'll handle the rest.</p>
  <button>Get started</button>
</div>`,
    css: `.card {
  max-width: 320px;
  margin: 24px auto;
  padding: 8px;
  border: 1px solid #ddd;
  font-family: system-ui, sans-serif;
}
h2 {
  font-size: 15px;
  margin: 0;
}
p {
  font-size: 14px;
  color: #444;
  margin: 0;
}
button {
  margin-top: 4px;
  padding: 4px 8px;
  font-size: 13px;
}`,
    js: "",
  },
  "color-contrast": {
    html: `<div class="banner">
  <strong>Heads up:</strong> your session expires in 5 minutes.
</div>
<button class="cta">Renew session</button>`,
    css: `body { padding: 24px; }
.banner {
  background: #fff8e1;
  color: #b8860b;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
}
.cta {
  background: #e0d4ff;
  color: #cfc4e8;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}`,
    js: "",
  },
  "chart-basics": {
    html: `<div class="chart">
  <div class="bar" style="height: 40%"><span>Mon</span></div>
  <div class="bar" style="height: 70%"><span>Tue</span></div>
  <div class="bar" style="height: 55%"><span>Wed</span></div>
  <div class="bar" style="height: 90%"><span>Thu</span></div>
  <div class="bar" style="height: 30%"><span>Fri</span></div>
</div>`,
    css: `body { padding: 24px; }
.chart {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 180px;
}
.bar {
  flex: 1;
  background: red;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-family: system-ui, sans-serif;
  border-radius: 4px 4px 0 0;
}
.bar span { margin-bottom: 4px; }`,
    js: "",
  },
};
