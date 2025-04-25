import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateType } from "../../redux/Slides/typeSlice";

const TypeProduct = ({ name, yes }) => {
  const navigate = useNavigate();
  const type = useSelector((state) => state.type);
  const dispatch = useDispatch();
  const handleNavigateType = (type) => {
    navigate(
      `/product/${type
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ /g, "_")}`,
      { state: type }
    );
  };

  const handleClickName = (name) => {
    if (type?.type?.includes(name)) {
      let arr = type.type.filter((element) => element !== name);
      dispatch(updateType(arr));
    } else {
      if (type.length) {
        dispatch(updateType([...type, name]));
      } else {
        dispatch(updateType([name]));
      }
    }
  };

  return (
    <div
      style={{
        fontSize: "16px",
        cursor: "pointer",
        color: `${yes === true ? "red" : "black"}`,
      }}
      onClick={() => handleClickName(name)}
    >
      {name}
    </div>
  );
};

export default TypeProduct;
