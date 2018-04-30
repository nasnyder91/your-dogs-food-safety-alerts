// Event Listeners
document.querySelector('.foodCard').addEventListener('mouseenter', flipCard);
document.querySelector('.foodCard').addEventListener('mouseleave', flipCard);



function flipCard(e){
  let card = e.target;
  if(card.classList.contains('rotate180')){
    return;
  }

  while(!card.classList.contains('card')){
    card = card.parentElement;
  }

  const cardFront = card.querySelector('.cardFront');
  const cardBack = card.querySelector('.cardBack');

  rotate180(card, 500, () => {
    cardFront.style.display = (cardFront.style.display === 'none' ? 'block' : 'none');
    cardBack.style.display = (cardBack.style.display === 'block' ? 'none' : 'block');
  }, () => {
    if((!card.matches(':hover')) && (cardFront.style.display === 'none')){
      console.log(123421);
      setTimeout(flipCard(e), 500);
    }
  });
}

// Animations
function rotate180(element, duration, halfwayCallback, endCallback){
  if(element.classList.contains('rotate180')){
    return;
  }
  element.style.setProperty('--duration', duration + 'ms');
  element.classList.add('rotate180');

  setTimeout(halfwayCallback, duration/2);
  setTimeout(() => {
    element.classList.remove('rotate180');
    endCallback();
  }, duration);
}
