import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Image, Space, Upload } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import './UploadPoster.scss';
import { fileUtil } from '../../utils/fileUtil';

export const UploadPoster = (props) => {
  const { fileList, onChange } = props;

  const handleChange = (info) => {
    onChange?.(info.fileList);
  };

  const itemRender = (originNode, file, fileList, actions) => {
    return (
      <Space direction="vertical" className="upload-item">
        <Image
          src={fileUtil.getUrl(file)}
          alt={file.name}
          wrapperStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />

        <Button
          className="upload-item__remove-btn"
          onClick={actions.remove}
          danger
          size="small"
        >
          <DeleteOutlined />
        </Button>
      </Space>
    );
  };

  return (
    <Upload
      className="UploadPoster"
      fileList={fileList}
      onChange={handleChange}
      beforeUpload={() => false}
      itemRender={itemRender}
      listType="picture"
      maxCount={1}
      accept="image/*"
    >
      <Button icon={<UploadOutlined />}>Upload Poster</Button>
    </Upload>
  );
};

UploadPoster.propTypes = {
  fileList: PropTypes.array,
  onChange: PropTypes.func,
};
