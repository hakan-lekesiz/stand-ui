import ListItem from '@mui/material/ListItem';
import { ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import FolderIcon from '@mui/icons-material/Folder';
import NoteIcon from '@mui/icons-material/Note';
import SchoolIcon from '@mui/icons-material/School';
import Assignment from '@mui/icons-material/Assignment';
import { useStore } from '../../store/store';
import { useNavigate } from 'react-router-dom';

const MainListItems = () => {
  const [state] = useStore();
  const navigate = useNavigate();

  return (
    <div>

      <ListItem button onClick={() => navigate(state.globals.urls.clients)}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Müşteriler" />
      </ListItem>

      <ListItem button onClick={() => navigate(state.globals.urls.users)}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Yetkililer" />
      </ListItem>

      <ListItem button onClick={() => navigate(state.globals.urls.roles)}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Roller" />
      </ListItem>

      <ListItem button onClick={() => navigate(state.globals.urls.educations)}>
        <ListItemIcon>
          <SchoolIcon />
        </ListItemIcon>
        <ListItemText primary="Eğitimler" />
      </ListItem>

      <ListItem button onClick={() => navigate(state.globals.urls.procedures)}>
        <ListItemIcon>
          <Assignment />
        </ListItemIcon>
        <ListItemText primary="Prosedür Tanımları" />
      </ListItem>
      <ListItem button onClick={() => navigate(state.globals.urls.procedures)}>
        <ListItemIcon>
          <Assignment />
        </ListItemIcon>
        <ListItemText primary="Prosedürler" />
      </ListItem>

      <ListItem button onClick={() => navigate(state.globals.urls.files)}>
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText primary="Dosyalar" />
      </ListItem>
     
      <ListItem button onClick={() => navigate(state.globals.urls.notes)}>
        <ListItemIcon>
          <NoteIcon />
        </ListItemIcon>
        <ListItemText primary="Notlar" />
      </ListItem>

    </div>
  );
};

export default MainListItems;
