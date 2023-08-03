import ResetPassword from "./ResetPassword";
import { useEffect } from "react";
import '../../components/Content/Styles/forms.scss';
 

const ResetPasswordPage = () => {

  useEffect(() => {
    document.title = "Şifremi Yenile";
  }, []);

  return <ResetPassword />;
};

export default ResetPasswordPage;
