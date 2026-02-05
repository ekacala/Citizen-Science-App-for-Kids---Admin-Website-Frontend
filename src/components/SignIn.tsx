import { YOUR_CLIENT_ID, YOUR_REDIRECT_URI } from "../secrets"
import { useLocation } from 'react-router'
import { jwtDecode } from 'jwt-decode'

// * Create form to request access token from Google's OAuth 2.0 server.
function oauthSignIn() {
  // Google's OAuth 2.0 endpoint for requesting an access token
  const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

  // Create <form> element to submit parameters to OAuth 2.0 endpoint.
  const form = document.createElement('form');
  form.setAttribute('method', 'GET'); // Send as a GET request.
  form.setAttribute('action', oauth2Endpoint);

  // Parameters to pass to OAuth 2.0 endpoint.
  const params = {'client_id': YOUR_CLIENT_ID,
                'redirect_uri': YOUR_REDIRECT_URI,
                'response_type': 'token',
                'scope': 'https://www.googleapis.com/auth/userinfo.profile',
                'include_granted_scopes': 'true',
                'state': 'pass-through value'};

  // Add form parameters as hidden input values.
  for (let p in params) {
    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', p);
    input.setAttribute('value', params[p as keyof typeof params]);
    form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
}

function getAccessToken() {
    const location = useLocation()
  
    const hash = location.hash

    const parsedHash = new URLSearchParams(hash)
    const accessToken = parsedHash.get('access_token')
    console.log(hash)
    if (accessToken) {
        decodeJWT(accessToken)
    }
}

function decodeJWT(accessToken: string) {
    const decodedJWT = jwtDecode(accessToken)
    console.log(decodedJWT)
}

export {oauthSignIn, getAccessToken}
