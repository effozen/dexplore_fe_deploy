import React, { useState } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import Modal from 'react-modal';
import { Scanner } from '@yudiel/react-qr-scanner';

// 이미지 파일 임포트
import menuIcon from '@assets/images/Togglebtn/menu.png';
import ideaIcon from '@assets/images/Togglebtn/Tip.png';
import logoutIcon from '@assets/images/Togglebtn/Logout.png';
import cancelIcon from '@assets/images/Togglebtn/Cancel.png';
import QRCodebtn from '@assets/images/Togglebtn/QRCodeScan.png';

const GlobalStyle = createGlobalStyle`
    body, html {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
`;

const Button = styled.button`
    width: 50px;
    height: 50px;
    background-color: transparent;
    border: none;
    border-radius: 50%;
    margin: 10px 0;
    cursor: pointer;
`;

const ExpandedMenu = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    bottom: 70px;
    animation: ${fadeInUp} 0.3s ease-out forwards;
`;

//rootElement 추가
Modal.setAppElement('#root');

const ToggleButton = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleScan = (result) => {
        if (result) {
            console.log('QR Code Data:', result);
            handleCloseModal();
        }
    };

    return (
        <>
            <GlobalStyle />
            <Container>
                {isExpanded && (
                    <ExpandedMenu>
                        <Button onClick={handleToggle}>
                            <img src={ideaIcon} alt="idea" />
                        </Button>
                        <Button onClick={handleToggle}>
                            <img src={logoutIcon} alt="exit"  />
                        </Button>
                        <Button onClick={handleOpenModal}>
                            <img src={QRCodebtn} alt="close"/>
                        </Button>
                        <Button onClick={handleToggle}>
                            <img src={cancelIcon} alt="close"  />
                        </Button>
                    </ExpandedMenu>
                )}
                <Button onClick={handleToggle}>
                    <img src={menuIcon} alt="menu" />
                </Button>
            </Container>

            {/*Modal화면 프레임*/}
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
                <Scanner onScan={handleScan} />
            </Modal>
        </>
    );
};

export default ToggleButton;