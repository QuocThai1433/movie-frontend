import qs from "qs";
import React, { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { useLoaderData } from "react-router-dom";
import { axiosInstance } from "../../API/axiosConfig";
import { countries } from "../../static-data/countries";
import "../../style/update-movie.scss";
import { DEFAULT_EPISODE, Episode } from "./Episode";

export async function UpdateMovieLoader({ params }) {
  const res = await axiosInstance.get(`/api/v1/admin/movies/${params.id}`);
  return { movie: res.data };
}

export const UpdateMovie = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [showEpisode, setShowEpisode] = useState(false);
  const [suggestions, setSuggestion] = useState([]);
  const { movie } = useLoaderData();
  const [showUploadFileMovie, setShowUploadFileMovie] = useState(true);

  const [data, setData] = useState({
    nameMovie: "",
    viTitle: "",
    enTitle: "",
    description: "",
    country: "",
    poster: "",
    video: "",
    idCategory: [],
    year: "",
    prevPosterUrl: "",
    prevVideoUrl: "",
    idGenre: [],
    episodes: [],
  });

  useEffect(() => {
    fetchData(movie);
    setShowEpisode(movie?.category?.id === 1);
  }, [movie]);

  useEffect(() => {
    fetchGenre();
    fetchCategories();
  }, []);

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      poster: getFileNameFromUrl(movie.posterUrl),
      video: data.video === null ? null : getFileNameFromUrl(movie.videoUrl),
    }));
  }, [movie.posterUrl]);

  const fetchData = (newData) => {
    setData({ ...data, ...newData, idCategory: newData?.category?.id || [] }); 
    
  };

  const fetchCategories = async () => {
    const response = await axiosInstance.get(`/api/v1/category`);
    setCategories(response.data);
  };

  const fetchGenre = async (params) => {
    try {
      const response = await axiosInstance.get(`/api/v1/genre`, {
        params,
        paramsSerializer: (params) => qs.stringify(params),
      });
      setSuggestion(response.data ?? []);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  function getFileNameFromUrl(filePath) {
    const fileUrl = new URL(filePath, window.location.origin);
    return fileUrl.pathname;
  }

  // const getFileNameFromUrl = (url) => {
  //   return url.substring(url.lastIndexOf("/") + 1);
  // };

  const handleChange = (e, onSuccess) => {
    const { name, value } = e.target;
    setData((prev) => {
      const updatedData = { ...prev, [name]: value };
      onSuccess?.(updatedData);
      return updatedData;
    });
  };

  const handleFileUpload = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    const previewUrl = URL.createObjectURL(file);
    if (name === "video") {
      setData((prev) => ({
        ...prev,
        video: file,
        prevVideoUrl: previewUrl,
      }));
    } else if (name === "poster") {
      setData((prev) => ({
        ...prev,
        poster: file,
        prevPosterUrl: previewUrl,
      }));
    }
  };

  const isSeries = () => data?.idCategory?.toString() === "1";

  const uploadFileMovie = async (id, type, file) => {
    const formData = new FormData();
    formData.append('file', file);
    await axiosInstance.patch(
      `/api/v1/admin/movies/${id}?type=${type}`,
      formData
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !data.nameMovie ||
        !data.viTitle ||
        !data.enTitle ||
        !data.description ||
        !data.idGenre.length
      ) {
        alert("Vui lòng nhập đầy đủ thông tin phim");
        return;
      }

      const newData = {
        ...data,
        episodes: data.episodes.map((episode, index) => ({
          ...episode,
          tempId: "" + new Date().getTime() + index,
        })),
      };

      const episodesMap = new Map(
        newData.episodes.map((item) => [item.tempId, item])
      );
      const response = await axiosInstance.put(
        `/api/v1/admin/movies/${movie.id}`,
        {
          ...newData,
          poster: undefined,
          video: undefined,
          episodes: isSeries()
            ? newData.episodes.map((episode) => ({
                ...episode,
                posterUrl: undefined,
                videoUrl: undefined,
              }))
            : [],
        }
      );
      fetchData(response.data);
      if (!isSeries() && data.poster && data.video) {
        uploadFileMovie(response.data.id, "poster", data.poster);
        uploadFileMovie(response.data.id, "video", data.video);
      } else if (data.poster) {
        const formData = new FormData();
        formData.append("file", data.poster);
        const res = await axiosInstance.patch(
          `/api/v1/admin/movies/${response.data.id}?type=poster`,
          formData
        );
        for (const item of response.data.episodes) {
          const episodeMap = episodesMap.get(item.tempId);
          if (episodeMap.poster && episodeMap.video) {
            const formDataEpisode = new FormData();
            formDataEpisode.append("poster", episodeMap.poster);
            formDataEpisode.append("video", episodeMap.video);
            await axiosInstance.patch(
              `/api/v1/admin/movies/${response.data.id}/episodes/${item.id}`,
              formDataEpisode
            );
          }
        }
      }
      alert("Cập nhật thành công");
      // navigate("/admin");
    } catch (error) {
      alert("Lỗi");
      console.error("Error updating movie:", error);
    }
  };

  const handleShowEpisode = (e) => {
    if (e.target.value === "1") {
      setShowEpisode(true);
      setShowUploadFileMovie(false);
      setData((prev) => ({
        ...prev,
        episodes: [DEFAULT_EPISODE],
      }));
    } else {
      setShowUploadFileMovie(true);
      setShowEpisode(false);
    }
  };

  const handleEpisodeChanged = (episode, index) => {
    setData((prev) => {
      const episodes = [...prev.episodes];
      episodes[index] = { ...episodes[index], ...episode };
      return { ...prev, episodes };
    });
  };

  const handleAddEpisode = (e) => {
    e.preventDefault();
    setData((prev) => ({
      ...prev,
      episodes: [...prev.episodes, DEFAULT_EPISODE],
    }));
  };

  const handleGenreChange = (selectedItems) => {
    setSelectedCategory(selectedItems);
    setData((prev) => ({
      ...prev,
      idGenre: selectedItems.map((item) => item.value.id),
    }));
  };

  return (
    <div className="container-addmovie">
      <h1>Sửa Thông Tin Phim</h1>
      <div className="form-addmovie">
        <div className="selectedInputForm">
          <label>Nhập Tên Phim</label>
          <input
            type="text"
            name="nameMovie"
            value={data.nameMovie}
            onChange={handleChange}
            required
          />
        </div>

        <div className="file-item">
          <div className="selectedInputForm">
            <label>Tải Poster</label>
            <input
              type="file"
              name="poster"
              onChange={handleFileUpload}
              required
            />
          </div>
          <img
            className="poster-item"
            src={data.prevPosterUrl || movie.posterUrl}
            alt=""
          />
        </div>
        {showUploadFileMovie && (
          <div className="selectedInputForm">
            <div className="file-item">
              <div className="selectedInputForm">
                <label>Tải Phim</label>
                <input
                  type="file"
                  name="video"
                  onChange={handleFileUpload}
                  required
                />
              </div>
              <video
                className="video-item"
                src={data.prevVideoUrl || movie.videoUrl}
                controls
              ></video>
            </div>
          </div>
        )}
        <div className="selectedInputForm">
          <label>Nhập Tên Phim Tiếng Việt</label>
          <input
            type="text"
            name="viTitle"
            value={data.viTitle}
            onChange={handleChange}
            required
          />
        </div>
        <div className="selectedInputForm">
          <label>Nhập Tên Phim Tiếng Anh</label>
          <input
            type="text"
            name="enTitle"
            value={data.enTitle}
            onChange={handleChange}
            required
          />
        </div>
        <div className="selectedInputForm">
          <label>Nhập Mô Tả Phim</label>
          <input
            type="text"
            name="description"
            value={data.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="selectedInputForm">
          <label>Năm Phát Hành:</label>
          <input
            type="text"
            name="year"
            value={data.year}
            onChange={handleChange}
            required
          />
        </div>
        <div className="selectedInputForm">
          <label>Nhập Quốc Gia</label>
          <select
            name="country"
            value={data.country}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Chọn Quốc Gia
            </option>, 
            {countries.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select> 
        </div>
        <div className="selectedInputForm">
          <label>Chọn Phân Loại Phim</label>
          <select
            name="idCategory"
            value={data.idCategory}
            onChange={(e) => {
              handleChange(e, (formData) => {
                handleShowEpisode(e, formData);
              });
            }}
            required
          >
            <option disabled selected>
              Chọn Phân Loại Phim
            </option>
            {categories.map((value) => (
              <option key={value.id} value={value.id}>
                {value.name}
              </option>
            ))}
          </select>
        </div>
        <div className="selectedInputForm">
          <label>Nhập Thể Loại</label>
          <MultiSelect
            options={suggestions.map((item) => ({
              label: item.name,
              value: item,
            }))}
            value={selectedCategory}
            onChange={handleGenreChange}
            labelledBy="Select"
            className="light custom-multi-select"
            defaultIsOpen={false}
          />
        </div>
      </div>

      {showEpisode && (
        <div className="episodes">
          {data.episodes && (
            <>
              {data.episodes.map((item, index) => (
                <Episode
                  key={index}
                  episode={item}
                  index={index}
                  formChanged={handleEpisodeChanged}
                />
              ))}
            </>
          )}
          <button onClick={handleAddEpisode}>Add Episode</button>
        </div>
      )}

      <button onClick={handleSubmit}>Sửa</button>
    </div>
  );
};
