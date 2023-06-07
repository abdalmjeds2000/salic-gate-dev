import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, message, Space } from 'antd';
import React, { useRef, useState } from 'react'


const NewSelectItem = ({ menu, setItems, Property }) => {
  // const [items, setItems] = useState(['jack', 'lucy']);
  const [name, setName] = useState('');
  const inputRef = useRef(null);
  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const addItem = (e) => {
    e.preventDefault();
    const newItem = { Property: Property, Value: name };
    setItems(prev => {
      const checkIsExcite = prev.filter(item => item.Value.toLowerCase() === newItem.Value.toLowerCase());
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
      <Space style={{ padding: '0 8px 4px' }} >
        <Input
          placeholder="type and add new items"
          ref={inputRef}
          value={name}
          onChange={onNameChange}
        />
        <Button type="text" icon={<PlusOutlined />} onClick={name.length >= 3 ? addItem : () => message.info("Asset name must be at least 3 character")}>
          Add Item
        </Button>
      </Space>
    </>
  )
}

export default NewSelectItem