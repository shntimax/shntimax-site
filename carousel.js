document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const items = track.querySelectorAll(".story-item");
  const itemCount = items.length;

  // Clone items for seamless looping
  for (let i = 0; i < itemCount; i++) {
    const clone = items[i].cloneNode(true);
    track.appendChild(clone);
  }

  // Set track width to accommodate original + cloned items
  const itemWidth = 250 + 20; // 250px width + 20px gap
  track.style.width = `${itemWidth * itemCount * 2}px`;
});