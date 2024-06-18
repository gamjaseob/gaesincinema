document.addEventListener('DOMContentLoaded', () => {
    const upButton = document.getElementById('upButton');
    const bookingList = document.getElementById('bookingList');

    // 스크롤이 일정 높이 이상 내려가면 "UP" 버튼을 표시
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            upButton.style.display = 'block';
        } else {
            upButton.style.display = 'none';
        }
    });

    // "UP" 버튼 클릭 시 페이지 맨 위로 스크롤
    upButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 로컬 스토리지에서 모든 예매 내역 불러오기
    const allBookings = [];

    // 저장된 모든 예매 내역을 불러와서 allBookings 배열에 추가
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('selectedSeats_')) {
            const movieIndex = key.split('_')[1];
            const selectedSeats = JSON.parse(localStorage.getItem(`selectedSeatsNames_${movieIndex}`)) || [];
            if (selectedSeats.length > 0) {
                const moviePoster = localStorage.getItem(`moviePoster_${movieIndex}`);
                const movieTitle = localStorage.getItem(`movieTitle_${movieIndex}`);
                const movieTime = localStorage.getItem(`movieTime_${movieIndex}`);
                const movieLocation = localStorage.getItem(`movieLocation_${movieIndex}`);
                const ticketPrice = localStorage.getItem('selectedMoviePrice');

                allBookings.push({
                    movieIndex,
                    moviePoster,
                    movieTitle,
                    movieTime,
                    movieLocation,
                    selectedSeats,
                    ticketPrice
                });
            }
        }
    }

    // 예매 내역을 HTML에 추가
    if (allBookings.length > 0) {
        allBookings.forEach(booking => {
            const bookingItem = document.createElement('div');
            bookingItem.classList.add('bookingItem');
            bookingItem.innerHTML = `
                <div class="moviePoster">
                    <img src="${booking.moviePoster}" alt="${booking.movieTitle} Poster">
                </div>
                <div class="bookingDetails">
                    <h3>${booking.movieTitle}</h3>
                    <p>상영 시간: ${booking.movieTime}</p>
                    <p>좌석 번호: ${booking.selectedSeats.join(', ')}</p>
                    <p>총 금액: ${booking.selectedSeats.length * booking.ticketPrice}원</p>
                    <a href="#" class="btn cancel-button" data-movie-id="${booking.movieIndex}">예매 취소</a>
                </div>
            `;
            bookingList.appendChild(bookingItem);
        });

        // 예매 취소 버튼 클릭 시 예매 취소 처리
        const cancelButtons = document.querySelectorAll('.cancel-button');
        cancelButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const movieId = event.target.getAttribute('data-movie-id');
                const cancelUrlWithParam = `${cancelUrl}?movie_id=${movieId}`;

                if (confirm('정말 예매를 취소하시겠습니까?')) {
                    window.location.href = cancelUrlWithParam;
                }
            });
        });
    } else {
        bookingList.innerHTML = '<p class="no-bookings">예매 내역이 없습니다.</p>';
    }
});
