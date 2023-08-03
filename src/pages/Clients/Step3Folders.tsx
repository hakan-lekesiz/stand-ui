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


const Step3Folders = (props: any) => {
  const navigate = useNavigate();
  const authCtx: any = useContext(AuthContext);
  const [state, dispatch] = useStore();
  let { id } = useParams<"id">();

  const [fileListRefresher, setFileListRefresher] = useState<number>(0);
  const [tabberValue] = useState('3');

  useEffect(() => {

    const currentPage: ICurrentPage = {
      name: "Dosyalar"
    };
    dispatch('SET_CURRENT_PAGE', currentPage);

  }, []);

  const handleTabberChange = (event: any, newValue: string) => {

    if (newValue === "1") {
      if (authCtx.user.scopes.includes("client.update")) {
        navigate(state.globals.urls.clientEdit.replace(":id", id));
      }
      else {
        navigate(state.globals.urls.clientView.replace(":id", id));
      }
    }
    else if (newValue === "2") {
      navigate(state.globals.urls.clientLocations.replace(":id", id));
    }
    else if (newValue === "4") {
      navigate(state.globals.urls.clientNotes.replace(":id", id));
    }
  };

  let isAuth = authCtx.user.scopes.includes("client.viewAny") || authCtx.user.scopes.includes("client.update");

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="#" onClick={() => navigate(state.globals.urls.clients)}>
      Müşteriler
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
                    <Tab label="Müşteri Düzenle" value="1" />
                    <Tab label="Lokasyon" value="2" />
                    <Tab label="Dosyalar" value="3" />
                    <Tab label="Notlar" value="4" />
                  </TabList>
                </Box>

                <TabPanel value="1"></TabPanel>
                <TabPanel value="2"></TabPanel>
                <TabPanel value="3">
                  <CardContent>
                    <FileAdd fileable_type={"client"} setFileListRefresher={() => setFileListRefresher(fileListRefresher + 1)} />
                  </CardContent>

                </TabPanel>
                <TabPanel value="4"></TabPanel>
              </TabContext>
            </Box>
          </Card>

          <FileList fileListRefresher={fileListRefresher} fileable_type={"client"} />

        </Box>

      </>
    );

  }
};

export default Step3Folders;
