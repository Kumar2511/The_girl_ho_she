import api from "@/lib/api";

// ===============================
// Profile
// ===============================

export const getProfile = async () => {
  const { data } = await api.get("/auth/profile");
  return data;
};

export const updateProfile = async (profile: {
  name: string;
  phone: string;
}) => {
  const { data } = await api.put("/auth/profile", profile);
  return data;
};

export const changePassword = async (passwords: {
  currentPassword: string;
  newPassword: string;
}) => {
  const { data } = await api.put(
    "/auth/change-password",
    passwords
  );

  return data;
};

// ===============================
// Address Management
// ===============================

export const getAddresses = async () => {
  const { data } = await api.get("/auth/addresses");
  return data;
};

export const addAddress = async (address: {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}) => {
  const { data } = await api.put("/auth/address", address);
  return data;
};

export const updateAddress = async (
  id: string,
  address: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  }
) => {
  const { data } = await api.put(
    `/auth/address/${id}`,
    address
  );

  return data;
};

export const deleteAddress = async (id: string) => {
  const { data } = await api.delete(
    `/auth/address/${id}`
  );

  return data;
};