import React, { useEffect } from 'react';
import styled from '@emotion/styled';

import { ModalState, closeModal, useModalStore } from '@/provider/ModalState';
import { Modal } from './Modal';
import { useRouter } from 'next/router';

function ModalComponent() {
  const store = useModalStore();

  const router = useRouter();

  useEffect(() => {
    if (!router.asPath.startsWith('/youtube/')) {
      useModalStore.setState((pre) => {
        return { ...pre, show: false };
      });
    }
  }, [router.asPath]);

  return (
    <>
      <ModalBackground show={store.show} onClick={closeModal} />
      {store.fullScreen ? (
        <Modal.FullScreenContainer show={store.show}>
          {store.title && <Modal.Title>{store.title}</Modal.Title>}
          <Modal.Body>{store.body}</Modal.Body>
        </Modal.FullScreenContainer>
      ) : (
        <Modal.Container show={store.show}>
          {store.title && <Modal.Title>{store.title}</Modal.Title>}
          <Modal.Body>{store.body}</Modal.Body>
        </Modal.Container>
      )}
    </>
  );
}

export default ModalComponent;

const ModalBackground = styled.div<Pick<ModalState, 'show'>>`
  display: ${({ show }) => (show ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 98;
  background-color: #000000cc;
`;
