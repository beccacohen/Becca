// declare accessToken variable outside the function
var accessToken; 

// global account state
var cur_account = { isLoggedIn: false, username: '', id: ''};

// global song comparisons
var comparisonArr = [];
var comparisonIndex = 0;
var leaderboard = {};

function createComparisonArr(songArr) {
  // create an array of all possible song comparisons
  // each comparison will be an object with two songs

  // create all 2-song comparisons
  for (var i = 0; i < songArr.length; i++) {
    for (var j = i + 1; j < songArr.length; j++) {
      comparisonArr.push({ song1: songArr[i], song2: songArr[j]});
    }
  }

  console.log(comparisonArr);
}

function createLeaderboard(songArr) {
  // create an object with all songs as keys
  // each song will have a value of 0
  for (var i = 0; i < songArr.length; i++) {
    leaderboard[songArr[i]] = 0;
  }
  console.log(leaderboard);
}

// access token
async function getSongs() {
  accessToken = await refreshAccessToken();
  // Return the fetch promise here
  return fetch('https://api.spotify.com/v1/playlists/4GtQVhGjAwcHFz82UKy3Ca', {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  })
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    return data;
  });
}

async function createSongArr() {
  var songs = await getSongs();
  var songArr = [];

  // replace the 100 with the length of the playlist
  // songs.tracks.items.length
  for (var i = 0; i < 100; i++) {
    songArr.push(songs.tracks.items[i].track.name);
  }

  createComparisonArr(songArr);
  createLeaderboard(songArr);
}



//access refresh token
async function refreshAccessToken() {
  return fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: 'grant_type=client_credentials&client_id=' + 'a29939ffd5bb4133ae5e704711de4595' + '&client_secret=' + '3cc78b2a48d244c69833b4c178ee7f51',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    return data.access_token;
  })
}

async function compareSongs() {
  // both songs are buttons
  // when a song is clicked call a function that takes the chosen song as a parameter
  // the function will add the song comparison to the history array and update the leaderboard
  // the funtion will then display the next two songs to be compared
  // the function will check if the next two songs are in the history array
  // if so it will display the next two songs
}

function displayFinalRankings() {
  var rankingsList = document.getElementById('rankingsList');

  // sort leaderboard by value
  var sortedLeaderboard = Object.keys(leaderboard).sort(function (a, b) {
    return leaderboard[b] - leaderboard[a];
  });

  // display leaderboard
  sortedLeaderboard.forEach(function (song, index) {
    var listItem = document.createElement('li');
    listItem.textContent = (index + 1) + '. ' + song;
    rankingsList.appendChild(listItem);
  });

  // also save sorted leaderboard to database
  fetch('https://demo8229037.mockable.io/swiftsorter/leaderboard', {
    method: 'POST',
    body: JSON.stringify(sortedLeaderboard)
  });
}

var songButton1 = document.getElementById('song-button1');
var songButton2 = document.getElementById('song-button2');

songButton1.addEventListener('click', function () {
  handleSongClick(songButton1);
});
songButton2.addEventListener('click', function () {
  handleSongClick(songButton2);
});

function handleSongClick(selectedSong) {

  // update leaderboard
  // go to next comparison
  // update button text

  var songButton1 = document.getElementById('song-button1');
  var songButton2 = document.getElementById('song-button2');

  leaderboard[selectedSong.textContent] += 1;
  comparisonIndex += 1;

  if (comparisonIndex >= comparisonArr.length) {
    // hide buttons
    songButton1.style.display = 'none';
    songButton2.style.display = 'none';
    displayFinalRankings();
    saveLeaderboard();
    return;
  }

  songButton1.textContent = comparisonArr[comparisonIndex].song1;
  songButton2.textContent = comparisonArr[comparisonIndex].song2;
}

async function initialize() {
  // call createSongArr() 
  await createSongArr();

  // display first two songs
  var songButton1 = document.getElementById('song-button1');
  var songButton2 = document.getElementById('song-button2');
  songButton1.textContent = comparisonArr[comparisonIndex].song1;
  songButton2.textContent = comparisonArr[comparisonIndex].song2;

}

initialize();


async function getAccounts() {
  return fetch(
    'http://demo8229037.mockable.io/swiftsorter/accounts'
  )
  .then(function (response) {
    return response.json();
  });
}

async function login() {
  var accounts = await getAccounts()
  // Retrieve the username and password input values
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  console.log(accounts);

  accounts["login"].forEach(function(account) {
    if (account.username === username && account.password === password) {
      // valid account
      cur_account.isLoggedIn = true
      cur_account.username = account.username
      cur_account.id = account.id

      // Create element to display username
      var usernameElement = document.createElement('h2');
      usernameElement.textContent = 'Welcome ' + cur_account.username + '!';
      document.body.appendChild(usernameElement);

      // erase error message when user logs in successfully
      var errorMessage = document.getElementById('error-message');
      errorMessage.textContent = '';
    }
  });
  

  if (cur_account.isLoggedIn === false) {
    var errorMessage = document.getElementById('error-message');
    errorMessage.textContent = 'Invalid username or password';
  }
}