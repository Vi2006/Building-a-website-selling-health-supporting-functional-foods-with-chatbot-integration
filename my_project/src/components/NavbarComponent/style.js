import styled from "styled-components";

export const WrapperLableText = styled.h4`
  color: rgb(56, 56, 61);
  font-size: 16px;
  font-weight: 600;
`;

export const WrapperTextValue = styled.span`
  color: rgb(56, 56, 61);
  font-size: 14px;
  font-weight: 500;
`;

export const WrapperContent = styled.div`
  display: flex;
  ${"" /* align-items: center; */}
  flex-direction: column;
  gap: 12px;
  font-weight: normal;
`;

export const WrapperTextPrice = styled.div`
  padding: 6px;
  border-radius: 12px;
  background-color: rgb(238, 238, 238);
  width: fit-content;
  color: rgb(56, 56, 61);
`;
