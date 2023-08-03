import { useContext, useEffect } from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import AuthPage from './pages/Login/AuthPage';
import ClientsPage from './pages/Clients/ClientsPage';
import UsersPage from './pages/Users/UsersPage';
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPassword/ResetPasswordPage';
import AuthContext from './store/auth-context';
import { useStore } from './store/store';
import CreateEditUser from './pages/Users/CreateEditUser';
import Step1CreateEdit from './pages/Clients/Step1CreateEdit';
import Step2Locations from './pages/Clients/Step2Locations';
import Step3Folders from './pages/Clients/Step3Folders';
import Step4Notes from './pages/Clients/Step4Notes';
import EducationsPage from './pages/Education/EducationsPage';
import CreateEditEducation from './pages/Education/CreateEdit';
import ProceduresPage from './pages/Procedure/ProceduresPage';
import CreateEditProcedure from './pages/Procedure/CreateEdit';
import RolesPage from './pages/Roles/RolesPage';
import CreateEditRole from './pages/Roles/CreateEditRole';
import FileList from './pages/Files/List';
import NoteList from './pages/Notes/List';
import Step2Folders from './pages/Education/Step2Folders';
import Step3Notes from './pages/Education/Step3Notes';

function App() {
  const authCtx = useContext(AuthContext);
  const [state, dispatch] = useStore();

  useEffect(() => {
    if (authCtx.isLoggedIn) {
      dispatch('GET_CONSULTANT');
      dispatch('GET_USER_ROLES');
      dispatch('GET_USER_TYPES');
      dispatch('GET_LOCATION_TYPES');
      dispatch('GET_CITIES');
      dispatch('GET_SEMINAR_STATUS_OPTIONS');
      dispatch('GET_SEMINAR_SUBJECT_OPTIONS');
      dispatch('GET_ACCREDITATIONS');
      dispatch('GET_STANDARTS');
      dispatch('GET_FILE_TYPES');
      
    }
  }, [authCtx.isLoggedIn]);
 
  return (
    <>
      {
        authCtx.isLoggedIn ?
          (
            <Layout>
              <Routes>
                <Route path="/" element={<ClientsPage />} />
                <Route path={state.globals.urls.clients} element={<ClientsPage />} />
                <Route path={state.globals.urls.users} element={<UsersPage />} />
                <Route path={state.globals.urls.userCreate} element={<CreateEditUser mode="create" />} />
                <Route path={state.globals.urls.userEdit} element={<CreateEditUser mode="edit" />} />
                <Route path={state.globals.urls.userView} element={<CreateEditUser mode="view" />} />

                <Route path={state.globals.urls.roles} element={<RolesPage />} />
                <Route path={state.globals.urls.roleCreate} element={<CreateEditRole mode="create" />} />
                <Route path={state.globals.urls.roleEdit} element={<CreateEditRole mode="edit" />} />
                <Route path={state.globals.urls.roleView} element={<CreateEditRole mode="view" />} />

                <Route path={state.globals.urls.clientCreate} element={<Step1CreateEdit mode="create" isModal={false} />} />
                <Route path={state.globals.urls.clientEdit} element={<Step1CreateEdit mode="edit" isModal={false}  />} />
                <Route path={state.globals.urls.clientView} element={<Step1CreateEdit mode="view" isModal={false}  />} />
                <Route path={state.globals.urls.clientLocations} element={<Step2Locations />} />
                <Route path={state.globals.urls.clientFolders} element={<Step3Folders />} />
                <Route path={state.globals.urls.clientNotes} element={<Step4Notes />} />

                <Route path={state.globals.urls.educations} element={<EducationsPage />} />
                <Route path={state.globals.urls.educationCreate} element={<CreateEditEducation mode="create" />} />
                <Route path={state.globals.urls.educationEdit} element={<CreateEditEducation mode="edit" />} />
                <Route path={state.globals.urls.educationView} element={<CreateEditEducation mode="view" />} />
                <Route path={state.globals.urls.educationFolders} element={<Step2Folders/>} />
                <Route path={state.globals.urls.educationNotes} element={<Step3Notes />} />

                <Route path={state.globals.urls.procedures} element={<ProceduresPage />} />
                <Route path={state.globals.urls.procedureCreate} element={<CreateEditProcedure mode="create" />} />
                <Route path={state.globals.urls.procedureEdit} element={<CreateEditProcedure mode="edit" />} />
                <Route path={state.globals.urls.procedureView} element={<CreateEditProcedure mode="view" />} />

                <Route path={state.globals.urls.files} element={<FileList />} />
                <Route path={state.globals.urls.notes} element={<NoteList />} />

                <Route path="*" element={<Navigate to='/' />} />
              </Routes>
            </Layout>
          ) : (
            <Routes>
              <Route path={state.globals.urls.login} element={<AuthPage />} />
              <Route path={state.globals.urls.forgotPassword} element={<ForgotPasswordPage />} />
              <Route path={state.globals.urls.resetPassword} element={<ResetPasswordPage />} />
              <Route path="*" element={<Navigate to={state.globals.urls.login} />} />
            </Routes>
          )

      }
    </>
  );
}

export default App;
