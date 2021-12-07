import { useAuth0 } from '@auth0/auth0-react';
import { Browser } from '@capacitor/browser';
import { IonButton } from '@ionic/react';
import { logoutUri } from '../../auth0.config';
import logOut from '../../utils/logOut';

const LoginButton: React.FC = () => {
  const { buildLogoutUrl, buildAuthorizeUrl, logout } = useAuth0();

  const login = async () => {
    // Ask auth0-react to build the login URL
    logOut(Browser, buildLogoutUrl, logout, logoutUri);
    const url = await buildAuthorizeUrl();

    // Redirect using Capacitor's Browser plugin
    await Browser.open({ url });
  };

  return <IonButton onClick={login}>Log in</IonButton>;
};

export default LoginButton;
