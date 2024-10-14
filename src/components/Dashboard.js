import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState('');
    const [userID, setUserID] = useState(null);
    const [modalContent, setModalContent] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Determine backend URL based on environment
    const backendUrl =
        process.env.REACT_APP_ENVIRONMENT === 'Prod' && process.env.REACT_APP_BACKEND_URL
            ? process.env.REACT_APP_BACKEND_URL
            : 'http://localhost:8080';

    // Fetch user ID on mount and load notes
    useEffect(() => {
        const loggedUserID = localStorage.getItem('userID');
        if (loggedUserID) {
            setUserID(loggedUserID);
            fetchNotes(loggedUserID);
        } else {
            window.location.href = '/'; 
        }
    }, []); 

    // Fetch notes from backend
    const fetchNotes = async (userID) => {
        try {
            const response = await fetch(`${backendUrl}/notes/${userID}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("Fetched notes:", data);
            setNotes(data || []);
        } catch (error) {
            console.error('Error fetching notes:', error);
            alert('Failed to fetch notes. Please try again later.');
        }
    };

    // Create a new note
    const createNote = async (e) => {
        e.preventDefault();
        const noteData = { user_id: userID, content };
        try {
            const response = await fetch(`${backendUrl}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(noteData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setContent('');
            fetchNotes(userID); 
        } catch (error) {
            console.error('Error creating note:', error);
            alert('Error creating note. Please try again.');
        }
    };

    // Delete a note
    const deleteNote = async (id) => {
        console.log("Attempting to delete note with ID:", id);
        if (!id) {
            console.error("Note ID is undefined!");
            alert("Note ID is missing. Cannot delete the note."); 
            return;
        }
        try {
            const response = await fetch(`${backendUrl}/notes/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            fetchNotes(userID); 
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Error deleting note. Please try again.');
        }
    };

    const openModal = (noteContent) => {
        setModalContent(noteContent);
        setShowModal(true);
    };

    // Close the modal
    const closeModal = () => {
        setShowModal(false);
        setModalContent('');
    };

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('userID'); 
        window.location.href = '/'; 
    };

    return (
        <div className="dashboard">
            <h2>NoteIt</h2>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            <form className="note-form" onSubmit={createNote}>
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write a note..."
                    required
                />
                <button type="submit">Add Note</button>
            </form>
            <div className="notes-list">
                <h3>Your Notes</h3>
                {Array.isArray(notes) && notes.length > 0 ? (
                    notes.map(note => (
                        <div key={note._id} className="note-card" onClick={() => openModal(note.content)}>
                            <span>{note.content}</span>
                            <button onClick={(e) => { e.stopPropagation(); deleteNote(note._id); }}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No notes found.</p>
                )}
            </div>

            {/* Modal for displaying the full note */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Note Details</h3>
                        <p>{modalContent}</p>
                        <button onClick={closeModal} className="close-button">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
