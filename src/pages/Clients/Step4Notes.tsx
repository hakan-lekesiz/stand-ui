import { useState, useEffect, useContext } from "react";
import { useStore } from '../../store/store';
import AuthContext from '../../store/auth-context';
import { useParams, useNavigate } from "react-router-dom";
import { Box, Breadcrumbs, Typography, Link, Card } from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import NoteList from "../Notes/List";

const Step4Notes = (props: any) => {
  const navigate = useNavigate();
  const authCtx: any = useContext(AuthContext);
  const [state] = useStore();
  let { id } = useParams<"id">();
  const [tabberValue] = useState('4');

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
    else if (newValue === "3") {
      navigate(state.globals.urls.clientFolders.replace(":id", id));
    }

  };

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="#" onClick={() => navigate(state.globals.urls.clients)}>
      Müşteriler
    </Link>,
    <Typography key="3" color="text.primary">
      Notlar
    </Typography>
  ];

  return (
    <>
      {
        !props.isModal &&
        <Breadcrumbs separator="-" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
      }

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
              {
                !props.isModal &&
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleTabberChange} aria-label="lab API tabs example">
                    <Tab label="Müşteri Düzenle" value="1" />
                    <Tab label="Lokasyon" value="2" />
                    <Tab label="Dosyalar" value="3" />
                    <Tab label="Notlar" value="4" />
                  </TabList>
                </Box>
              }

              <TabPanel value="1"></TabPanel>
              <TabPanel value="2"></TabPanel>
              <TabPanel value="3"></TabPanel>
              <TabPanel value="4">

                <NoteList notable_type={"client"}/>

              </TabPanel>
            </TabContext>
          </Box>
        </Card>

      </Box>

    </>
  );

};

export default Step4Notes;
