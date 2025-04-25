import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
  width: 220px;
  & img {
    height: 220px;
    width: 220px;
  },
  position: relative;
`;

export const WrapperImageStyle = styled.img`
  top: -1px;
  left: -1px;
  border-top-left-radius: 5px;
  position: absolute;
  height: 16px;
  width: 70px;
`;

export const StyleNameProduct = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: rgb(56, 56, 61);
  margin-bottom: 8px;
`;

export const WrapperReportText = styled.div`
  font-size: 14px;
  color: rgb(128, 128, 137);
  display: flex;
  align-items: center;
  line-height: 18px;
  margin: 8px 0 2px;

  span {
    display: flex;
    align-items: center;
  }
`;

export const WrapperPriceText = styled.div`
  font-weight: 500;
  font-size: 16px;
  color: rgb(255, 66, 78);
`;

export const WrapperDiscountText = styled.span`
  font-weight: 500;
  font-size: 12px;
  color: rgb(255, 66, 78);
`;

export const WrapperStyleTextSell = styled.div`
  font-size: 15px;
  line-height: 24px;
  color: rgb(120, 120, 120);
`;
