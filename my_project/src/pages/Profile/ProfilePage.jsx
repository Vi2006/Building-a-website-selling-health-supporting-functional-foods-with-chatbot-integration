import React, { useEffect, useState } from "react";
import {
  WrapperContentProfile,
  WrapperHeaderUser,
  WrapperInput,
  WrapperLabel,
  StyledInput,
  UpdateButton,
  WrapperUploadFile,
} from "./style";
import * as UserService from "../../services/UserService";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { Loading } from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/Slides/userSlide";
import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");

  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    UserService.updateUser(id, rests, access_token);
  });

  const dispatch = useDispatch();
  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    setEmail(user?.email);
    setName(user?.name);
    setPhone(user?.phone);
    setAddress(user?.address);
    setAvatar(user?.avatar);
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      message.success();
      handleGetDetailsUser(user?.id, user?.access_token);
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnChangeName = (value) => {
    setName(value);
  };

  const handleOnChangePhone = (value) => {
    setPhone(value);
  };

  const handleOnChangeAddress = (value) => {
    setAddress(value);
  };

  const handleOnChangeAvatar = async ({ fileList }) => {
    if (!fileList.length) return;
    const file = fileList[0];
    if (!file) return;
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj);
    }

    setAvatar(file.preview);
  };

  const handleUpdate = () => {
    mutation.mutate({
      id: user?.id,
      email,
      name,
      phone,
      address,
      avatar,
      access_token: user?.access_token,
    });
  };

  return (
    <div style={{ width: "1270px", margin: "0 auto", height: "500px" }}>
      <WrapperHeaderUser>Thông tin người dùng</WrapperHeaderUser>
      <Loading isPending={isPending}>
        <WrapperContentProfile>
          <WrapperInput>
            <WrapperLabel htmlFor="name">Name</WrapperLabel>
            <StyledInput
              id="name"
              value={name}
              placeholder="Nhập text"
              onChange={(e) => handleOnChangeName(e.target.value)}
            />
            <UpdateButton onClick={handleUpdate}>Cập nhật</UpdateButton>
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="email">Email</WrapperLabel>
            <StyledInput
              id="email"
              value={email}
              placeholder="Nhập text"
              onChange={(e) => handleOnChangeEmail(e.target.value)}
            />
            <UpdateButton onClick={handleUpdate}>Cập nhật</UpdateButton>
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="phone">Phone</WrapperLabel>
            <StyledInput
              id="phone"
              value={phone}
              placeholder="Nhập text"
              onChange={(e) => handleOnChangePhone(e.target.value)}
            />
            <UpdateButton onClick={handleUpdate}>Cập nhật</UpdateButton>
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="address">Address</WrapperLabel>
            <StyledInput
              id="address"
              value={address}
              placeholder="Nhập text"
              onChange={(e) => handleOnChangeAddress(e.target.value)}
            />
            <UpdateButton onClick={handleUpdate}>Cập nhật</UpdateButton>
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
            <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </WrapperUploadFile>
            {avatar && (
              <img
                src={avatar}
                style={{
                  height: "60px",
                  width: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                alt="avatar"
              />
            )}
            {/* <StyledInput
              id="avatar"
              value={avatar}
              placeholder="Nhập text"
              onChange={(e) => handleOnChangeAvatar(e.target.value)}
            /> */}
            <UpdateButton onClick={handleUpdate}>Cập nhật</UpdateButton>
          </WrapperInput>
        </WrapperContentProfile>
      </Loading>
    </div>
  );
};

export default ProfilePage;
