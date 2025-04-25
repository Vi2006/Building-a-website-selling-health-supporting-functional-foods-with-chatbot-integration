import React from "react";
import {
  StyleNameProduct,
  WrapperCardStyle,
  WrapperDiscountText,
  WrapperPriceText,
  WrapperReportText,
  WrapperImageStyle,
  WrapperStyleTextSell,
} from "./style";
import { StarFilled } from "@ant-design/icons";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { Thanhly } from "../Thanhly/Thanhly";
export const CardComponent = (props) => {
  const {
    countInStock,
    description,
    image,
    name,
    price,
    rating,
    type,
    discount,
    sold,
    trademark,
    manufacturer,
    ingredients,
    expiredDate,
    dathanhly,
    id,
  } = props;
  console.log("Prop", props);
  const navigate = useNavigate();
  const handleDetailsProduct = (id) => {
    navigate(`/product-details/${id}`);
  };

  function daysBetween(dateString) {
    const inputDate = new Date(dateString);
    const today = new Date();

    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = inputDate - today;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 50 && diffDays >= 20) {
      return 30;
    }
    return 0;
  }

  return (
    <WrapperCardStyle
      hoverable
      style={{ width: 220 }}
      cover={<img alt="example" src={image} />}
      onClick={() => handleDetailsProduct(id)}
    >
      <WrapperImageStyle
        src={logo}
        alt="Logo"
        style={{
          width: "70px",
          height: "16px",
          position: "absolute",
          top: "-3",
          left: "-3",
          borderTopLeftRadius: "5px",
        }}
      />
      {countInStock <= 5 ? (
        <span
          style={{
            width: "70px",
            height: "15px",
            position: "absolute",
            top: "-0.75px",
            right: "-0.75px",
            borderTopRightRadius: "5px",
            fontSize: "10px",
            backgroundColor: "yellow",
            padding: "4px 2px",
          }}
          className="sap-het-hang1"
        >
          Sắp hết hàng
        </span>
      ) : (
        ""
      )}
      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReportText>
        <span>
          <span>{rating}</span>
          <StarFilled
            style={{ fontSize: "14px", color: "yellow", marginLeft: "5px" }}
          />
        </span>
        <WrapperStyleTextSell style={{ marginLeft: "10px" }}>
          {`| Đã bán ${sold}`}
        </WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        <span style={{ marginRight: "8px" }}>
          {price?.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </span>
        <WrapperDiscountText>
          {/* {daysBetween(expiredDate) === "clearance"
            ? "- Thanh lý"
            : daysBetween(expiredDate)
            ? `-${daysBetween(expiredDate)}%`
            : ""} */}
          {dathanhly ? "Thanh lý" : ""}
          {discount > 0
            ? `-${discount}%`
            : daysBetween(expiredDate)
            ? `-${daysBetween(expiredDate)}%`
            : ""}
        </WrapperDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

<WrapperStyleTextSell> </WrapperStyleTextSell>;
