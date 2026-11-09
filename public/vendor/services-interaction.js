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
