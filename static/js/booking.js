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
  const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats')) || [];
  const occupiedSeats = JSON.parse(localStorage.getItem('occupiedSeats')) || [];

  selectedSeats.forEach((seatIndex) => {
    if (seats[seatIndex]) {
      seats[seatIndex].classList.add('selected');
    }
  });

  occupiedSeats.forEach((seatIndex) => {
    if (seats[seatIndex]) {
      seats[seatIndex].classList.add('occupied');
    }
  });

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

function setOccupiedSeats() {
  const occupiedSeats = document.querySelectorAll('.row .seat.occupied');
  const occupiedSeatsIndex = [...occupiedSeats].map((seat) => [...seats].indexOf(seat));
  localStorage.setItem('occupiedSeats', JSON.stringify(occupiedSeatsIndex));
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
  const selectedSeats = document.querySelectorAll('.row .seat.selected');

  selectedSeats.forEach(seat => {
    seat.classList.remove('selected');
    seat.classList.add('occupied');
  });

  updateSelectedCount();
  setOccupiedSeats();
  // 예매 완료 처리 후 페이지 리다이렉트
  window.location.href = paymentUrl;
});

// URL에서 쿼리 파라미터를 가져오는 함수
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// movie_id 파라미터를 가져옴
const movieId = getQueryParam('movie_id');

// movie_id가 존재하면 해당 옵션을 선택
if (movieId) {
    const movieSelect = document.getElementById('movie');
    movieSelect.value = movieSelect.options[movieId - 1].value;

    // 변경 이벤트를 발생시켜서 상세 정보를 업데이트
    const event = new Event('change');
    movieSelect.dispatchEvent(event);
}

document.getElementById('movie').dispatchEvent(new Event('change'));

updateSelectedCount();
