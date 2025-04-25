import styled from "styled-components";

export const CheckoutContainer = styled.div`
  width: 900px;
  margin: 50px auto;
  padding: 20px;
  background: #e3f2fd;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Title = styled.h2`
  font-family: "Roboto", sans-serif;
  color: #333;
  margin-bottom: 20px;
`;

export const CheckoutForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 50px;
`;

export const FormGroup = styled.div`
  margin-bottom: 15px;
  text-align: left;
`;

export const Label = styled.label`
  display: block;
  font-weight: normal; /* Chữ không đậm */
  margin-bottom: 5px;
  font-size: 14px;
  color: #333; /* Màu chữ nhẹ nhàng hơn */
`;

export const Input = styled.input`
  width: 97%;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.2); /* Viền mờ hơn */
  border-radius: 5px;
  font-size: 14px;
  font-weight: normal; /* Chữ không đậm */
  outline: none; /* Bỏ viền xanh khi click */
  background-color: #f0f5ff;

  &:focus {
    border-color: rgba(0, 0, 0, 0.3); /* Viền hơi đậm khi focus */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* Hiệu ứng mờ khi focus */
  }
`;

export const OrderButton = styled.button`
  background-color: #d32f2f; /* Màu đỏ chính */
  color: white;
  font-size: 16px;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s ease;
  font-weight: bold;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #ff3b30; /* Màu đỏ sáng hơn khi hover */
    transform: scale(1.05);
  }

  &:active {
    background-color: #b71c1c; /* Màu đỏ sậm khi nhấn */
    transform: scale(0.98);
  }
`;
