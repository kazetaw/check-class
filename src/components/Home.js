import { useState } from 'react';
import Nav from './Nav';
import '../styles/Home.css';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';

const Home = () => {
    const [userData, setUserData] = useState(null);

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
    
            const studentCollection = collection(db, 'user_student'); // Assuming 'teacher' is the collection name
            const queryStuSnapshot = await getDocs(studentCollection);
    
            // Process the fetched data
            let isTeacher = false;
            querySnapshot.forEach(doc => {
                if (user.email === doc.data().email) {
                    isTeacher = true;
                }
            });
    
            let isStudent = false;
            queryStuSnapshot.forEach(doc => {
                if (user.email === doc.data().email) {
                    isStudent = true;
                }
            });
    
            // Redirect based on user's role
            if (isTeacher) {
                window.location.href = '/teacher/Dashboard';
                setUserData(user);
            } else if (isStudent) {
                window.location.href = '/student/Dashboard';
                setUserData(user);
            } else {
                const userConfirmed = window.confirm('ไม่พบชื่อของคุณ ต้องการลงทะเบียนหรือไม่');
                if (userConfirmed) {
                    const email = user.email;
                    const name = user.displayName;
                    const register = { email, name };
                    await addDoc(collection(db, "user_student"), register);
                    window.location.href = '/student/Dashboard';
                    setUserData(user);
                } else {
                    setUserData(null);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Nav />
            <div className='container'>
                <h1>เข้าห้องเรียนกันเถอะ!</h1>
                <div className='content'>
                    <div onClick={handleGoogleSignIn}>กรุณาเข้าสู่ระบบ</div>
                </div>
            </div>
        </>
    );
}

export default Home;
