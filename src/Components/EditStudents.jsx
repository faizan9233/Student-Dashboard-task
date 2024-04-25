// EditStudent.jsx

import React, { useState } from 'react';
import { updateDoc, doc as firestoreDoc } from 'firebase/firestore';
import { db } from '@/FirebaseConfig/firebase';
import toast from 'react-hot-toast';

const EditStudents = ({ student, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: student.name,
        nationality: student.nationality,
        city: student.city
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const studentRef = firestoreDoc(db, 'students', student.id);
            await updateDoc(studentRef, formData);
            onUpdate(formData);
            toast.success("Updated Successfully")
            onClose();
        } catch (error) {
            console.error('Error updating student: ', error);
        }
    };

    return (
        <div className="bg-white p-6 w-1/3 rounded-md">
            <h2 className="text-lg font-semibold mb-4">Edit Student</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block mb-1">Name:</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="border rounded-md p-2 w-full" />
                </div>
                <div className="mb-4">
                    <label htmlFor="nationality" className="block mb-1">Nationality:</label>
                    <input type="text" id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} className="border rounded-md p-2 w-full" />
                </div>
                <div className="mb-4">
                    <label htmlFor="city" className="block mb-1">City:</label>
                    <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className="border rounded-md p-2 w-full" />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-3 py-2 rounded-md">Update</button>
                <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 px-3 py-2 rounded-md ml-2">Cancel</button>
            </form>
        </div>
    );
};

export default EditStudents;
