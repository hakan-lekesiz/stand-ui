import { useState, useEffect, useContext, useCallback } from "react";
import { useStore } from '../../store/store';
import AuthContext from '../../store/auth-context';
import { ICurrentPage } from '../../models/ICurrentPage';
import { useParams, useNavigate } from "react-router-dom";
import { Box, Breadcrumbs, Typography, Link, Card, CardContent } from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import FileList from "../Files/List";
import FileAdd from "../Files/Add";


const Step2Folders = (props: any) => {
  const navigate = useNavigate();
  const authCtx: any = useContext(AuthContext);
  const [state, dispatch] = useStore();
  let { id } = useParams<"id">();

  const [fileListRefresher, setFileListRefresher] = useState<number>(0);
  const [tabberValue] = useState('2');

  useEffect(() => {

    const currentPage: ICurrentPage = {
      name: "Dosyalar"
    };
    dispatch('SET_CURRENT_PAGE', currentPage);

  }, []);

  const handleTabberChange = (event: any, newValue: string) => {

    if (newValue === "1") {
      if (authCtx.user.scopes.includes("seminar.update")) {
        navigate(state.globals.urls.educationEdit.replace(":id", id));
      }
      else {
        navigate(state.globals.urls.educationView.replace(":id", id));
      }
    }
    else if (newValue === "3") {
      navigate(state.globals.urls.educationNotes.replace(":id", id));
    }
     
  };

  let isAuth = authCtx.user.scopes.includes("seminar.viewAny") || authCtx.user.scopes.includes("seminar.update");

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="#" onClick={() => navigate(state.globals.urls.educations)}>
      Eğitimler
    </Link>,
    <Typography key="3" color="text.primary">
      Dosyalar
    </Typography>
  ];


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
            py: 2
          }}
        >

          <Card sx={{ mb: 2 }}>
            <Box sx={{ width: '100%', typography: 'body1' }}>
              <TabContext value={tabberValue}>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleTabberChange} aria-label="lab API tabs example">
                    <Tab label="Eğitim Düzenle" value="1" />
                    <Tab label="Dosyalar" value="2" />
                    <Tab label="Notlar" value="3" />
                  </TabList>
                </Box>

                <TabPanel value="1"></TabPanel>
                <TabPanel value="2">
                <CardContent>
                    <FileAdd fileable_type={"seminar"} setFileListRefresher={() => setFileListRefresher(fileListRefresher + 1)} />
                  </CardContent>
                </TabPanel>
                <TabPanel value="3">
                </TabPanel>
              </TabContext>
            </Box>
          </Card>

          <FileList fileListRefresher={fileListRefresher} fileable_type={"seminar"} />

        </Box>

      </>
    );

  }
};

export default Step2Folders;
