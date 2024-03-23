import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../styles/Room.css';

const RoomStudent = ({ roomId }) => {
    const [room, setRoom] = useState(null);
    const [questionText, setQuestionText] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [newAnswer, setNewAnswer] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const db = getFirestore();

    const fetchRoomData = async () => {
        try {
            const roomDocRef = doc(db, 'room_sections', roomId);
            const roomSnapshot = await getDoc(roomDocRef);
            if (roomSnapshot.exists()) {
                setRoom({ id: roomSnapshot.id, ...roomSnapshot.data() });
                setQuestionText(roomSnapshot.data().questions[0].question);
            }
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoomData();
    }, [roomId]);

    const ansQuestion = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        const question = questionText;
        const email = localStorage.getItem('userEmail'); // Fix typo here
        const name = localStorage.getItem('userName');
        const answer = newAnswer;

        const roomSectionsRef = collection(db, "room_sections");
        try {
            const querySnapshot = await getDocs(roomSectionsRef);
            let answerAdded = false;

            for (const document of querySnapshot.docs) {
                const docRef = doc(db, "room_sections", document.id);
                const data = document.data();
                let questionsUpdated = false;

                data.questions.forEach((qItem, index) => {
                    if (qItem.question === question) {
                        // Found the question, now add the answer to its answers_list
                        data.questions[index].answers_list.push({ name, email, answer });
                        questionsUpdated = true;
                    }
                });

                if (questionsUpdated) {
                    // If the questions were updated, update the document in Firestore
                    await updateDoc(docRef, {
                        questions: data.questions
                    });
                    console.log(`Answer added to question: ${question}`);
                    answerAdded = true;
                    break; // If you only need to add the answer to the first matching question found
                }
            }
        } catch (error) {
            console.error("Error adding answer: ", error);
        }
    };

    const handleNewAnswerChange = (e) => {
        setNewAnswer(e.target.value);
    };

    const showRoom = () => {
        setExpanded(!expanded);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div className='room-box' onClick={showRoom}>
                <h1>{room ? room.subject : 'Loading...'}</h1>
                <p>section: {room ? room.section : 'Loading...'}</p>
            </div>
            {expanded && (
                <div className='room'>
                    <p onClick={showRoom} className='back-btn'><FontAwesomeIcon icon={faArrowLeft} /> Back</p>
                    <h1>{room ? room.subject : 'Loading...'}</h1>
                    <p>section: {room ? room.section : 'Loading...'}</p>

                    <div className='content-room'>
                        <h1>คำถามทั้งหมด</h1>
                        {room && room.questions && room.questions.reverse().map((question, index) => (
                            <div key={index} className='q-col'>
                                <h2 className='question'>{question.question}</h2>
                                <form onSubmit={ansQuestion}>
                                    <input
                                        placeholder='Type your answer here'
                                        value={newAnswer}
                                        onChange={(e) => handleNewAnswerChange(e)}
                                    ></input>
                                    <button type="submit">Submit</button>
                                </form>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default RoomStudent;
