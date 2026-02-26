import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginScreen from './Screens/LoginScreen/LoginScreen'
import RegisterScreen from './Screens/RegisterScreen/RegisterScreen'
import AuthContextProvider from './Context/AuthContext'
import AuthMiddleware from './Middlewares/AuthMiddleware'
import WorkspaceContextProvider from './Context/WorkspaceContext'
import HomeScreen from './Screens/HomeScreen/HomeScreen'
import CreateWorkspaceScreen from './Screens/CreateWorkspaceScreen/CreateWorkspaceScreen'
import WorkspaceDetailScreen from './Screens/WorkspaceDetailScreen/WorkspaceDetailScreen'
import ChannelMessagesScreen from './Screens/ChannelMessagesScreen/ChannelMessagesScreen'
import "./global.css";

function App() {


  return (
    <div className="container">
    <AuthContextProvider>
      <Routes>
        <Route path='/' element={<LoginScreen />} />
        <Route path='/register' element={<RegisterScreen />} />
        <Route path='/login' element={<LoginScreen />} />
        <Route element={<AuthMiddleware />}>
          <Route path='/home' element={
            <WorkspaceContextProvider>
              <HomeScreen />
            </WorkspaceContextProvider>
          } />
          <Route path='/create-workspace' element={<CreateWorkspaceScreen />} />
          <Route path='/workspace/:workspace_id' element={<WorkspaceDetailScreen />} />
          <Route path='/workspace/:workspace_id/channels/:channel_id' element={<ChannelMessagesScreen />} />
        </Route>
      </Routes>
    </AuthContextProvider>
    </div>
  )
}

export default App