import { github } from "@lucia-auth/oauth/providers";
import { auth } from "./auth.js";
import { GITHUB_SECRET, GITHUB_ID, VERCEL, URL } from '$env/static/private'

const githubAuth = github(auth, {
    clientId: GITHUB_ID,
    clientSecret: GITHUB_SECRET,
    redirectUri: parseInt(VERCEL) === 1?'https://':'http://' + URL + '/auth/continue'
});