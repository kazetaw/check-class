import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../styles/Room.css';

const RoomStudent = ({ roomId }) => {
    const [room, setRoom] = useState(null);
    const [questionText, setQuestionText] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [answers, setAnswers] = useState([]); // ใช้ array ในการเก็บค่าของ input ตาม index
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
                // กำหนดค่าเริ่มต้นของ answers ให้เป็น array ที่มีขนาดเท่ากับจำนวนของคำถาม
                setAnswers(new Array(roomSnapshot.data().questions.length).fill(''));
            }
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoomData();
    }, []);

    const ansQuestion = async (event, index) => {
        event.preventDefault();
        const question = questionText;
        const email = localStorage.getItem('userEmail');
        const name = localStorage.getItem('userName');
        const answer = answers[index]; // ดึงค่าของคำตอบจาก state ตาม index

        const roomSectionsRef = collection(db, "room_sections");
        try {
            const querySnapshot = await getDocs(roomSectionsRef);
            let answerAdded = false;

            for (const document of querySnapshot.docs) {
                const docRef = doc(db, "room_sections", document.id);
                const data = document.data();
                let questionsUpdated = false;

                data.questions.forEach((qItem, qIndex) => {
                    if (qIndex === index) { // เปรียบเทียบ index เพื่อหาคำถามที่ตรงกับ index ที่ส่งเข้ามา
                        data.questions[qIndex].answer_list.push({ name, email, answer });
                        questionsUpdated = true;
                    }
                });

                if (questionsUpdated) {
                    await updateDoc(docRef, {
                        questions: data.questions
                    });
                    alert('ตอบคำถามแล้ว')
                    console.log(`Answer added to question: ${question}`);
                    answerAdded = true;
                    break;
                }
            }
        } catch (error) {
            console.error("Error adding answer: ", error);
        }
    };

    const handleNewAnswerChange = (event, index) => {
        const { value } = event.target;
        // อัปเดตค่าของ input ใน array ของ answers ตาม index ที่กำหนด
        setAnswers(prevAnswers => {
            const newAnswers = [...prevAnswers];
            newAnswers[index] = value;
            return newAnswers;
        });
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
                        {room && room.questions && room.questions.map((question, index) => (
                            <div key={index} className='q-col'>
                                <h2 className='question'>{question.question}</h2>
                                <form onSubmit={(event) => ansQuestion(event, index)}>
                                    <input
                                        placeholder='Type your answer here'
                                        value={answers[index]} // ใช้ค่าของ answers ตาม index ในการกำหนดค่าของ input
                                        onChange={(event) => handleNewAnswerChange(event, index)} // ใช้ index ในการอ้างอิงถึง input แต่ละตัว
                                    ></input>
                                    <button type="submit">Submit</button>
                                </form>
                            </div>
                        )).reverse()}
                    </div>
                </div>
            )}
        </>
    );
};

export default RoomStudent;
