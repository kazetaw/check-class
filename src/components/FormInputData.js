import React, { useState } from 'react';
import '../styles/Frominput.css';
import { collection, addDoc, getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore'; // Import necessary Firestore modules
import { Link } from 'react-router-dom';

const FormInputData = () => {
    const [form, setForm] = useState({ name: '', email: '', section: '' }); // Initialize state for form data
    const db = getFirestore(); // Get Firestore instance

    // Handle input change and update corresponding field in form state
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Function to add data to Firestore collections
    const handleAddData = async () => {
        try {
            // Add data to the 'user_student' collection
            await addDoc(collection(db, "user_student"), form);
            console.log("Data added to 'user_student' collection");

            // Retrieve the room_sections document
            const roomId = localStorage.getItem('roomID'); // Replace 'your_room_id_here' with the actual roomId
            const roomDocRef = doc(db, 'room_sections', roomId);
            const roomSnapshot = await getDoc(roomDocRef);

            if (roomSnapshot.exists()) {
                // Update the student_list array in the room_sections document
                const roomData = roomSnapshot.data();
                const updatedStudentList = [
                    ...(roomData.student_list || []), // Use existing student_list if available
                    { email: form.email, name: form.name, section: form.section }
                ];

                // Update the room_sections document with the updated student_list
                await updateDoc(roomDocRef, { student_list: updatedStudentList });
                console.log("Student added to student_list array in room_sections document");
            } else {
                console.log("Room document does not exist");
            }

            // Clear the form after successful data submission
            setForm({ name: '', email: '', section: '' });
        } catch (error) {
            console.error("Error adding data: ", error);
        }
    };

    return (
        <>
            <h2>เพิ่มนักศึกษา</h2>
            <input 
                onChange={handleChange} 
                type='text' 
                name='name' 
                placeholder='Name' 
                value={form.name} 
                className='form-input' // Apply the form-input class
            /><br />
            <input 
                onChange={handleChange} 
                type='text' 
                name='email' 
                placeholder='Email' 
                value={form.email} 
                className='form-input' // Apply the form-input class
            /><br />
            <input 
                onChange={handleChange} 
                type='text' 
                name='section' 
                placeholder='Section' 
                value={form.section} 
                className='form-input' // Apply the form-input class
            /><br />
            <button 
                onClick={handleAddData} 
                className='form-button' // Apply the form-button class
            >
                เข้าร่วมห้องเรียน
            </button>
            
        </>
    );
}

export default FormInputData;
