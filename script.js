// declare accessToken variable outside the function
var accessToken; 

// global account state
var cur_account = { isLoggedIn: false, username: '', id: ''};

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