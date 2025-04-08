import React, { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";
import apiService from "../api/apiService";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const AuthContext = createContext();

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const signin = async (email, password) => {
    try {
      const response = await apiService.post("/auth/login", {
        email,
        password,
      });
      const { token, user } = response;

      console.log("Token:", token, "User:", user);

      if (token && user) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        showSnackbar("Đăng nhập thành công!", "success");
        return user;
      } else {
        throw new Error("Phản hồi từ server không đầy đủ.");
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      showSnackbar("Đăng nhập thất bại. Vui lòng thử lại!", "error");
      throw error;
    }
  };

  const register = async (fullname, email, password, role = "user") => {
    try {
      const response = await apiService.post("/auth/register", {
        fullname,
        email,
        password,
        role,
      });

      console.log("Response từ API:", response);
      showSnackbar(response.message, "success");
      return response;
    } catch (error) {
      console.error("Register Error:", error.message || "Đăng ký thất bại.");
      showSnackbar(
        error.message || "Đăng ký thất bại. Vui lòng thử lại.",
        "error"
      );
      throw error;
    }
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showSnackbar("Đăng xuất thành công!", "info");
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout, register }}>
      {children}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
