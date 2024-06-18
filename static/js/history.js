const movieSelect = document.getElementById('movie');

document.addEventListener('DOMContentLoaded', () => {
    const bookingHistoryContainer = document.getElementById('booking-history');

    // 로컬스토리지에서 예매된 좌석 정보 가져오기
    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats')) || [];
    const occupiedSeats = JSON.parse(localStorage.getItem('occupiedSeats')) || [];
    const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');
    const selectedMoviePrice = localStorage.getItem('selectedMoviePrice');

    if (selectedSeats.length === 0 && occupiedSeats.length === 0) {
        bookingHistoryContainer.innerHTML = '<p>No bookings found.</p>';
        return;
    }

    if (selectedMovieIndex !== null) {
        movieSelect.selectedIndex = selectedMovieIndex;
    }

    const selectedOption = movieSelect.options[movieSelect.selectedIndex];
    const movieTitle = selectedOption.getAttribute('data-title');
    const movieTime = selectedOption.getAttribute('data-time');
    const movieLocation = selectedOption.getAttribute('data-location');
    const moviePoster = selectedOption.getAttribute('data-poster');

    // 예매 내역을 화면에 표시
    const bookingDetails = `
        <div class="movie-info">
            <img src="${moviePoster}" alt="${movieTitle}">
            <div>
                <h2>${movieTitle}</h2>
                <p><strong>Time:</strong> ${movieTime}</p>
                <p><strong>Location:</strong> ${movieLocation}</p>
                <p><strong>Seats:</strong> ${selectedSeats.join(', ')}</p>
                <p><strong>Price:</strong> ${selectedSeats.length * selectedMoviePrice}</p>
            </div>
        </div>
    `;

    bookingHistoryContainer.innerHTML = bookingDetails;
});
