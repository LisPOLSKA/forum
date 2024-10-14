import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { useAuth } from '../../context/AuthContext'; // Adjust the import based on your project structure

const Logout = () => {
    const navigate = useNavigate(); // Use useNavigate for navigation
    const { logout } = useAuth(); // Destructure logout function from context

    useEffect(() => {
        const handleLogout = async () => {
            await logout(); // Call the logout function
            navigate('/login'); // Redirect to login page
        };

        handleLogout();
    }, [logout, navigate]); // Add navigate to dependencies

    return (
        <div>
            <h1>Logging out...</h1>
        </div>
    );
};

export default Logout;
