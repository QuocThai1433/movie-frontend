import React, { useState } from "react";
import { HiOutlineFilm } from "react-icons/hi";
import { SearchOutlined } from "@ant-design/icons";
import { axiosInstance } from "../API/axiosConfig";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const handleChange = (e) => {
    setName(e.target.value);
  };

  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    return token !== null;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  const filterMovie = async (event, params) => {
    try {
      if (event && event.key === "Enter") {
        event.preventDefault();
      }
      if (params === "") {
        alert("Nhập tên phim bạn muốn xem!");
        return;
      } 
      const response = await axiosInstance.get(`/api/v1/movies/name/${params}`);
      if (response.data) {
        navigate(`/filter/${params}`);
      }
      alert("Tìm kiếm thành công");
  
    } catch (error) {
      
        navigate(`/filter/${params}`);
       return null;

    }
  };
  
  return (
    <div className="home-page">
      <div className="header">
        <div className="header-title">
          <div className="header-title-icon">
            <HiOutlineFilm className="icon"></HiOutlineFilm>
            <div className="title">
              <span>TrumPhim.Net </span>
              <label>Phim mới cập nhật chất lượng cao </label>
            </div>
          </div>
          <div className="search">
            <input
              placeholder="Tim Kiếm Phim"
              className="search-input"
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  filterMovie(event, name);
                }
              }}
              required
            ></input>
            <button onClick={() => filterMovie(null, name)}>
              <SearchOutlined />
            </button>
          </div>
        </div>
        {!isLoggedIn() && (
          <div className="login-register">
            <a href="/login">Đăng Nhập/ </a>
            <a href="/register">Đăng Ký</a>
          </div>
        )}
        {isLoggedIn() && (
          <div className="login-register">
            <a href="/" onClick={handleLogout}>
              Đăng Xuất
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
