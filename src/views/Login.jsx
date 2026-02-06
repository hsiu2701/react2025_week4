import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login(getProducts, setIsAuth) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  //表單輸入變更
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };
  //送出表單
  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      // console.log('登入成功', response.data);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      axios.defaults.headers.common["Authorization"] = token;
      //取得產品列表
      getProducts();
      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
      console.error("登入失敗", error.response);
    }
  };

  return (
    <div className="container login mt-3">
      <h1 className="text-center">請先登入</h1>
      <form className="form-floating" onSubmit={(e) => onSubmit(e)}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            name="username"
            placeholder="name@example.com"
            value={formData.username}
            onChange={(e) => handleInputChange(e)}
          />
          <label htmlFor="fusername">Email address</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleInputChange(e)}
          />
          <label htmlFor="password">Password</label>
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-3">
          登入
        </button>
      </form>
    </div>
  );
}

export default Login;
