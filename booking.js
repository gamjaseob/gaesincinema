const movieSelect = document.getElementById('movie');
const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const selectedSeatsText = document.getElementById('selected-seats');
const totalPriceText = document.getElementById('total-price');
const moviePoster = document.getElementById('movie-poster');
const movieTitle = document.getElementById('movie-title');
const movieTime = document.getElementById('movie-time');
const movieLocation = document.getElementById('movie-location');
const nextButton = document.getElementById('next-button');

let ticketPrice = +movieSelect.value;

populateUI();

function populateUI() {
  const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));

  if (selectedSeats !== null && selectedSeats.length > 0) {
    selectedSeats.forEach((seatIndex) => {
      if (seats[seatIndex]) {
        seats[seatIndex].classList.add('selected');
      }
    });
  }

  const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');

  if (selectedMovieIndex !== null) {
    movieSelect.selectedIndex = selectedMovieIndex;
    updateMovieInfo();
  }
}

function setMovieData(movieIndex, moviePrice) {
  localStorage.setItem('selectedMovieIndex', movieIndex);
  localStorage.setItem('selectedMoviePrice', moviePrice);
}

function updateMovieInfo() {
  const selectedOption = movieSelect.options[movieSelect.selectedIndex];
  moviePoster.src = selectedOption.getAttribute('data-poster');
  movieTitle.textContent = selectedOption.getAttribute('data-title');
  movieTime.textContent = selectedOption.getAttribute('data-time');
  movieLocation.textContent = selectedOption.getAttribute('data-location');
}

function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll('.row .seat.selected');
  const selectedSeatCount = +selectedSeats.length;

  const selectedSeatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));
  const selectedSeatsNames = [...selectedSeats].map((seat) => seat.textContent);

  localStorage.setItem('selectedSeats', JSON.stringify(selectedSeatsIndex));

  count.textContent = selectedSeatCount;
  total.textContent = selectedSeatCount * ticketPrice;
  
  // 정보 패널 업데이트
  selectedSeatsText.textContent = selectedSeatsNames.join(', ') || '-';
  totalPriceText.textContent = selectedSeatCount * ticketPrice;
}

movieSelect.addEventListener('change', (event) => {
  ticketPrice = +event.target.value;
  updateMovieInfo();
  
  setMovieData(event.target.selectedIndex, ticketPrice);
  updateSelectedCount();
});

container.addEventListener('click', (event) => {
  if (event.target.classList.contains('seat') && !event.target.classList.contains('occupied')) {
    event.target.classList.toggle('selected');
    updateSelectedCount();
  }
});

nextButton.addEventListener('click', () => {
  window.location.href = 'payment.html';
});

updateSelectedCount();
