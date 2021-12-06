const h = document.getElementById('rank');
const url = 'https://api.mozambiquehe.re/bridge?version=5&platform=PC&player='+username+'&auth='+process.env.APEX_AUTH;

fetch(url)
.then((resp) => resp.json())
.then(function(data) {
    let userInfo = data.results;
    console.log(userInfo.global.rank.rankScore);
    h.innerHTML = 'Rank: '+userInfo.global.rank.rankScore;
})
.catch(function(error) {
    console.log(error);
});