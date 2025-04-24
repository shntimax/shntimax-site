document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".stories-container");
  const track = document.querySelector(".stories-track");
  const items = document.querySelectorAll(".story-item");

  if (!container || !track || items.length === 0) {
    console.error("Container, track, or items not found!");
    return;
  }

  // Clone items for infinite looping
  const itemCount = items.length;
  for (let i = 0; i < itemCount * 2; i++) {
    const clone = items[i % itemCount].cloneNode(true);
    track.appendChild(clone);
  }

  // Set up infinite looping with trackpad control
  const totalHeight = track.scrollHeight / 3; // Height of original items
  let currentY = 0;

  // Update positions and scaling for all items
  const updateItems = () => {
    const allItems = document.querySelectorAll(".story-item");
    const viewportHeight = container.clientHeight;

    allItems.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.top + itemRect.height / 2 - container.getBoundingClientRect().top;

      // Calculate position relative to viewport center (0 = center, 1 = top/bottom)
      const distanceFromCenter = Math.abs(itemCenter - viewportHeight / 2) / (viewportHeight / 2);
      const scale = 1 + (0.3 * (1 - distanceFromCenter)); // Scale from 1 to 1.3

      // Create a curved path (parabolic motion)
      const curveOffset = 50 * (1 - distanceFromCenter * distanceFromCenter); // Parabolic curve

      gsap.set(item, {
        scale: scale,
        x: curveOffset, // Apply horizontal offset for curved motion
      });
    });
  };

  // Handle trackpad scrolling
  container.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY * 0.5; // Adjust scroll speed
    currentY -= delta;

    // Seamless infinite loop
    if (currentY <= -totalHeight) {
      currentY += totalHeight; // Wrap to top
    } else if (currentY >= 0) {
      currentY -= totalHeight; // Wrap to bottom
    }

    gsap.set(track, { y: currentY });
    updateItems(); // Update scaling and position on scroll
  });

  // Initial update
  updateItems();
});