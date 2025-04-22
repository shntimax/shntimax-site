document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const items = track.querySelectorAll(".story-item");
  const itemCount = items.length;

  // Clone items for seamless looping
  for (let i = 0; i < itemCount; i++) {
    const clone = items[i].cloneNode(true);
    track.appendChild(clone);
  }

  // Set track width
  const itemWidth = 250 + 20; // 250px width + 20px gap
  const totalWidth = itemWidth * itemCount;
  track.style.width = `${totalWidth * 2}px`;

  // Handle mouse wheel scrolling
  let scrollPosition = 0;
  track.parentElement.addEventListener("wheel", (e) => {
    e.preventDefault();
    const maxScroll = -totalWidth; // Max scroll distance (negative)
    scrollPosition -= e.deltaY; // Scroll based on wheel movement

    // Seamless looping
    if (scrollPosition <= maxScroll) scrollPosition = 0;
    if (scrollPosition >= 0) scrollPosition = maxScroll;

    track.style.transform = `translateX(${scrollPosition}px)`;
  });
});