import { useState, useEffect, useContext, useCallback } from "react";
import { useStore } from '../../store/store';
import AuthContext from '../../store/auth-context';
import useInput from '../../store/use-input';
import { useParams } from "react-router-dom";
import {
  Box, Snackbar, Grid, InputLabel, FormHelperText, MenuItem, Select, Button, CircularProgress, FormControlLabel, Checkbox
} from '@mui/material';
import { useDropzone } from 'react-dropzone'

const FileAdd = (props: any) => {
  const authCtx: any = useContext(AuthContext);
  const [state, dispatch] = useStore();
  const [isFormSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState<boolean>(false);
  const [file, setFile] = useState<any>(null);
  const [is_private, setIs_private] = useState<boolean>(false);
  const [can_client_see, setCan_client_see] = useState<boolean>(false);
  let { id } = useParams<"id">();

  useEffect(() => {

    if (state.globals.formDatas.fileTypeOption.length > 0) {
      setShowSpinner(false);
    }
    else {
      setTimeout(() => {
        dispatch('SET_UPDATE');
      }, 1000);
    }


  }, [state]);

  const {
    value: file_type_id_Value,
    isValid: file_type_id_IsValid,
    isTouched: file_type_id_IsTouched,
    validReason: file_type_id_ValidReason,
    hasError: file_type_id_HasError,
    valueChangeHandler: file_type_id_ChangeHandler,
    inputBlurHandler: file_type_id_BlurHandler,
    reset: reset_file_type_id,
  } = useInput(["required"]);

  let formIsValid = false;

  if (file_type_id_IsValid && file !== null) {
    formIsValid = true;

  }

  const submitHandler = async (event: any) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!formIsValid) {
      return;
    }


    let formData = new FormData();
    formData.append('fileable_type', props.fileable_type);
    formData.append('fileable_id', id ? id : "");
    formData.append('file_type_id', file_type_id_Value);
    formData.append('file', file);
    formData.append('is_private', is_private ? "1" : "0");
    formData.append('can_client_see', can_client_see ? "1" : "0");

    const options = {
      method: 'POST',
      body: formData,
    };
    setShowLoadingSpinner(true);

    const result: any = await fetch(state.globals.routes.file, options)
    const resData = await result.json();

    setShowLoadingSpinner(false);

    if (result.ok) {
      setFormSubmitted(false);
      reset_file_type_id();
      setFile(null);
      props.setFileListRefresher();

    }
    else {
      setErrorMessage(resData.message);
      setShowError(true);
    }
  };

  const onDrop = useCallback(acceptedFiles => {

    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
    else {
      setErrorMessage("En fazla 1 dosya seçilmeli");
      setShowError(true);
    }
    // Do something with the files
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 })


  if (!showSpinner) {
    return (
      <>
        <Box component="form" noValidate sx={{ display: "flex", alignItems: "center" }}>


          <Grid xs={2} sx={{ position: "relative", maxWidth: 300, width: 300, marginRight: "20px" }}>
            <div className={isFormSubmitted && file === null ? "f-dropzone error" : "f-dropzone"}{...getRootProps()}>
              <input {...getInputProps()} />
              {
                file === null &&
                (isDragActive ?
                  <p>Dosyayı buraya bırak ...</p> :
                  <p>Dosyayı buraya bırak yada seçim yapmak için tıklayın</p>
                )
              }

            </div>
            {
              file !== null &&
              <div className="acceptedFile">
                <p>
                  {file.name}
                </p>
                <a href="#!" onClick={() => setFile(null)}>
                  Sil
                </a>
              </div>
            }
          </Grid>

          <Grid xs={2}>

            <InputLabel>Dosya Türü</InputLabel>
            <Select sx={{ width: "100%" }}
              id="user_type"
              name="user_type"
              value={file_type_id_Value}
              onChange={file_type_id_ChangeHandler}
              onBlur={file_type_id_BlurHandler}
              className={(isFormSubmitted && file_type_id_HasError) ? "has-error" : ""}

            >

              {
                state.globals.formDatas.fileTypeOption.map((item: any) => {

                  return (
                    <MenuItem key={"fileTypeOption_" + item.id} value={item.id.toString()}>{item.title}</MenuItem>
                  )
                })

              }

            </Select>
            {isFormSubmitted && file_type_id_HasError && <div><FormHelperText error={true}>{file_type_id_ValidReason}</FormHelperText></div>}


          </Grid>
          <Grid xs={2} sx={{ position: "relative", maxWidth: 200, width: 200, marginLeft: "20px" }}>

            <FormControlLabel control={
              <Checkbox defaultChecked
                onChange={(e: any) => setIs_private(e.target.checked)}
                checked={is_private} />
            } label="Özel Döküman" />
            <FormControlLabel control={<Checkbox defaultChecked
              onChange={(e: any) => setCan_client_see(e.target.checked)}
              checked={can_client_see} />} label="Müşteri Görebilir" />

          </Grid>
          {
            !showLoadingSpinner &&
            <Grid xs={2}>
              <Box
                sx={{
                  p: 2,
                  pb: 0
                }}
              >
                {
                  authCtx.user.scopes.includes("client.update") &&
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={submitHandler}
                  >
                    EKLE
                  </Button>
                }
              </Box>
            </Grid>
          }
          {
            showLoadingSpinner &&
            <Grid xs={2}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            </Grid>
          }

        </Box>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={showError}
          onClose={() => setShowError(false)}
          message={errorMessage}
          key={'bottom' + 'right'}
        />
      </>
    );
  }
  else {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

};

export default FileAdd;
