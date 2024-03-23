import { useState, useEffect } from 'react';
import '../styles/Room.css';
import '../styles/Frominput.css';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion} from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Attendance from './Attendance';

const Room = ({ roomId }) => {
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [ans, setAns] = useState({});
    const [newQuestionText, setNewQuestionText] = useState('');
    console.log(room)
    localStorage.setItem('roomID', roomId);

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const db = getFirestore();
                const roomDocRef = doc(db, 'room_sections', roomId);
                const roomSnapshot = await getDoc(roomDocRef);

                if (roomSnapshot.exists()) {
                    setRoom({ id: roomSnapshot.id, ...roomSnapshot.data() });
                } else {
                    setError(new Error('Room not found.'));
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching room data:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchRoomData();
    }, []);

    const fetchRoomData = async () => {
        try {
            const db = getFirestore();
            const roomDocRef = doc(db, 'room_sections', roomId);
            const roomSnapshot = await getDoc(roomDocRef);
            if (roomSnapshot.exists()) {
                setRoom({ id: roomSnapshot.id, ...roomSnapshot.data() });
            } else {
                setError(new Error('Room not found.'));
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching room data:', error);
            setError(error);
            setLoading(false);
        }
    };

    const createQuestion = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        try {
            const db = getFirestore();
            const roomDocRef = doc(db, 'room_sections', roomId);

            // Update the array field by pushing the new item
            await updateDoc(roomDocRef, {
                questions: arrayUnion({ question: newQuestionText, answer_list: [] }),
            });

            setNewQuestionText(''); // Clear the input field after submitting
            console.log('Question added successfully.');

            // Fetch updated room data
            fetchRoomData();
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    const showRoom = () => {
        setExpanded(!expanded);
    };

    const toggleAns = (index) => {
        setAns({ ...ans, [index]: !ans[index] });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!room) {
        return <div>No room found.</div>;
    }
    return (
        <>
            <div className='room-box' onClick={showRoom}>
                <h1>{room.subject}</h1>
                <p>section: {room.section}</p>
            </div>
            {expanded && (
                <div className='room'>
                    <p onClick={showRoom} className='back-btn'><FontAwesomeIcon icon={faArrowLeft} /> Back</p>
                    <h1>{room.subject}</h1>
                    <p>section: {room.section}</p>
                    
                    <div className='content-room'>
                        <Attendance/>
                        <form onSubmit={createQuestion}>
                            <input placeholder='สร้างคำถาม' value={newQuestionText} onChange={(e) => setNewQuestionText(e.target.value)}></input>
                            <button type="submit">สร้าง</button>
                        </form>
                        <h1>คำถามทั้งหมด</h1>
                        {room.questions && room.questions.slice().reverse().map((question, index) => (
                            <div key={index} className='q-col'>
                                <h2 className='question'>{question.question} <span className='num_count'>{question.answer_list.length}</span></h2>
                                {question.answer_list.length > 0 ? (
                                    <p onClick={() => toggleAns(index)} className='q-btn'>แสดงทั้งหมด</p>
                                ) : (<></>)}
                                {ans[index] && (
                                    <ul>
                                        {question.answer_list.slice().reverse().map((answer, ansIndex) => (
                                            <li key={ansIndex}>
                                                <p className='user-ans'>Answer: {answer.answer}</p>
                                                <p className='user-name'>{answer.name}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default Room;
