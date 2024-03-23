import React, { useState, useEffect } from 'react';
import { collection, doc, getDocs, updateDoc, getFirestore } from 'firebase/firestore';

const Attendance = () => {
    const [form, setForm] = useState({});
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);

    const db = getFirestore();
    const user_studentRef = collection(db, "user_student"); // Use 'db' to reference Firestore collection

    useEffect(() => {
        loadData(); // Call the 'loadData' function inside useEffect
    }, [data]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const loadData = async () => {
        try {
            const querySnapshot = await getDocs(user_studentRef); // Use 'user_studentRef' to query Firestore
            const newData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setData(newData);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSave = async (id) => {
        try {
            await updateDoc(doc(user_studentRef, id), form); // Update document with the new form data
            setEditId(null);
        } catch (err) {
            console.log(err);
        }
    };

    const handleRandom = () => {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomStudent = data[randomIndex];
        setData([randomStudent]); // Set data to display only the randomly selected student
    };

    return (
        <div>
            <h2>Random Name:</h2>
            <button onClick={handleRandom}>Random</button>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Section</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <th>{index + 1}</th>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.section}</td>
                            <td>
                                {editId === item.id ? (
                                    <input
                                        onChange={(e) => handleChange(e)}
                                        type="text"
                                        name="status"
                                        value={form.status !== undefined ? form.status : item.status}
                                        placeholder="status"
                                    />
                                ) : (
                                    item.status
                                )}
                            </td>
                            <td>
                                {editId === item.id ? (
                                    <button onClick={() => handleSave(item.id)}>Save</button>
                                ) : (
                                    <button onClick={() => setEditId(item.id)}>Edit status</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className='create-question-btn'>Create Question</button>
        </div>
    );
};

export default Attendance;
