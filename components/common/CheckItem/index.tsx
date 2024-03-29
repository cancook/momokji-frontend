import React, { ReactNode } from 'react';
import CheckSVGIcon from '@/public/svg/check.svg';
import styled from '@emotion/styled';

type CheckItemProps = {
  isChecked: boolean;
  children: ReactNode;
};

const CheckItem = ({ isChecked, children }: CheckItemProps) => {
  return (
    <Layout isChecked={isChecked} className="check-item-layout">
      <CheckIcon className="check-item-icon" isChecked={isChecked} />
      <span>{children}</span>
    </Layout>
  );
};

const CheckIcon = styled(CheckSVGIcon, {
  shouldForwardProp: (prop) => prop !== 'isChecked'
})`
  color: ${({ theme, isChecked }) =>
    isChecked ? theme.colors.yellow[400] : theme.colors.gray[400]};
  margin-right: 0.25rem;
`;

const Layout = styled.div<{ isChecked: boolean }>`
  color: ${({ isChecked, theme }) =>
    isChecked ? theme.colors.yellow[400] : theme.colors.gray[200]};
  margin-bottom: 0.25rem;
`;

export default CheckItem;
