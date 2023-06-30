import { Navigate, Route, Routes } from 'react-router-dom'
import AuthenticatePage from './pages/authenticate-page/AuthenticatePage'
import HomepageWrapper from './pages/home-page/HomepageWrapper'
import SignInPage from './pages/authenticate-page/SignInPage';
import SignUpPage from './pages/authenticate-page/SignUpPage';
import './reset.css';
import { auth } from './firebase/firebase-config';
import { routeName } from './constant/routes';
import { useEffect } from 'react';
import MainContentProjectList from './components/MainContent_ProjectList';
import MainContentProjectTaskList from './components/main-content-project-details/MainContent_ProjectTaskList';
import TaskDetail from './components/main-content-project-details/TaskDetail';
import { useAuthContext } from './constant/context-value';
import MainContentProjectDetails from './components/main-content-project-details/MainContent_ProjectDetails';
import ProjectSettings from './components/main-content-project-details/ProjectSettings';
import ManageProfile from './pages/manage-profile-page/ManageProfile';
function App() {

  const { setCurrentUser } = useAuthContext();
  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      if (!user) {
        setCurrentUser(null);
      }
    });
    return unSub;
  }, [setCurrentUser]);

  const { currentUser } = useAuthContext();

  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate to={routeName.authenticate} />} />
        <Route path={routeName.authenticate} element={<AuthenticatePage />}>
          <Route index element={currentUser ? <Navigate to={routeName.homePage} /> : <SignInPage />} />
          <Route path={routeName.signIn} element={currentUser ? <Navigate to={routeName.homePage} /> : <SignInPage />} />
          <Route path={routeName.signUp} element={currentUser ? <Navigate to={routeName.homePage} /> : <SignUpPage />} />
        </Route>
        <Route path={routeName.homePage} element={currentUser ? <HomepageWrapper /> : <Navigate to={routeName.signIn} />} >
          <Route index element={<Navigate to={routeName.projectList} />} />
          <Route path={routeName.projectList} element={<MainContentProjectList />} />
          <Route element={<MainContentProjectDetails />} path={'project/:projectID'}>
            <Route path={`taskList`} element={<MainContentProjectTaskList />} />
            <Route path={`task/:taskID`} element={<TaskDetail />} />
            <Route path={`projectSettings`} element={<ProjectSettings />} />
          </Route>
        </Route>
        <Route path={routeName.manageProfile} element={<ManageProfile />} />
      </Routes>
    </>
  )
}

export default App