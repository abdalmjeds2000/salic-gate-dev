import React from 'react';
import { Button, Checkbox, Dropdown } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const FilterColumns = ({ setDefaultColumns }) => {

  const onChange = (e, column) => {
    setDefaultColumns(prev => {
      prev.filter(c => c.dataIndex === column)[0]
      .showColumn = e.target.checked;
      return [... prev]
    })
  };


  return (
    <Dropdown 
      trigger={['click']}
      dropdownRender={(menu) => (
        <div className="custom-dropdown-render">
          <Checkbox defaultChecked onChange={e => onChange(e, "field_6")}>KPI Weights</Checkbox>
          <Checkbox defaultChecked onChange={e => onChange(e, "field_16")}>Owner</Checkbox>
          <Checkbox defaultChecked onChange={e => onChange(e, "Q1")}>Q1</Checkbox>
          <Checkbox defaultChecked onChange={e => onChange(e, "Q2")}>Q2</Checkbox>
          <Checkbox defaultChecked onChange={e => onChange(e, "Q3")}>Q3</Checkbox>
          <Checkbox defaultChecked onChange={e => onChange(e, "Q4")}>Q4</Checkbox>
          <Checkbox defaultChecked onChange={e => onChange(e, "field_14")}>Annual Target</Checkbox>
          <Checkbox defaultChecked onChange={e => onChange(e, "field_22")}>Actual Full Year</Checkbox>
        </div>
      )}
    >
      <Button size="small"><FilterOutlined /> Filter Columns</Button>
    </Dropdown>
  )
}

export default FilterColumns