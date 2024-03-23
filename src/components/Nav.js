import { useEffect, useState } from 'react';
import { getAuth, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import app from '../firebase-config';
import '../styles/Nav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const logo = process.env.PUBLIC_URL + '/logo.png';

const Login = () => {
    const [userData, setUserData] = useState(null);
    const [popup, setPopup] = useState(false);

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setUserData(user);
                localStorage.setItem('userEmail', user.email);
                localStorage.setItem('userName', user.displayName);
            } else {
                setUserData(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        const auth = getAuth(app);
        signOut(auth).then(() => {
            window.location.href = '/';
        }).catch((error) => {
            console.log(error);
        });
    };

    const handleGoogleSignIn = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        try {
            // Sign in the user with Google Popup
            const result = await signInWithPopup(auth, provider);
            // Get the authenticated user data
            const user = result.user;
            // Access Firestore instance
            const db = getFirestore();

            // Retrieve data from Firestore collection
            const userCollection = collection(db, 'user_teacher'); // Assuming 'teacher' is the collection name
            const querySnapshot = await getDocs(userCollection);

            // Process the fetched data
            let isTeacher = false;
            console.log(user.email)
            querySnapshot.forEach(doc => {
                if (user.email === doc.data().email) {
                    isTeacher = true;
                }
            });

            // Redirect based on user's role
            if (isTeacher) {
                window.location.href = '/teacher/Dashboard';
            } else {
                window.location.href = '/student/Dashboard';
            }

            setUserData(user);
        } catch (error) {
            console.error(error);
        }
    };
    const handlePopup = () => {
        setPopup(!popup);
    }


    return (
        <nav>
            <img src={logo} alt='logo' className='logo' />
            {userData ? (
                <div className='profile'>
                    <img src={userData.photoURL} alt='profile_img' onClick={handlePopup} />
                    {popup ? (
                        <div className='popup show'>
                            <p>{userData.email}</p>
                            <div className='btn-box'>
                                <button onClick={handleLogout} className='btn'><FontAwesomeIcon icon={faRightFromBracket} /> Logout</button>
                            </div>
                        </div>
                    ) : (
                        <div className='popup'>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>

            ) : (
                <button onClick={handleGoogleSignIn} className='btn-login'><FontAwesomeIcon icon={faRightFromBracket} /> Login</button>
            )}

        </nav>
    );
}

export default Login;