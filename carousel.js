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

  // Pre-position items to avoid jumps
  const prePositionItems = () => {
    const allItems = document.querySelectorAll(".story-item");
    allItems.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.top + itemRect.height / 2 - container.getBoundingClientRect().top;
      const viewportHeight = container.clientHeight;

      // Calculate position relative to viewport center
      const distanceFromCenter = Math.abs(itemCenter - viewportHeight / 2) / (viewportHeight / 2);
      const curveOffset = 50 * (1 - distanceFromCenter * distanceFromCenter);

      // Set initial position
      gsap.set(item, { x: curveOffset });
    });
  };

  // Update positions and scaling for all items
  const updateItems = () => {
    const allItems = document.querySelectorAll(".story-item");
    const viewportHeight = container.clientHeight;

    allItems.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.top + itemRect.height / 2 - container.getBoundingClientRect().top;

      // Calculate position relative to viewport center (0 = center, 1 = top/bottom)
      const distanceFromCenter = Math.abs(itemCenter - viewportHeight / 2) / (viewportHeight / 2);
      const scale = 1 + (0.3 * (1 - distanceFromCenter)); // Scale from 1 to 1.3
      const curveOffset = 50 * (1 - distanceFromCenter * distanceFromCenter); // Parabolic curve

      // Smoothly animate the x position and scale
      gsap.to(item, {
        scale: scale,
        x: curveOffset,
        duration: 0.3,
        ease: "power1.out",
      });
    });
  };

  // Handle trackpad scrolling
  container.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY * 0.5; // Adjust scroll speed
    const previousY = currentY;
    currentY -= delta;

    // Seamless infinite loop
    const threshold = totalHeight * 0.5;
    if (currentY <= -totalHeight - threshold) {
      currentY += totalHeight; // Wrap to top
      gsap.set(track, { y: currentY });
      prePositionItems(); // Pre-position items to avoid jumps
    } else if (currentY >= threshold) {
      currentY -= totalHeight; // Wrap to bottom
      gsap.set(track, { y: currentY });
      prePositionItems(); // Pre-position items to avoid jumps
    }

    gsap.to(track, {
      y: currentY,
      duration: 0.3,
      ease: "power1.out",
    });
    updateItems(); // Update scaling and position on scroll
  });

  // Initial setup
  prePositionItems();
  updateItems();
});