window.addEventListener("load", () => {
  const container = document.querySelector(".stories-container");
  const previousItem = document.querySelector(".story-previous");
  const currentItem = document.querySelector(".story-current");
  const nextItem = document.querySelector(".story-next");

  if (!container || !previousItem || !currentItem || !nextItem) {
    console.error("Container or story items not found!", {
      container: !!container,
      previousItem: !!previousItem,
      currentItem: !!currentItem,
      nextItem: !!nextItem,
    });
    return;
  }

  // "Database" of stories with your photos
  const stories = [
    { href: "/blog/story1/", img: "/assets/story1.jpg", text: "A peaceful sunset..." },
    { href: "/blog/story2/", img: "/assets/story2.jpg", text: "A quiet morning..." },
    { href: "/blog/story3/", img: "/assets/story3.jpg", text: "A starry night..." },
    { href: "/blog/story4/", img: "/assets/story4.jpg", text: "A calm ocean..." },
  ];

  let currentIndex = 0;
  const totalStories = stories.length;

  // Function to update story content and positions
  const updateStories = () => {
    const containerHeight = container.clientHeight;
    const itemHeight = currentItem.getBoundingClientRect().height;

    // Calculate indices for previous and next stories
    const previousIndex = (currentIndex - 1 + totalStories) % totalStories;
    const nextIndex = (currentIndex + 1) % totalStories;

    // Update content
    previousItem.href = stories[previousIndex].href;
    previousItem.querySelector("img").src = stories[previousIndex].img;
    previousItem.querySelector("p").textContent = stories[previousIndex].text;

    currentItem.href = stories[currentIndex].href;
    currentItem.querySelector("img").src = stories[currentIndex].img;
    currentItem.querySelector("p").textContent = stories[currentIndex].text;

    nextItem.href = stories[nextIndex].href;
    nextItem.querySelector("img").src = stories[nextIndex].img;
    nextItem.querySelector("p").textContent = stories[nextIndex].text;

    // Calculate pixel-based positions
    const centerY = 0; // Center of the container
    const previousY = -containerHeight / 2 + itemHeight / 2; // Show only bottom corner
    const nextY = containerHeight / 2 - itemHeight / 2; // Show only top corner

    // Animate positions and scaling
    gsap.to(previousItem, {
      y: previousY,
      scale: 0.7,
      duration: 0.5,
      ease: "power1.out",
      onComplete: () => console.log("Previous item positioned at y:", previousY),
    });

    gsap.to(currentItem, {
      y: centerY,
      scale: 1.2,
      duration: 0.5,
      ease: "power1.out",
      onComplete: () => console.log("Current item positioned at y:", centerY),
    });

    gsap.to(nextItem, {
      y: nextY,
      scale: 0.7,
      duration: 0.5,
      ease: "power1.out",
      onComplete: () => console.log("Next item positioned at y:", nextY),
    });
  };

  // Handle trackpad scrolling
  container.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY;

    if (delta > 0) {
      // Scroll down, move to next story
      currentIndex = (currentIndex + 1) % totalStories;
    } else if (delta < 0) {
      // Scroll up, move to previous story
      currentIndex = (currentIndex - 1 + totalStories) % totalStories;
    }

    updateStories();
  });

  // Initial update
  updateStories();
});