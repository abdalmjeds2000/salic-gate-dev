import { Select } from 'antd'
import React from 'react'

const CurrencySelectInput = () => {
  return (
    <Select style={{ minWidth: 100 }} size="large">
      <Select.Option value="USD">US Dollar</Select.Option>
      <Select.Option value="AUD">Australian Dollar</Select.Option>
      <Select.Option value="EUR">Euro</Select.Option>
      <Select.Option value="SAR">Saudi Riyal</Select.Option>
      <Select.Option value="UAH">Ukrainian hryvnia</Select.Option>
      <Select.Option value="CAD">Canadian Dollar</Select.Option>
      <Select.Option value="INR">Indian Rupee</Select.Option>
    </Select>
  )
}

export default CurrencySelectInput