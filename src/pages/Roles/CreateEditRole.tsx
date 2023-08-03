import { useState, useEffect, useContext } from "react";
import { useStore } from '../../store/store';
import AuthContext from '../../store/auth-context';
import { ICurrentPage } from '../../models/ICurrentPage';
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardHeader, Divider, Container, Breadcrumbs, Typography, Link } from '@mui/material';
import CreateEditForm from "./CreateEditForm";
//import Revisions from "../../components/Revisions/Revisions";


const CreateEditRole = (props: any) => {
  const navigate = useNavigate();
  const authCtx: any = useContext(AuthContext);
  const [state, dispatch] = useStore();
  const [title, setTitle] = useState<string>("");
  let { id } = useParams<"id">();

  let isAuth = authCtx.user.scopes.includes("role.manage"); 

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="#" onClick={() => navigate(state.globals.urls.roles)}>
      Roller
    </Link>,
    <Typography key="3" color="text.primary">
      {title}
    </Typography>
  ];

  useEffect(() => {
    var pTitle = "Rol Ekle";
    if (props.mode === "edit") {
      pTitle = "Rol Düzenle";
    }
    else if (props.mode === "view") {
      pTitle = "Rol Detayları";
    }

    setTitle(pTitle);

    const currentPage: ICurrentPage = {
      name: pTitle
    };
    dispatch('SET_CURRENT_PAGE', currentPage);

  }, []);

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
            <CardHeader
              title="Kullanıcı Bilgileri"
            />
            <Divider />
            <CreateEditForm mode={props.mode} />

          </Card>

          {/* {
            authCtx.user.scopes.includes("revision.view") && !props.isModal && props.mode !== "create" &&
            <Revisions model="role" id={id} />
          } */}

        </Box>
      </>
    );
  }
};

export default CreateEditRole;
