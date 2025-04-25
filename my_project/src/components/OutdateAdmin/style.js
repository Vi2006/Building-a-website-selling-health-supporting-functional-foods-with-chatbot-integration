import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeaderAdmin = styled.h1`
  color: #000;
  font-size: 17px;
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
  & .ant-upload-list-items {
    display: none;
  }
`;
