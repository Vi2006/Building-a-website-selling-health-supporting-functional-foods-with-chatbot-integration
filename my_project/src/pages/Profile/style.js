import styled from "styled-components";
import { Input, Upload } from "antd";

export const WrapperContentProfile = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  width: 600px;
  margin: 0 auto;
  padding: 30px;
  border-radius: 10px;
  gap: 30px;
  background-color: #fff0f6;
`;

export const WrapperHeaderUser = styled.h2`
  font-size: 20px;
  font-weight: bold;
`;

export const WrapperInput = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
`;

export const WrapperLabel = styled.label`
  font-weight: bold;
  font-size: 16px;
  width: 70px;
  text-align: left;
`;

export const StyledInput = styled(Input)`
  width: 300px;
  &::placeholder {
    color: rgba(0, 0, 0, 0.3);
    font-style: italic;
  }
`;

export const UpdateButton = styled.button`
  font-weight: bold;
  height: 30px;
  padding: 0 10px;
  background-color: white;
  border: 1px solid rgb(26, 148, 255);
  border-radius: 4px;
  color: rgb(26, 148, 255);
  cursor: pointer;
  &:hover {
    background-color: rgb(26, 148, 255);
    color: white;
  }
`;

export const WrapperUploadFile = styled(Upload)`
  & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  & .ant-upload-list {
    display: none !important;
  }
`;
