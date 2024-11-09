import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthContext, { AuthProvider } from "./AuthContext";
import ProtectedWrapper from "./ProtectedWrapper";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import NoPageFound from "./pages/NoPageFound";
import Layout from "./components/Layout";
import Sales from "./pages/Sales";
import Stockin from "./pages/stockin";
import StockReport from "./pages/sock_report";
import YouthManagement from "./pages/youth";
import YouthAttendance from "./pages/Attendance";
import AttendanceList from "./pages/AttendanceList";
import BankList from './components/BankList';
import SchoolList from './components/SchoolList';
import StudentList from './components/StudentList';
import MessagingPage from './pages/MessagingPage';
import TYouthAttendance from './pages/youthattendance'
import TYouthAttendanceList from './pages/youthattendancelist'
import Layout_pcd from "./components/Layout_pcd";
import CompassionPage from "./pages/compassion";
import UserPage from './pages/UserPage';
import Teacher from "./pages/teacher";


const App = () => {
    const [user, setUser] = useState(null);
    const [loader, setLoader] = useState(true);
    
    useEffect(() => {
        const myLoginUser = JSON.parse(localStorage.getItem("user"));
        if (myLoginUser) {
            setUser(myLoginUser);
        }
        setLoader(false);
    }, []);

    const value = { user, signin: setUser, signout: () => { setUser(null); localStorage.removeItem("user"); } };

    if (loader) {
        return (
            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <h1>LOADING...</h1>
            </div>
        );
    }

    return (
        <AuthProvider>
            <BrowserRouter>
            <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                        path="/" 
                        element={
                            <ProtectedWrapper allowedRoles={['pd', 'pcd', 'teacher', 'burser', 'auditor']}>
                                <Layout_pcd />
                            </ProtectedWrapper>
                        }
                    >
                        <Route index element={<Dashboard />} />

                         <Route path="stockreport" element={
                            <ProtectedWrapper allowedRoles={['pd','auditor']}>
                                <StockReport />
                            </ProtectedWrapper>
                        } /> 

                        <Route path="inventory" element={
                            <ProtectedWrapper allowedRoles={['burser']}>
                                <Inventory />
                            </ProtectedWrapper>
                        } />

                           <Route path="stockin" element={
                            <ProtectedWrapper allowedRoles={['burser']}>
                                <Stockin />
                            </ProtectedWrapper>
                        } />

                             <Route path="sales" element={
                            <ProtectedWrapper allowedRoles={['burser']}>
                                <Sales />
                            </ProtectedWrapper>
                        } />
                        <Route path="manage-youth" element={
                            <ProtectedWrapper allowedRoles={['pd', 'pcd']}>
                                <YouthManagement />
                            </ProtectedWrapper>
                        } />
                        <Route path="addattendance" element={
                            <ProtectedWrapper allowedRoles={['pcd']}>
                                <YouthAttendance />
                            </ProtectedWrapper>
                        } />
                        <Route path="attendancelist" element={
                            <ProtectedWrapper allowedRoles={['pcd', 'pd','auditor']}>
                                <AttendanceList />
                            </ProtectedWrapper>
                        } />


                        
                        <Route path="compassion" element={
                            <ProtectedWrapper allowedRoles={['auditor']}>
                                <CompassionPage />
                            </ProtectedWrapper>
                        } />
                        <Route path="teacher" element={
                            <ProtectedWrapper allowedRoles={['pcd']}>
                                <Teacher />
                            </ProtectedWrapper>
                        } />

                        <Route path="schoolfees" element={
                            <ProtectedWrapper allowedRoles={['burser']}>
                                <BankList />
                            </ProtectedWrapper>
                        } />

                        

                         <Route path="users" element={
                            <ProtectedWrapper allowedRoles={['auditor']}>
                                <UserPage />
                            </ProtectedWrapper>
                        } />


                        <Route path="tyouthaddattendance" element={<TYouthAttendance />} />
                        <Route path="teacherattendance" element={<TYouthAttendanceList />} />
                        <Route path="messages" element={
                            <ProtectedWrapper allowedRoles={['pd', 'pcd', 'burser', 'auditor']}>
                        <MessagingPage />
                        </ ProtectedWrapper>} />
                        <Route path="banks/:bankId" element={<SchoolList />} />
                        <Route path="banks/:bankId/schools/:schoolId" element={<StudentList />} />
                    </Route>
                    <Route path="*" element={<NoPageFound />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
