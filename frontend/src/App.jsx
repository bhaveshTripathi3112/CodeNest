import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./authSlice";
import Signup from './pages/Signup';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import ProblemsPage from './pages/ProblemsPage';
import LeaderboardPage from './pages/LeaderBoardPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import SolveProblemPage from './pages/SolveProblemPage';
function App() {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
   <>
    <Navbar/>
    <Routes>
      
      <Route path="/" element={<HomePage />} />
      <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <HomePage />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <Signup /> : <HomePage />}
        />


        {/*Authenticated Routes */}
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/problem/:id" element={<SolveProblemPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/leaderboards" element={<LeaderboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
    </Routes>
    

   </>
  )
}

export default App
