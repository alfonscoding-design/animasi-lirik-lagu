// V1 original visual system + manual START/END timeline.
// Edit only the start/end values below if you want to retime the lyrics.
const lyrics = [
  { start: "00:00.00", end: "00:03.00", text: "You know it's true...  •́⁠ ⁠ ⁠‿⁠ ⁠,⁠•̀" },
  { start: "00:03.00", end: "00:07.00", text: "So, what if I call?ツ" },
  { start: "00:07.00", end: "00:13.00", text: "And you pick up the phone?" },
  { start: "00:13.00", end: "00:20.00", text: "And I use this holiday to make my way to your ghost" },
  { start: "00:21.00", end: "00:25.00", text: "But, what if you're lonely?" },
  { start: "00:25.00", end: "00:29.00", text: "And you know I am too?" },
  { start: "00:29.00", end: "00:33.00", text: "And I get the chance to say" },
  { start: "00:33.00", end: "00:39.00", text: "\"I wish I didn't, but I miss you⁠♡\"" },
  { start: "00:40.00", end: "00:45.00", text: "i miss you....♡" }
];

function timeToSeconds(value) {
  const [minutes, seconds] = value.split(":");
  return Number(minutes) * 60 + Number(seconds);
}

const timeline = lyrics.map((item) => ({
  ...item,
  startSeconds: timeToSeconds(item.start),
  endSeconds: timeToSeconds(item.end)
}));
