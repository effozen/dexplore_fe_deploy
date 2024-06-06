import React, { useState } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import Modal from 'react-modal';
import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

// 이미지 파일 임포트
import menuIcon from '@assets/images/Togglebtn/menu.png';
import ideaIcon from '@assets/images/Togglebtn/Tip.png';
import logoutIcon from '@assets/images/Togglebtn/Logout.png';
import cancelIcon from '@assets/images/Togglebtn/Cancel.png';
import QRCodebtn from '@assets/images/Togglebtn/QRCodeScan.png';
import {requestGet} from "@lib/network/network";

const GlobalStyle = createGlobalStyle`
    body, html {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
    }
`;

const fadeInUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const Container = styled.div`
    position: fixed;
    bottom: 20px; 
    right: 20px;
    //display: flex;
    //flex-direction: column;
    //align-items: center;
`;

const Button = styled.button`
    background-color: transparent;
    border: none;
    margin: 10px 0;
    cursor: pointer;
`;

const ExpandedMenu = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    //position: absolute;
    bottom: 70px;
    animation: ${fadeInUp} 0.3s ease-out forwards;
`;

Modal.setAppElement('#root'); // Ensure this is your root element

const ToggleButton = ({ museumId }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);
    const navigate = useNavigate();

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleLogout = () => {
        removeCookie('accessToken');
        alert('로그아웃 완료');
        navigate('/auth/sign-in');
    }

    const handleScan = (result) => {
        if (result) {
            console.log('QR Code Data:', result);
            getArtId(result);
            handleCloseModal();
        }
    };

    const getArtId = async (qrcodeHashkey) => {
        const token = cookies.accessToken;

        if (!token) {
            console.error('Access token is not available.');
            return;
        }

        const headers = {
            Authorization: `Bearer ${token}`
        };

        const params = { qrcodeHashKey: qrcodeHashkey };

        try {
            const result = await axios.get('https://dexplore.info/api/v1/user/get-art-by-hash', { headers, params });
            const artId = result.data.art.artId;
            navigate('/user/art/info', { state: { museumId, artId } });
        } catch (error) {
            console.error('Error fetching art ID:', error);
        }
    };

    return (
        <>
            {/*<GlobalStyle />*/}
            <Container>
                {isExpanded && (
                    <ExpandedMenu>
                        <Button onClick={handleToggle}>
                            <img src={ideaIcon} alt="idea" />
                        </Button>
                        <Button onClick={handleLogout}>
                            <img src={logoutIcon} alt="logout"/>
                        </Button>
                        <Button onClick={handleOpenModal}>
                            <img src={QRCodebtn} alt="qr code scan" />
                        </Button>
                    </ExpandedMenu>
                )}
                <Button onClick={handleToggle}>
                    <img src={isExpanded ? cancelIcon : menuIcon} alt="menu" />
                </Button>
            </Container>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                style={{
                    content: {
                        width: '256px',
                        height: '256px',
                        margin: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        inset: '50% auto auto 50%',
                        transform: 'translate(-50%, -50%)',
                    },
                }}
            >
                {/* <Scanner */}
                {/*     onResult={(text, result) => { */}
                {/*         console.log(text, result); */}
                {/*         // getArtId(text); */}
                {/*     }} */}
                {/*     onError={(error) => console.log(error?.message)} */}
                {/* /> */}

                <Scanner
                    onScan={(result => {
                        // console.log(result);
                        requestGet('https://dexplore.info/api/v1/user', {qrcodeHashKey:result.rawValue}).then(v => {
                            if(v.art) {
                                navigate('/user/art/info', {state:{artId:v.art.artId}});
                            }
                        }).catch((e) => {
                            console.error(e);
                            window.alert('작품 QR이 아닙니다.');
                        })
                    })}
                >

                </Scanner>
            </Modal>
        </>
    );
};

export default ToggleButton;