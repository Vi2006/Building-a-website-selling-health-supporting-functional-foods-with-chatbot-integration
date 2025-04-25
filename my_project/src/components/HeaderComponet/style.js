import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
  padding: 10px 120px;
  background-color: rgb(26, 148, 255);
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  ${"" /* padding: 10px 0; */}
`;

export const WrapperTextHeader = styled.span`
  font-size: 25px;
  color: #fff;
  font-weight: bold;
`;

export const WrapperTextHeaderAccount = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  gap: 10px;
`;

export const WrapperTextHeaderSmall = styled.span`
  font-size: 14px;
  color: #fff;
  white-space: nowrap;
`;

export const WrapperContentPopup = styled.p`
  cursor: pointer;
  &:hover {
    color: rgb(26, 148, 255);
  }
`;
