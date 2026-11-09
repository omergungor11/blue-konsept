(() => {


// Initialize the counter and loader duration variables
let counter = {
  value: 0
};
let loaderDuration = 9;

// Check if this is not the first time the user has visited this page
if (sessionStorage.getItem("visited") !== null) {
  // If so, set the loader duration to 2 seconds and the counter value to 75
  loaderDuration = 9;
  counter = {
    value: 75
  };
}

// Set the visited item in the session storage to "true"
sessionStorage.setItem("visited", "true");

// Define a function to update the loader text
function updateLoaderText() {
  let progress = Math.round(counter.value);
  $(".loader5_number").text(progress);
}

// Define a function to end the loader animation
function endLoaderAnimation() {
  $(".loader5_ix-trigger").click();
}

// Create a timeline animation using the GreenSock Animation Platform (GSAP)
let tl = gsap.timeline({
  onComplete: endLoaderAnimation
});

// Animate the counter value from 0 to 100 with the defined custom ease animation
tl.to(counter, {
  value: 100,
  onUpdate: updateLoaderText,
  duration: loaderDuration,
  ease: "easeInOut"
});

// Animate the width of the loader progress bar to 100% with the defined custom ease animation
tl.to(".loader5_progress-bar", {
    width: "100%",
    duration: loaderDuration,
    ease: "easeInOut"
}, 0);


})();
(() => {

document.addEventListener('DOMContentLoaded', function() {
// Function to check if the viewport width is 767px or less
function isMobile() {
  return window.innerWidth <= 767;
}

// Split text into individual words
const layoutText = new SplitType(".layout484_text", { types: "words" });
const layoutTL = gsap.timeline();

// Define different start and end values for mobile devices
let startValue = isMobile() ? "top 35%" : "top center";
let endValue = isMobile() ? "bottom 60%" : "bottom center";

layoutTL.from(layoutText.words,{
  // Initial opacity for each word
  opacity: 0.25,
  // Stagger animation of each word
  stagger: 0.1,
  scrollTrigger: { 
    trigger: ".section_layout484",
    // Trigger animation when .section_layout484 reaches certain part of the viewport
    start: startValue,
    // End animation when .section_layout484 reaches certain part of the viewport
    end: endValue,
    // Smooth transition based on scroll position
    scrub: 2 
  }
});
});

})();
(() => {

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll('.layout410_card');
  const stackedDistance = 32; // 32px = 2rem
  const maxOffsetRem = (cards.length - 1) * 2; 

  function resetMobileCards() {
    cards.forEach(card => {
      card.style.position = '';
      card.style.top = '';
      card.style.zIndex = '';
      card.style.marginBottom = '';
      card.style.transform = '';
      card.style.filter = '';
    });
  }

  function setupDesktopCards() {
    if (window.innerWidth >= 768) {
      cards.forEach((card, index) => {
        card.style.position = 'sticky';
        card.style.top = `calc(15vh + ${index * 2}rem)`;
        card.style.zIndex = index;
        
        const marginBottom = maxOffsetRem - (index * 2);
        card.style.marginBottom = `${marginBottom}rem`;
      });
      animateCardsOnScroll();
    } else {
      resetMobileCards();
    }
  }

  function animateCardsOnScroll() {
    if (window.innerWidth < 768) return;

    const overlaps = [];
    const maxDistance = window.innerHeight * 0.8; 

    for (let i = 0; i < cards.length - 1; i++) {
      const card = cards[i];
      const nextCard = cards[i + 1];
      const cardRect = card.getBoundingClientRect();
      const nextRect = nextCard.getBoundingClientRect();
      
      const distance = nextRect.top - cardRect.top;

      let progress = 1 - ((distance - stackedDistance) / (maxDistance - stackedDistance));
      progress = Math.max(0, Math.min(1, progress));
      overlaps.push(progress);
    }

    cards.forEach((card, i) => {
      if (i === cards.length - 1) {
        card.style.transform = `scale(1)`;
        card.style.filter = `brightness(1)`;
        return; 
      }

      let totalWeight = 0;
      for (let j = i; j < overlaps.length; j++) {
        totalWeight += overlaps[j];
      }

      const scaleReductionPerLayer = 0.04; 
      const brightnessReductionPerLayer = 0.15; 

      const scale = 1 - (totalWeight * scaleReductionPerLayer);
      const brightness = 1 - (totalWeight * brightnessReductionPerLayer);

      card.style.transform = `scale(${scale})`;
      card.style.filter = `brightness(${brightness})`;
    });
  }

  window.addEventListener('scroll', animateCardsOnScroll, { passive: true });
  window.addEventListener('resize', setupDesktopCards);

  setupDesktopCards(); 
});

})();
