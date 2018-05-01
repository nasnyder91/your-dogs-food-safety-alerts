// Materialize initializations
const scrollSpy = document.querySelectorAll('.scrollspy');
const scrollSpyInstance = M.ScrollSpy.init(scrollSpy, {});

// Event Listeners
const foodCards = document.querySelectorAll('.foodCard');
foodCards.forEach(card => {
  card.addEventListener('mouseenter', flipCard);
  card.addEventListener('mouseleave', flipCard);
});

document.querySelector('#searchResults').addEventListener('mouseover', checkIfCard);
document.querySelector('#searchResults').addEventListener('mouseout', checkIfCard);

document.querySelector('#searchFoods').addEventListener('keyup', showSearchResults);


function checkIfCard(e){
  if(e.target.classList.contains('card')){
    console.log(123421);

    flipCard(e);
  }
}

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

// Submit search on keyup
function showSearchResults(e){
  fetchMatchedFoodItems(e.target.value)
    .then(matchedFoods => {
      fillSearchResults(matchedFoods);
    });
}

async function fetchMatchedFoodItems(input){
  const response = await fetch(`assets/json/foodList.json?search=${input}`);
  const responseData = await response.json();

  return responseData;
}

function fillSearchResults(matchedFoods){
  const searchResultsSection = document.querySelector('#searchResults');

  if(matchedFoods.length > 0){
    searchResultsSection.innerHTML = '';
    matchedFoods.forEach(food => {
      let color;
      switch(food.safety){
        case 'good':
          color = 'green';
          break;
        case 'sometimes':
          color = 'grey';
          break;
        case 'bad':
          color = 'red';
          break;
        default:
          color = 'grey';
      }
      const foodContainer = document.createElement('div');
      foodContainer.className = 'col m2 foodContainer';
      foodContainer.innerHTML = `
        <div class="card ${color} foodCard">
          <div class="cardFront">
            <img class="circle responsive-img" src="/img/${food.safety}foods/${food.name}.jpeg" alt="${food.name} image">
            <span class="card-title">${food.name}</span>
          </div>
          <div class="cardBack" style="display: none;">
            <p>${food.description}</p>
          </div>
        </div>
      `;
      searchResultsSection.appendChild(foodContainer);
    });
  } else{
    searchResultsSection.innerHTML = '<p>There are no foods that match your search!</p>'
  }
}
