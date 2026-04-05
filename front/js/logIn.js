document.querySelector('.back').addEventListener('mouseenter', function() {
  const img = this.querySelector('.back-img');
  img.dataset.original = img.src;
  img.src = img.dataset.hover;
});

document.querySelector('.back').addEventListener('mouseleave', function() {
  const img = this.querySelector('.back-img');
  img.src = img.dataset.original;
});