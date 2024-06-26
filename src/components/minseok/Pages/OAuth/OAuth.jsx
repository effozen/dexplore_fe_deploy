import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useCookies} from "react-cookie";

const OAuth = () => {
    const { token, expirationTime} = useParams();
    const [cookie, setCookie] = useCookies();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || !expirationTime) return;

        const now = (new Date().getTime()) * 1000; //ms
        const expires = new Date(now + Number(expirationTime));

        setCookie('accessToken', token, {expires, path: '/'});
        navigate('/auth/sign-in');
    }, [token]);

    return (
        <>for oauth cookie</>
    )
}

export default OAuth;