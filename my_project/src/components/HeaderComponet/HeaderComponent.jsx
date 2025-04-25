import { Badge, Col, Input, Popover } from "antd";
import React, { useEffect } from "react";
import {
  WrapperContentPopup,
  WrapperHeader,
  WrapperTextHeader,
  WrapperTextHeaderAccount,
  WrapperTextHeaderSmall,
} from "../HeaderComponet/style";
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { resetUser } from "../../redux/Slides/userSlide";
import { useState } from "react";
import { Loading } from "../LoadingComponent/Loading";
import { searchProduct } from "../../redux/Slides/productSlide";
const { Search } = Input;

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [number, setNumber] = useState("null");
  const order = useSelector((state) => state.order);
  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };
  // const handleSearch = (value) => {
  //   console.log("onSearch event triggered!");
  //   console.log("Searching for: ", value);
  // };

  const handleLogout = async () => {
    setLoading(true);
    await UserService.logoutUser();
    dispatch(resetUser());
    setLoading(false);
  };

  useEffect(() => {
    let tem = 0;
    order?.orderItems?.forEach((element) => {
      tem = tem + element.amount;
    });
    setNumber(tem);
  }, [order?.orderItems]);

  useEffect(() => {
    setLoading(true);
    setUserName(user?.name);
    setUserAvatar(user?.avatar);
    setLoading(false);
  }, [user?.name, user?.avatar]);

  const content = (
    <div>
      <WrapperContentPopup onClick={() => navigate("/profile-user")}>
        Thông tin người dùng
      </WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => navigate("/system/admin")}>
          Quản lý hệ thống
        </WrapperContentPopup>
      )}
      {/* <WrapperContentPopup onClick={() => navigate("/my-order")}>
        Đơn hàng của tôi
      </WrapperContentPopup> */}
      <WrapperContentPopup onClick={handleLogout}>
        Đăng xuất
      </WrapperContentPopup>
    </div>
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    dispatch(searchProduct(e.target.value));
  };

  return (
    <div>
      <WrapperHeader
        gutter={16}
        style={{
          justifyContent:
            isHiddenSearch && isHiddenSearch ? "space-between" : "unset",
        }}
      >
        <Col span={6}>
          <WrapperTextHeader
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            HealthCare+
          </WrapperTextHeader>
        </Col>
        {!isHiddenSearch && (
          <Col span={12}>
            <Search
              size="large"
              placeholder="Nhập tên sản phẩm chức năng cần tìm..."
              // onSearch={handleSearch}
              onChange={handleSearchChange}
              enterButton="Tìm kiếm"
              style={{ width: "100%" }}
            />
          </Col>
        )}
        <Col
          span={6}
          style={{ display: "flex", gap: "20px", alignItems: "center" }}
        >
          <Loading isPending={loading}>
            <WrapperTextHeaderAccount>
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="avatar"
                  style={{
                    height: "35px",
                    width: "35px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <UserOutlined style={{ fontSize: "30px" }} />
              )}
              {user?.access_token ? (
                <>
                  <Popover content={content} trigger="click">
                    <div style={{ cursor: "pointer" }}>
                      {userName?.length ? userName : user?.email}
                    </div>
                  </Popover>
                </>
              ) : (
                <div
                  onClick={handleNavigateLogin}
                  style={{ cursor: "pointer" }}
                >
                  <WrapperTextHeaderSmall>
                    Đăng nhập/Đăng ký
                  </WrapperTextHeaderSmall>
                  <div>
                    <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
              )}
            </WrapperTextHeaderAccount>
          </Loading>
          {user.email && !isHiddenCart && !user.isAdmin && (
            <div
              onClick={() => navigate("/order")}
              style={{ cursor: "pointer" }}
            >
              <Badge count={number} size="small">
                <ShoppingCartOutlined
                  style={{ fontSize: "30px", color: "#fff" }}
                />
              </Badge>
              <WrapperTextHeaderSmall>Giỏ Hàng</WrapperTextHeaderSmall>
            </div>
          )}
        </Col>
      </WrapperHeader>
    </div>
  );
};

export default HeaderComponent;
