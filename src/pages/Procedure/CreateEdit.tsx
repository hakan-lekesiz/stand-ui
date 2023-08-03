import { useState, useEffect, useContext } from "react";
import { useStore } from '../../store/store';
import AuthContext from '../../store/auth-context';
import { ICurrentPage } from '../../models/ICurrentPage';
import { useNavigate, useParams } from "react-router-dom"; 
import { Box,  Card,  CardHeader, Divider, Breadcrumbs,Typography,Link } from '@mui/material';
import CreateEditForm from "./CreateEditForm";
import Revisions from "../../components/Revisions/Revisions";


const CreateEdit = (props: any) => {
  const navigate = useNavigate();
  const authCtx: any = useContext(AuthContext);
  const [state, dispatch] = useStore();
  const [title, setTitle] = useState<string>("");
  let { id } = useParams<"id">();

  let isAuth = props.mode === "create" && authCtx.user.scopes.includes("procedure_definition.create");
  isAuth = isAuth || props.mode === "edit" && authCtx.user.scopes.includes("procedure_definition.update");
  isAuth = isAuth || props.mode === "view" && authCtx.user.scopes.includes("procedure_definition.viewAny");

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="#" onClick={() => navigate(state.globals.urls.procedures)}>
      Prosedürler
    </Link>,
    <Typography key="3" color="text.primary">
      {title}
    </Typography>
  ];

  useEffect(() => {
    var pTitle = "Prosedür Ekle";
    if (props.mode === "edit") {
      pTitle = "Prosedür Düzenle";
    }
    else if (props.mode === "view") {
      pTitle = "Prosedür Detayları";
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
                  title="Prosedür Bilgileri"
                />
                <Divider />
                <CreateEditForm mode={props.mode} />

              </Card>
              {
            authCtx.user.scopes.includes("revision.view") && !props.isModal && props.mode !== "create" &&
            <Revisions model="procedure" id={id} />
          }
        </Box>
      </>
    );
  }
};

export default CreateEdit;
