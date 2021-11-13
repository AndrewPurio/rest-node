import { FC, useEffect, useState } from "react"

import { isPlatform } from "@ionic/react";
import { serviceListener } from "../../utils/serviceAddress";
import { Zeroconf } from "@ionic-native/zeroconf";
import { useAuth0 } from "@auth0/auth0-react";
import { Browser } from "@capacitor/browser";
import { App as CapApp } from '@capacitor/app';

import DarkModeContext from './darkMode';
import LoadingContext from './loadingContext';

import UserContext from '../UserContext/userContext';
import TargetAddressContext from '../NetworkContext/targetAddress';

import toggleDarkMode from "../../utils/toggleDarkMode";

const AppContext: FC = ({ children }) => {
    const loadingState = useState<boolean>(false);
    const darkModeState = useState<boolean>(false);
    const targetAddressState = useState<string>("");

    const [darkMode, setDarkMode] = darkModeState;
    const [, setTargetAddress] = targetAddressState

    const { user, handleRedirectCallback } = useAuth0();

    const handleRedirect: (params: { url: string }) => void = async ({ url }) => {
        const stateIncluded = url.includes('state');
        const codeIncluded = url.includes('code');
        const errorIncluded = url.includes('error');

        if (stateIncluded && (codeIncluded || errorIncluded))
            await handleRedirectCallback(url);

        await Browser.close();
    };

    useEffect(() => {
        CapApp.addListener('appUrlOpen', handleRedirect);
    }, [handleRedirectCallback]);

    useEffect(() => {
        if (isPlatform('android'))
            serviceListener(Zeroconf, setTargetAddress);

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

        toggleDarkMode(document, prefersDark.matches);
        setDarkMode(prefersDark.matches);
    }, []);

    useEffect(() => {
        toggleDarkMode(document, darkMode);
    }, [darkMode]);

    return (
        <DarkModeContext.Provider value={darkModeState}>
            <UserContext.Provider value={user}>
                <LoadingContext.Provider value={loadingState}>
                    <TargetAddressContext.Provider value={targetAddressState}>
                        {children}
                    </TargetAddressContext.Provider>
                </LoadingContext.Provider>
            </UserContext.Provider>
        </DarkModeContext.Provider>
    )
}

export default AppContext
