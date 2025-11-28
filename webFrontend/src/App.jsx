import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Import Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Core Components
import Home from './core/Home';

// User/Pages Components
import Signup from './user/Signup';
import Signin from './user/Signin';
import Profile from './user/Profile'; 
import AlumniDirectory from './user/AlumniDirectory'; 
import NewsEvents from './user/NewsEvents';
import DonationPage from './user/DonationPage';
import AboutAlumni from './user/AboutAlumni'; 
import EventDetails from './user/EventDetails';
import UserDetail from './components/UserDetail';

// Job Board Components
import JobBoard from './user/JobBoard'; 
import PostJob from './user/PostJob';  
import JobDetail from './user/JobDetail';  

import OrganizeEventPage from "./user/OrganizeEventPage";
import LeaderboardPage from "./user/LeaderboardPage";

// ✅ Authentication helper
const isAuthenticatedFunc = () => {
    const token = Cookies.get('token');
    return !!token;
};

// ✅ Private route wrapper
const PrivateRoute = ({ element: Element }) => {
    return isAuthenticatedFunc() ? Element : <Navigate to="/signin" />;
};

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuth = () => {
        const token = Cookies.get('token');
        setIsAuthenticated(!!token);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <Router>
            {/* Pass auth state to Navbar */}
            <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <main>
                <Routes>
                    {/* General Public Routes */}
                    <Route path='/' element={<Home />} />
                    <Route path='/about' element={<AboutAlumni />} /> 
                    <Route path='/alumnidirectory' element={<AlumniDirectory />} />
                    <Route path='/news&events' element={<NewsEvents />} />
                    <Route path='/donationpage' element={<DonationPage />} />
                    <Route path="/events/:id" element={<EventDetails />} />
                    <Route path="/userDetail/:id" element={<UserDetail />} />
                    
                    {/* Authentication Routes */}
                    <Route path='/signup' element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path='/signin' element={<Signin setIsAuthenticated={setIsAuthenticated} />} />

                    {/* Job Board Routes */}
                    <Route path='/jobs' element={<JobBoard />} /> 
                    <Route path='/job/:id' element={<JobDetail />} /> 
                    <Route path='/postjob' element={<PrivateRoute element={<PostJob />} />} />
                    
                    {/* Private/Protected Routes */}
                    <Route path='/profile' element={<PrivateRoute element={<Profile />} />} />

                    {/* Extra Pages */}
                    <Route path="/organize-event" element={<OrganizeEventPage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} /> 

                    {/* Fallback Route for 404 */}
                    <Route path='*' element={<Navigate to="/" />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
};

export default App;
