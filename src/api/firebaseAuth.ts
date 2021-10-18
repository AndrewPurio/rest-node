import { app } from './firebaseConfig'
import { GoogleAuthProvider, getAuth, signInWithRedirect } from 'firebase/auth'

export const auth = getAuth(app)

export const googleSignIn = async () => {
    try {
        const provider = new GoogleAuthProvider()
        await signInWithRedirect(auth, provider)
    } catch(error) {
        console.log(error)
    }
}