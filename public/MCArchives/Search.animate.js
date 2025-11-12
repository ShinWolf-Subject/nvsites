const animatedSearchWrapper = document.getElementById('animatedSearchWrapper');
const animatedSearchBtn = document.getElementById('animatedSearchBtn');
const searchInput = document.getElementById('searchInput');

animatedSearchBtn.addEventListener('click', (e) => {
   e.stopPropagation();
   animatedSearchWrapper.classList.toggle('animated-search-active');

   if (animatedSearchWrapper.classList.contains('animated-search-active')) {
      setTimeout(() => {
         searchInput.focus();
      }, 400);
   }
});

document.addEventListener('click', (e) => {
   if (!animatedSearchWrapper.contains(e.target)) {
      animatedSearchWrapper.classList.remove('animated-search-active');
   }
});
