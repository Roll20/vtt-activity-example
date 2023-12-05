import { discordSdk } from './discordSdk';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, inMemoryPersistence, setPersistence } from 'firebase/auth';

discordSdk.initializeNetworkShims(import.meta.env.VITE_DISCORD_CLIENT_ID, [
    { prefix: '/firebaseio/roll20-dev', target: 'roll20-dev.firebaseio.com' },
    { prefix: '/googleapis/{server}', target: '{server}.googleapis.com' },
])

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,	
    authDomain: "roll20-dev.firebaseapp.com",
    databaseURL: "https://roll20-dev.firebaseio.com",
    projectId: "roll20-dev",
    storageBucket: "roll20-dev.appspot.com",
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
}
// Initialize Firebase
initializeApp(firebaseConfig);

const signIn = async ({ token }: { token: string }) => {

	const auth = getAuth();
	await setPersistence(auth, inMemoryPersistence);

	return signInWithCustomToken(auth, token);
};

export { signIn };
export default signIn;
