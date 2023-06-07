import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Space } from 'antd';
import React from 'react'
import { useRef } from 'react';
import { useState } from 'react';

const AddSelectItem = ({ menu, setItems }) => {
  const [name, setName] = useState('');

  const inputRef = useRef(null);
  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const addItem = (e) => {
    e.preventDefault();
    setItems(prev => [...prev, name]);
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div>
      {menu}
      <Divider style={{margin: '8px 0'}} />
      <Space style={{padding: '0 8px 4px'}}>
        <Input
          placeholder="Please enter item"
          ref={inputRef}
          value={name}
          onChange={onNameChange}
        />
        <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
          Add item
        </Button>
      </Space>
    </div>
  )
}

export default AddSelectItem