'use client';

import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, doc as firestoreDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { db } from '@/FirebaseConfig/firebase';
import Sidebar from './Sidebar';
import EditStudents from './EditStudents'; // Import the EditStudent component
import toast, { Toaster } from 'react-hot-toast';


const Students = () => {
    const [studentRecords, setStudentRecords] = useState([]);
    const [pageSize] = useState(10); // Number of records per page
    const [currentPage, setCurrentPage] = useState(1); // Current page number
    const [totalPages, setTotalPages] = useState(1); // Total number of pages
    const [editID, setEditID] = useState(null); // ID of the student being edited
    const [showEditModal, setShowEditModal] = useState(false); 

    useEffect(() => {
        fetchStudentRecords();
    }, [currentPage]); 

   
    const fetchStudentRecords = async () => {
        const recordsSnapshot = await getDocs(collection(db, 'students'));
        const newStudentRecords = [];
        recordsSnapshot.forEach((doc) => {
            newStudentRecords.push({ id: doc.id, ...doc.data() });
        });
        setStudentRecords(newStudentRecords);

        // Calculate the total number of pages
        const totalRecords = newStudentRecords.length;
        const totalPages = Math.ceil(totalRecords / pageSize);
        setTotalPages(totalPages);
    };

    const handleFileUpload = async (event) => {
      const csvFile = event.target.files[0];
      const csvData = await csvFile.text();
      const records = csvData.split('\n').map((row, index) => {
          if (index === 0) {
              return null;
          }
          const fields = row.split(',');
          return {
              name: fields[0],
              nationality: fields[1],
              city: fields[2]
          };
      });
  
      const validRecords = records.filter((record) => record !== null);
      for (const record of validRecords) {
          try {
              await addDoc(collection(db, 'students'), record);
          } catch (error) {
              console.error('Error adding document: ', error);
          }
      }
  
      toast.success('CSV data uploaded to Firebase Firestore successfully');
  
      // After uploading, fetch the updated student records
      fetchStudentRecords();
  };
  

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
        head: [['Name', 'Nationality', 'City']],
        body: studentRecords.map(student => [student.name, student.nationality, student.city])
    });
    doc.save('student.pdf');
};


    const changeStatus = (id) => {
        setPopup(true);
        setEditID(id);
    };

    const onDelete = async (id) => {
        try {
            await deleteDoc(firestoreDoc(db, 'students', id));
            setStudentRecords((prevRecords) => prevRecords.filter((student) => student.id !== id));

            toast.success('Student deleted successfully');
        } catch (error) {
            console.error(error);
            toast.error('Error deleting Student');
        }
    };

    const handleEdit = (id) => {
      setEditID(id);
      setShowEditModal(true);
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditID(null);
};

const handleUpdateStudent = (updatedData) => {
  setStudentRecords((prevRecords) =>
      prevRecords.map((student) =>
          student.id === editID ? { ...student, ...updatedData } : student
      )
  );
};
    const onPageChange = (page) => {
      setCurrentPage(page);
  };

  return (
    <div className="flex">
        <Sidebar />
        <div className="w-full md:pl-56 md:px-24 flex flex-col gap-5">
            {/* Header */}
            <div className="px-5 text-2xl font-semibold pb-5 text-white">Students</div>
            <div className="flex justify-between items-center px-5">
                {/* Input for CSV file upload */}
                <input type="file" id="csv-file" onChange={handleFileUpload} />
                {/* Button to trigger data upload to Firebase */}
                <button className="bg-blue-500 text-white px-3 py-2 rounded-md" onClick={handleFileUpload}>Upload to Firebase</button>
                <button className="bg-green-500 text-white px-3 py-2 rounded-md" onClick={exportToPDF}>Export to PDF</button>
            </div>
            
            <div className="overflow-x-auto px-5">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white rounded-lg shadow-sm text-sm">
                    {/* Table headings */}
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Nationality</th>
                            <th>City</th>
                            <th>Action</th> {/* New column for edit and delete buttons */}
                        </tr>
                    </thead>
                    {/* Table body */}
                    <tbody className="divide-y divide-gray-200">
                        {/* Displaying student records for the current page */}
                        {studentRecords
                            .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                            .map((student, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{student.nationality}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{student.city}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {/* Edit button */}
                                        <button className="text-blue-600 hover:text-blue-900 mr-2" onClick={() => handleEdit(student.id)}>Edit</button>
                                        {/* Delete button */}
                                        <button className="text-red-600 hover:text-red-900" onClick={() => onDelete(student.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination component */}
            <div className="flex justify-center mt-4">
                <Pagination
                    current={currentPage}
                    total={studentRecords.length}
                    pageSize={pageSize}
                    onChange={onPageChange}
                />
            </div>
            {/* Button to export student records to PDF */}
          
        </div>
        {/* Edit student modal */}
        {showEditModal && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                <EditStudents
                    student={studentRecords.find((student) => student.id === editID)}
                    onClose={handleCloseEditModal}
                    onUpdate={handleUpdateStudent}
                />
            </div>
        )}
        <Toaster/>
    </div>
);
};

export default Students;