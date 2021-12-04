// this is just to show how you can get info from the server thru routing, redirect, and sendFile.
// we want to put the homepage after logging in. similar code to this should go in the homepage javascript to get the username from logging in.

// Get username and room from URL
const { username } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

console.log('your logged in username should be: ' + username);