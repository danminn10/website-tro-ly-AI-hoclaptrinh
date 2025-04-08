import apiService from "../api/apiService";

// export const fetchUpdateUser = async (userId, updatedData) => {
//   try {
//     const response = await apiService.put(`/users/${userId}`, updatedData, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     return response.user;
//   } catch (error) {
//     console.error(
//       "Error updating user:",
//       error.response?.data || error.message
//     );
//     throw new Error(
//       error.response?.data?.message || "Failed to update user on server."
//     );
//   }
// };
export const fetchUpdateUser = async (userId, updatedData) => {
  try {
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData), // Gửi dữ liệu cần cập nhật
    });

    if (!response.ok) {
      throw new Error(`Failed to update user. Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};


export const fetchUserById = async (userId) => {
  try {
    const response = await apiService.get(`/users/${userId}`);
    return response;
  } catch (error) {
    console.error("Error fetching user:", error.message);
    throw error;
  }
};
