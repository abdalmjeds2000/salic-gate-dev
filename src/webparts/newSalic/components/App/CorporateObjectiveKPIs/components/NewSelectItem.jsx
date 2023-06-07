import React, { useRef, useState } from 'react'
import { Button, Divider, Input, message, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';


const NewSelectItem = ({ menu, setItems }) => {
  const [name, setName] = useState('');
  const inputRef = useRef(null);
  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const addItem = (e) => {
    e.preventDefault();
    const newItem = name;
    setItems(prev => {
      const checkIsExcite = prev.filter(item => item?.toLowerCase() === newItem?.toLowerCase());
      if(checkIsExcite.length === 0) {
        return [newItem, ...prev];
      }
      return prev;
    });
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  
  return (
    <>
      {menu}
      <Divider
        style={{
          margin: '8px 0',
        }}
      />
      <Space style={{ padding: '5px' }} >
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
          <Input
            placeholder="type and add new items"
            ref={inputRef}
            value={name}
            onChange={onNameChange}
            style={{ minWidth: 120 }}
          />
          <Button type="text" icon={<PlusOutlined />} onClick={name.length >= 3 ? addItem : () => message.info("Asset name must be at least 3 character")}>
            Add Item
          </Button>
        </div>
      </Space>
    </>
  )
}

export default NewSelectItem