import React, { useState } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import Modal from 'react-modal';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Joyride from 'react-joyride';

// 이미지 파일 임포트
import menuIcon from '@assets/images/Togglebtn/menu.png';
import hintIcon from '@assets/images/Togglebtn/Tip.png';
import logoutIcon from '@assets/images/Togglebtn/Logout.png';
import cancelIcon from '@assets/images/Togglebtn/Cancel.png';
import QRCodebtn from '@assets/images/Togglebtn/QRCodeScan.png';
import refreshBtn from '@assets/images/Togglebtn/refresh.png';
import {requestGet} from "@lib/network/network";


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
    z-index: 1000;
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
    z-index: 1001;
  //position: absolute;
  bottom: 70px;
  animation: ${fadeInUp} 0.3s ease-out forwards;
`;

Modal.setAppElement('#root'); // Ensure this is your root element

const ToggleButton = ({ museumId, setRunTour }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);
    const navigate = useNavigate();

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleLogout = () => {
        removeCookie('accessToken', { path: '/' });
        alert('로그아웃 완료');
        navigate('/auth/sign-in');
    };

    const handleRefresh = () => {
        window.location.reload();
    };


    return (
        <>
            <Container>
                {isExpanded && (
                    <ExpandedMenu>
                        <Button onClick={() => setRunTour(true)}>
                            <img src={hintIcon} alt="hint" />
                        </Button>
                        <Button onClick={handleRefresh}>
                            <img src={refreshBtn} alt="refresh"/>
                        </Button>
                        <Button onClick={handleLogout}>
                            <img src={logoutIcon} alt="logout"/>
                        </Button>
                    </ExpandedMenu>
                )}
                <Button onClick={handleToggle}>
                    <img src={isExpanded ? cancelIcon : menuIcon} alt="menu" />
                </Button>
            </Container>
        </>
    );
};

export default ToggleButton;
