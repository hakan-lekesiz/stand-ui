import LoginForm from './LoginForm';
import { useEffect } from "react";
import '../../components/Content/Styles/forms.scss';

const AuthPage = () => {

  useEffect(() => {
    document.title = "Giriş Yap";
  }, []);

  return <LoginForm />;
};

export default AuthPage;
