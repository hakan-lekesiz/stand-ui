import { useState, useEffect, useContext } from "react";
import { useStore } from '../../store/store';
import AuthContext from '../../store/auth-context';
import { ICurrentPage } from '../../models/ICurrentPage';
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardHeader, Divider, Container, Breadcrumbs, Typography, Link } from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CreateEditForm from "./CreateEditForm";
import Revisions from "../../components/Revisions/Revisions";


const CreateEdit = (props: any) => {
  const navigate = useNavigate();
  const authCtx: any = useContext(AuthContext);
  const [state, dispatch] = useStore();
  const [title, setTitle] = useState<string>("");
  const [tabberValue] = useState('1');
  let { id } = useParams<"id">();

  let isAuth = props.mode === "create" && authCtx.user.scopes.includes("seminar.create");
  isAuth = isAuth || props.mode === "edit" && authCtx.user.scopes.includes("seminar.update");
  isAuth = isAuth || props.mode === "view" && authCtx.user.scopes.includes("seminar.viewAny");

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="#" onClick={() => navigate(state.globals.urls.educations)}>
      Eğitimler
    </Link>,
    <Typography key="3" color="text.primary">
      {title}
    </Typography>
  ];

  useEffect(() => {
    var pTitle = "Eğitim Ekle";
    if (props.mode === "edit") {
      pTitle = "Eğitim Düzenle";
    }
    else if (props.mode === "view") {
      pTitle = "Eğitim Detayları";
    }

    setTitle(pTitle);

    const currentPage: ICurrentPage = {
      name: pTitle
    };
    dispatch('SET_CURRENT_PAGE', currentPage);


  }, []);

  const handleTabberChange = (event: any, newValue: string) => {

    if (newValue === "2") {
      navigate(state.globals.urls.educationFolders.replace(":id", id));
    }
    else if (newValue === "3") {
      navigate(state.globals.urls.educationNotes.replace(":id", id));
    }
   
  };

  if (!isAuth) {
    return (
      <div>
        <Breadcrumbs separator="-" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
        <div>
          Bu sayfaya giriş izniniz yok.
        </div>
      </div>
    );
  }
  else {
    return (
      <>
        <Breadcrumbs separator="-" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8
          }}
        >
          <Card>
            <Box sx={{ width: '100%', typography: 'body1' }}>
              <TabContext value={tabberValue}>
                {
                  !props.isModal &&
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>

                    <TabList onChange={handleTabberChange} aria-label="lab API tabs example">
                      <Tab label={props.mode === "edit" ? "Eğitim Düzenle" : "Eğitim Ekle"} value="1" />
                      <Tab label="Dosyalar" value="2" disabled={props.mode === "edit" || props.mode === "view" ? false : true} />
                      <Tab label="Notlar" value="3" disabled={props.mode === "edit" || props.mode === "view" ? false : true} />
                    </TabList>
                  </Box>
                }
                <TabPanel value="1">
                  <CardHeader
                    title="Eğitim Bilgileri"
                  />
                  <Divider />
                  <CreateEditForm mode={props.mode} />

                </TabPanel>
                <TabPanel value="2"></TabPanel>
                <TabPanel value="3"></TabPanel>
              </TabContext>
            </Box>
          </Card>

          {
            authCtx.user.scopes.includes("revision.view") && !props.isModal && props.mode !== "create" &&
            <Revisions model="seminar" id={id} />
          }
        </Box>
      </>
    );
  }
};

export default CreateEdit;
