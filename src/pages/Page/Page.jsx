import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../API/axiosConfig';
import { Link } from 'react-router-dom';
import { PlayCircleOutlined } from '@ant-design/icons';
import "./Page.scss"
export const Page = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/movies`);
        setMovies(response.data);
      } catch (error) {
        console.error('Failed to fetch movies', error);
      }
    };

    fetchMovies();
  }, []);

  const horrifiedMovies = movies.filter((movie) =>
  movie.genres.some((genreName) =>
    genreName.name.toLowerCase().includes('kinh dị'.toLowerCase())
    )
  );
  const adventureMovies = movies.filter((movie) =>
    movie.genres.some((genreName) =>
      genreName.name.toLowerCase().includes('phiêu lưu'.toLowerCase())
    )
  );

  const cartoonMovies = movies.filter((movie) =>
    movie.genres.some((genreName) =>
      genreName.name.toLowerCase().includes('hoạt hình'.toLowerCase())
    )
  );

  return (
    <div className="page-container">
      <div className="nav-category">
        <h>Phim Đề Cử</h>
        <div class="article-item">
          {movies.map((item) => (
            <Link to={`/${item.id}`} className="list-item-page">
              <div className="img-item">
                <img key={item.id} src={item.posterUrl} alt={item.title} />
                <div className="icon-play">
                  <PlayCircleOutlined />
                </div>
              </div>

              <span>{item.nameMovie}</span>
              <span>{item.enTitle}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="nav-category">
        <h>Phim Lẻ Mới Cập Nhật</h>
        <div class="article-item">
          {adventureMovies.map((item) => (
            <Link to={`/${item.id}`} className="list-item-page">
              <div className="img-item">
                <img key={item.id} src={item.posterUrl} alt={item.title} />
                <div className="icon-play">
                  <PlayCircleOutlined />
                </div>
              </div>
              <span>{item.nameMovie}</span>
              <span>{item.enTitle}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="nav-category">
        <h>Phim Bộ Mới Cập Nhật</h>
        <div class="article-item">
          {horrifiedMovies.map((item) => (
            <Link to={`/${item.id}`} className="list-item-page">
              <div className="img-item">
                <img key={item.id} src={item.posterUrl} alt={item.title} />
                <div className="icon-play">
                  <PlayCircleOutlined />
                </div>
              </div>

              <span>{item.nameMovie}</span>
              <span>{item.enTitle}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="nav-category">
        <h>Phim Hoạt Hình</h>
        <div class="article-item">
          {cartoonMovies.map((item) => (
            <Link to={`/${item.id}`} className="list-item-page">
              <div className="img-item">
                <img key={item.id} src={item.posterUrl} alt={item.title} />
                <div className="icon-play">
                  <PlayCircleOutlined />
                </div>
              </div>

              <span>{item.nameMovie}</span>
              <span>{item.enTitle}</span>
            </Link>
          ))}
        </div>
      </div>
      <span>
        Contact Info: Liên hệ ngay All content of this website is collected from
        official video websites on the Internet, and does not provide genuine
        streaming. If your rights are violated, please notify us, we will remove
        the infringing content in time, thank you for your cooperation! All
        advertising on the web is the personal opinion of the customer, not
        related to our website. Please consider and take responsibility for your
        own choices. Happy moviegoers!
      </span>
    </div>
  );
};
