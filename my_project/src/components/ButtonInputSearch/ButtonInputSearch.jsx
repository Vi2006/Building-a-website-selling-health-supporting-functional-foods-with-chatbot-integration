import { Button, Input } from "antd";
import React from "react";
import { SearchOutlined } from "@ant-design/icons";

const ButtonInputSearch = (props) => {
  const {
    size,
    placeholder,
    textButton,
    backgroundColorInput = "#fff",
    backgroundColorButton = "rgb(13, 92, 182)",
  } = props;

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#fff",
        alignItems: "center",
        margin: 0,
      }}
    >
      <Input
        size={size}
        placeholder={placeholder}
        style={{
          backgroundColor: backgroundColorInput,
          border: "none",
          boxShadow: "none",
          paddingLeft: "12px",
          paddingRight: "12px",
          width: "calc(100% - 40px)",
        }}
      />
      <Button
        size={size}
        icon={<SearchOutlined />}
        style={{
          backgroundColor: backgroundColorButton,
          padding: "0 15px",
          border: "none",
          marginLeft: "0",
          borderRadius: "0",
        }}
      >
        {textButton}
      </Button>
    </div>
  );
};

export default ButtonInputSearch;
