window.onload = function() {
    console.log(localStorage.getItem('rankScore'));
    console.log(localStorage.getItem('rankName'));
    document.getElementById('rank').innerHTML = "Rank: "+localStorage.getItem('rankScore');
}