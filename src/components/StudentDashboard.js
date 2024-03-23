import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import RoomStudent from './RoomStudent';
import Nav from './Nav';
import FormInputData from './FormInputData';

const StudentDashboard = ({ userData }) => {
    const [rooms, setRooms] = useState([]);
    const [inRoom, setInRoom] = useState(false);

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const db = getFirestore();
                
                // Query rooms based on user's email
                const roomCollection = collection(db, 'room_sections');
                const roomSnapshot = await getDocs(roomCollection);
                
                // Extract room data from the snapshot
                const roomData = roomSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                // Set room data to state
                setRooms(roomData);

                // Check if user is in any room
                checkStudentInRoom(roomData);
            } catch (error) {
                console.error('Error fetching room data:', error);
            }
        };
        fetchRoomData();
    }, [rooms]);

    const checkStudentInRoom = (roomData) => {
        try {
            for (const room of roomData) {
                if (room.student_list && room.student_list.some(student => student.email === localStorage.getItem('userEmail'))) {
                    setInRoom(true);
                    return;
                }
            }
            setInRoom(false);
        } catch (error) {
            console.error('Error checking student in room:', error);
        }
    };

    return (
        <>
            <Nav />
            <div className='dashboard'>
                <>
                    <FormInputData />
                    <h1>ห้องเรียนทั้งหมด</h1>
                    <div className='room-list'>
                        {rooms.length > 0 && inRoom ? (
                            rooms.map(room => (
                                <RoomStudent key={room.id} roomId={room.id} userData={userData} />
                            )).reverse()
                        ) : (
                            <div>ไม่มีห้อง...</div>
                        )}
                    </div>
                </>
            </div>
        </>
    );
};

export default StudentDashboard;
