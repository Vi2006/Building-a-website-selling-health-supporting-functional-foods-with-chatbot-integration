import React from "react";
import styled from "styled-components";

const BuyNowButton = styled.button`
  border: 1px solid rgb(255, 57, 69);
  color: #fff;
  width: 220px;
  height: 48px;
  border-radius: 4px;
  background-color: rgb(255, 57, 69);
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: rgb(11, 116, 229);
    color: #fff;
  }
  &:disabled {
    background-color: #ccc;
    color: rgb(11, 116, 229);
    border-color: rgb(11, 116, 229);
    cursor: not-allowed;
  }
`;

const BuyLaterButton = styled.button`
  border: 1px solid rgb(255, 165, 0);
  color: rgb(11, 116, 229);
  width: 220px;
  height: 48px;
  border-radius: 4px;
  background-color: #fff;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: rgb(255, 165, 0);
    color: #fff;
  }
`;

const BuyLoginButton = styled.button`
  border: 1px solid rgb(255, 57, 69);
  color: #fff;
  width: 100%;
  height: 48px;
  margin: 26px 0 10px;
  border-radius: 4px;
  background-color: rgb(255, 57, 69);
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: rgb(11, 116, 229);
    color: #fff;
  }

  &:disabled {
    background-color: gray;
    border-color: gray;
    cursor: not-allowed;
  }
`;

export const BuyNow = ({ text, onClick, disabled }) => {
  return (
    <BuyNowButton onClick={onClick} disabled={disabled}>
      {text}
    </BuyNowButton>
  );
};

export const BuyLater = ({ text }) => {
  return <BuyLaterButton>{text}</BuyLaterButton>;
};

export const BuyLogin = ({ text, onClick, disabled }) => {
  return (
    <BuyLoginButton
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {text}
    </BuyLoginButton>
  );
};
