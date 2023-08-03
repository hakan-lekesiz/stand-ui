import ForgotPassword from "./ForgotPassword";
import { useEffect } from "react";
import '../../components/Content/Styles/forms.scss';

 

const ForgotPasswordPage = () => {

  useEffect(() => {
    document.title = "Şifremi Unuttum";
  }, []);

  return <ForgotPassword />;
};

export default ForgotPasswordPage;
