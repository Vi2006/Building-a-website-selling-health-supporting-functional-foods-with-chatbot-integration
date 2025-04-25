import React from "react";
import {
  WrapperContent,
  WrapperLableText,
  WrapperTextPrice,
  WrapperTextValue,
} from "./style";
import { Checkbox, Rate } from "antd";

const NavbarComponent = () => {
  const onChange = () => {};

  const renderText = (options) => {
    return options.map((option, index) => (
      <WrapperTextValue key={`text-${index}`}>{option}</WrapperTextValue>
    ));
  };

  const renderCheckbox = (options) => {
    return (
      <Checkbox.Group
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
        onChange={onChange}
      >
        {options.map((option) => (
          <Checkbox key={`checkbox-${option.value}`} value={option.value}>
            {option.label}
          </Checkbox>
        ))}
      </Checkbox.Group>
    );
  };

  const renderStar = (options) => {
    return options.map((option, index) => (
      <div
        style={{ display: "flex", alignItems: "center" }}
        key={`star-${index}`}
      >
        <Rate style={{ fontSize: "14px" }} disabled defaultValue={option} />
        <span style={{ fontSize: "14px" }}>{` từ ${option} sao `}</span>
      </div>
    ));
  };

  const renderPrice = (options) => {
    return options.map((option, index) => (
      <WrapperTextPrice key={`price-${index}`}>{option}</WrapperTextPrice>
    ));
  };

  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return renderText(options);
      case "checkbox":
        return renderCheckbox(options);
      case "star":
        return renderStar(options);
      case "price":
        return renderPrice(options);
      default:
        return null;
    }
  };

  return (
    <div>
      <WrapperLableText>Lable</WrapperLableText>
      <WrapperContent>
        {renderContent("text", ["Vitamin", "Đề kháng", "Bổ sung"])}
      </WrapperContent>
    </div>
  );
};

export default NavbarComponent;
