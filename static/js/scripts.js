const toTopBtn = document.getElementById('upButton');

window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        toTopBtn.style.display = "block";
    } else {
        toTopBtn.style.display = "none";
    }
};

toTopBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('DOMContentLoaded', function() {
    var authLi = document.getElementById('authLi');

    if (isLoggedIn === 'true') {
        authLi.innerHTML = '<a href="/logout">로그아웃</a>';
        authLi.querySelector('a').onclick = function() {
            // Logic to log out
        };
    } else {
        authLi.innerHTML = '<a href="/login">로그인</a>';
        authLi.querySelector('a').onclick = function() {
            // Logic to log in
        };
    }
});
