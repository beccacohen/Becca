// access token
async function makeApiCall() {
  accessToken = await refreshAccessToken();
  // Return the fetch promise here
  return fetch('https://api.spotify.com/v1/playlists/4GtQVhGjAwcHFz82UKy3Ca', {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
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