import styled from "styled-components";

export const WrapperCart = styled.div`
  font-size: 18px;
  padding: 5px 0px;
  max-width: 100%;

  h2 {
    font-family: "Roboto", sans-serif;
    font-weight: 700;
    font-size: 24px;
    color: #333;
    margin-bottom: 9px;
  }

  h3 {
    margin-bottom: 5px;
    margin-top: 0px;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
  }

  .red-text {
    color: red;
    font-size: 20px;
    font-weight: bold;
    padding: 9px;
  }

  .total {
    border-top: 2px solid black;
    padding-top: 10px;
    gap: 50px;
  }

  .order-button {
    width: 300px;
    background-color: #d32f2f;
    color: white;
    font-family: "Roboto", sans-serif;
    font-size: 16px;
    font-weight: bold;
    padding: 10px 20px;
    margin-top: 5px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  .order-button:hover {
    background-color: #ff3b30;
    transform: scale(1.05);
  }

  .order-button:active {
    background-color: #b71c1c;
    transform: scale(0.98);
  }
`;
