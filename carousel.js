window.addEventListener("load", () => {
  const container = document.querySelector(".stories-container");
  const track = document.querySelector(".stories-track");
  const items = document.querySelectorAll(".story-item");

  if (!container || !track || items.length === 0) {
    console.error("Container, track, or items not found!");
    return;
  }

  // Clone items for infinite looping
  const itemCount = items.length;
  const originalItems = Array.from(items);
  const itemHeights = originalItems.map(item => item.getBoundingClientRect().height + 20); // 20px gap
  const totalHeight = itemHeights.reduce((sum, height) => sum + height, 0);
  for (let i = 0; i < itemCount * 2; i++) {
    const clone = originalItems[i % itemCount].cloneNode(true);
    track.appendChild(clone);
  }

  // Set up continuous scrolling with trackpad control
  let currentY = 0;
  const viewportHeight = container.clientHeight;

  // Update positions, scaling, and curved motion for all items
  const updateItems = () => {
    const allItems = document.querySelectorAll(".story-item");
    let topmostItemIndex = -1;
    let bottommostItemIndex = -1;
    let topmostPosition = Infinity;
    let bottommostPosition = -Infinity;

    // Find the topmost and bottommost items
    allItems.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const itemTop = itemRect.top - container.getBoundingClientRect().top;

      if (itemTop < topmostPosition) {
        topmostPosition = itemTop;
        topmostItemIndex = index;
      }
      if (itemTop + itemRect.height > bottommostPosition) {
        bottommostPosition = itemTop + itemRect.height;
        bottommostItemIndex = index;
      }

      // Calculate position relative to viewport center (0 = center, 1 = top/bottom)
      const itemCenter = itemTop + itemRect.height / 2;
      const distanceFromCenter = Math.abs(itemCenter - viewportHeight / 2) / (viewportHeight / 2);
      const scale = 1 + (0.3 * (1 - distanceFromCenter)); // Scale from 1 to 1.3
      const curveOffset = 50 * (1 - distanceFromCenter * distanceFromCenter); // Parabolic curve

      // Smoothly animate the x position and scale
      gsap.to(item, {
        scale: scale,
        x: curveOffset,
        duration: 0.3,
        ease: "power1.out",
        overwrite: true,
      });
    });

    // Reposition items for seamless looping
    if (topmostPosition > -viewportHeight && topmostItemIndex >= itemCount) {
      // Move the topmost clone to the bottom
      const item = allItems[topmostItemIndex];
      currentY -= totalHeight;
      gsap.set(track, { y: currentY });
    } else if (bottommostPosition < viewportHeight * 2 && bottommostItemIndex < itemCount) {
      // Move the bottommost original to the top
      const item = allItems[bottommostItemIndex];
      currentY += totalHeight;
      gsap.set(track, { y: currentY });
    }
  };

  // Handle trackpad scrolling
  container.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY * 0.5; // Adjust scroll speed
    currentY -= delta;

    // Update track position smoothly
    gsap.to(track, {
      y: currentY,
      duration: 0.3,
      ease: "power1.out",
      overwrite: true,
    });

    updateItems(); // Update scaling, position, and loop on scroll
  });

  // Initial update
  updateItems();
});