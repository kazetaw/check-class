import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Room from './Room'; // Import the Room component
import Nav from './Nav';

const TeacherDashboard = () => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const db = getFirestore();
                const roomCollection = collection(db, 'room_sections');
                const querySnapshot = await getDocs(roomCollection);
                const roomData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRooms(roomData);
            } catch (error) {
                console.error('Error fetching room data:', error);
            }
        }
        fetchRoomData();
    }, []);

    return (
        <>
            <Nav/>
            <div className='dashboard'>
                <>
                    <h1>ห้องเรียนทั้งหมด</h1>
                    <div className='room-list'>
                        {rooms.length > 0 ? (
                            rooms.map(room => (
                                <Room key={room.id} roomId={room.id} />
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

export default TeacherDashboard;
