import React, { useEffect, useState } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import { Input, message } from "antd";
import { BuyLogin } from "../../components/ButtonComponent/ButtonComponent";
import { Image } from "antd";
import imageLogo from "../../assets/images/logo_login.webp";
import { useLocation, useNavigate } from "react-router-dom";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { Loading } from "../../components/LoadingComponent/Loading";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/Slides/userSlide";

const SingInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleNavigateSignUp = () => {
    navigate("/sign-up");
  };

  const mutation = useMutationHooks((data) => UserService.loginUser(data));

  const { data, isPending, isSuccess } = mutation;

  useEffect(() => {
    console.log("location", location);
    if (isSuccess) {
      if (location?.state) {
        navigate(location?.state);
        // } else {
        //   console.log("Data", data);
        //   navigate("/");
        // }
      }

      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token);
        }
      }
    }
  }, [isSuccess]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    console.log("Res", res);
    dispatch(updateUser({ ...res?.data, access_token: token }));
    if (res.data.isAdmin) {
      navigate(`/system/admin`);
    } else {
      navigate(`/`);
    }
  };

  // console.log("mutation", mutation);

  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnchangePassword = (value) => {
    setPassword(value);
  };

  // const handleSignIn = () => {
  //   mutation.mutate({
  //     email,
  //     password,
  //   });
  // };

  const handleSignIn = () => {
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail(email)) {
      message.error("Email đăng nhập không hợp lệ. Vui lòng nhập lại");
      return;
    }

    if (password.length < 6) {
      message.error("Mật khẩu không hợp lệ. Vui lòng nhập lại");
      return;
    }

    mutation.mutate({
      email,
      password,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ccc",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "800px",
          height: "465px",
          borderRadius: "6px",
          background: "#fff",
          display: "flex",
        }}
      >
        <WrapperContainerLeft>
          <h1 style={{ fontSize: "28px", fontWeight: "bold" }}> Xin chào</h1>
          <p style={{ fontSize: "18px" }}> Đăng nhập và tạo tài khoản</p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <Input
              placeholder="abc@gmail.com"
              value={email}
              onChange={(e) => handleOnchangeEmail(e.target.value)}
              style={{
                height: "40px",
                width: "100%",
                padding: "8px 12px",
                boxSizing: "border-box",
              }}
            />

            <Input.Password
              placeholder="password"
              value={password}
              onChange={(e) => handleOnchangePassword(e.target.value)}
              iconRender={(visible) =>
                visible ? (
                  <EyeOutlined style={{ color: "black" }} />
                ) : (
                  <EyeInvisibleOutlined style={{ color: "black" }} />
                )
              }
              style={{
                height: "40px",
                width: "100%",
                padding: "8px 12px",
                paddingRight: "10px",
                boxSizing: "border-box",
              }}
            />
            {data?.status === "ERR" && (
              <span style={{ color: "red", fontSize: "14px" }}>
                {data?.message}
              </span>
            )}
            <Loading isPending={isPending}>
              <BuyLogin
                text="Đăng nhập"
                onClick={handleSignIn}
                disabled={!email.length || !password.length}
                style={{
                  height: "40px",
                  width: "100%",
                  marginTop: "0px",
                  boxSizing: "border-box",
                }}
              />
            </Loading>
          </div>

          <p>{/* <WrapperTextLight>Quên mật khẩu?</WrapperTextLight> */}</p>
          <p style={{ fontSize: "16px" }}>
            Chưa có tài khoản?{" "}
            <WrapperTextLight
              onClick={handleNavigateSignUp}
              style={{ cursor: "pointer" }}
            >
              Tạo tài khoản
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image
            src={imageLogo}
            preview={false}
            alt="image-logo"
            height="203px"
            width="203px"
          />
          <h4
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "4px",
              color: "rgb(11, 116, 229)",
            }}
          >
            Mua sắm tại HealthCare+
          </h4>
          <h5
            style={{
              fontSize: "16px",
              textAlign: "center",
              marginTop: "0px",
              fontWeight: "normal",
              color: "rgb(11, 116, 229)",
            }}
          >
            Siêu ưu đãi mỗi ngày
          </h5>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SingInPage;
