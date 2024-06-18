const movieSelect = document.getElementById('movie');
const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat');
const count = document.getElementById('count');
const total = document.getElementById('total');
const selectedSeatsText = document.getElementById('selected-seats');
const totalPriceText = document.getElementById('total-price');
const moviePoster = document.getElementById('movie-poster');
const movieTitle = document.getElementById('movie-title');
const movieTime = document.getElementById('movie-time');
const movieLocation = document.getElementById('movie-location');
const cancelButton = document.getElementById('cancel-button');

let ticketPrice = +movieSelect.value;

populateUI();

function populateUI() {
    const movieId = getQueryParam('movie_id');

    if (movieId) {
        movieSelect.selectedIndex = movieId;
        updateMovieInfo();
        loadSeats();
    }
}

function updateMovieInfo() {
    const selectedOption = movieSelect.options[movieSelect.selectedIndex];
    moviePoster.src = selectedOption.getAttribute('data-poster');
    movieTitle.textContent = selectedOption.getAttribute('data-title');
    movieTime.textContent = selectedOption.getAttribute('data-time');
    movieLocation.textContent = selectedOption.getAttribute('data-location');
}

function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected-cancel');
    const selectedSeatCount = +selectedSeats.length;

    const selectedSeatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));
    const selectedSeatsNames = [...selectedSeats].map((seat) => seat.textContent);

    count.textContent = selectedSeatCount;
    total.textContent = selectedSeatCount * ticketPrice;

    // 정보 패널 업데이트
    selectedSeatsText.textContent = selectedSeatsNames.join(', ') || '-';
    totalPriceText.textContent = selectedSeatCount * ticketPrice;
}

function setOccupiedSeats() {
    const occupiedSeats = document.querySelectorAll('.row .seat.occupied');
    const movieIndex = movieSelect.selectedIndex;
    const occupiedSeatsIndex = [...occupiedSeats].map((seat) => [...seats].indexOf(seat));
    localStorage.setItem(`occupiedSeats_${movieIndex}`, JSON.stringify(occupiedSeatsIndex));
}

function loadSeats() {
    const movieIndex = movieSelect.selectedIndex;

    const occupiedSeats = JSON.parse(localStorage.getItem(`occupiedSeats_${movieIndex}`)) || [];

    seats.forEach((seat, index) => {
        seat.classList.remove('occupied', 'selected-cancel');
        if (occupiedSeats.includes(index)) {
            seat.classList.add('occupied');
        }
    });

    updateSelectedCount();
}

movieSelect.addEventListener('change', (event) => {
    ticketPrice = +event.target.value;
    updateMovieInfo();
    loadSeats();
});

container.addEventListener('click', (event) => {
    if (event.target.classList.contains('occupied')) {
        event.target.classList.toggle('selected-cancel');
        updateSelectedCount();
    }
});

cancelButton.addEventListener('click', () => {
    const selectedSeats = document.querySelectorAll('.row .seat.selected-cancel');
    const movieIndex = movieSelect.selectedIndex;

    const selectedSeatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));

    // 좌석을 occupied에서 해제하고 로컬 스토리지에서 제거
    selectedSeats.forEach(seat => {
        seat.classList.remove('selected-cancel');
        seat.classList.remove('occupied');
    });

    // 로컬 스토리지에서 해당 좌석 정보 제거
    const occupiedSeats = JSON.parse(localStorage.getItem(`occupiedSeats_${movieIndex}`)) || [];
    const updatedOccupiedSeats = occupiedSeats.filter(index => !selectedSeatsIndex.includes(index));
    localStorage.setItem(`occupiedSeats_${movieIndex}`, JSON.stringify(updatedOccupiedSeats));

    // 선택된 좌석 정보만 제거
    const selectedSeatsStored = JSON.parse(localStorage.getItem(`selectedSeats_${movieIndex}`)) || [];
    const updatedSelectedSeats = selectedSeatsStored.filter(index => !selectedSeatsIndex.includes(index));
    localStorage.setItem(`selectedSeats_${movieIndex}`, JSON.stringify(updatedSelectedSeats));

    // 예매 내역에서 좌석 이름 제거
    const selectedSeatsNamesStored = JSON.parse(localStorage.getItem(`selectedSeatsNames_${movieIndex}`)) || [];
    const updatedSelectedSeatsNames = selectedSeatsNamesStored.filter((seat, index) => !selectedSeatsIndex.includes(selectedSeatsStored[index]));
    localStorage.setItem(`selectedSeatsNames_${movieIndex}`, JSON.stringify(updatedSelectedSeatsNames));

    // 좌석이 모두 취소된 경우 영화 데이터 제거
    if (updatedSelectedSeats.length === 0) {
        localStorage.removeItem(`moviePoster_${movieIndex}`);
        localStorage.removeItem(`movieTitle_${movieIndex}`);
        localStorage.removeItem(`movieTime_${movieIndex}`);
        localStorage.removeItem(`movieLocation_${movieIndex}`);
        localStorage.removeItem(`selectedSeats_${movieIndex}`);
        localStorage.removeItem(`selectedSeatsNames_${movieIndex}`);
    }

    updateSelectedCount();
    setOccupiedSeats();
    // 취소 완료 처리 후 페이지 리다이렉트
    window.location.href = cancelUrl;
});

// URL에서 쿼리 파라미터를 가져오는 함수
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
