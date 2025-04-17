document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const items = track.querySelectorAll(".story-item");
  const itemCount = items.length;

  // Clone items for seamless looping (double the items)
  for (let i = 0; i < itemCount; i++) {
    const clone = items[i].cloneNode(true);
    track.appendChild(clone);
  }

  // Ensure the track width is set dynamically
  track.style.width = `${itemCount * 250 * 2}px`; // 250px per item, doubled for clones
});