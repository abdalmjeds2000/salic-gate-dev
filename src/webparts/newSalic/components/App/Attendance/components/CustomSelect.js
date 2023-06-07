import React from 'react'

function CustomSelect(props) {
  return (
    <div className='custom-select-container'>
      {props?.label && <label htmlFor={props.name}>{props.label}</label>}
      <select name={props.name} id={props.name} onChange={props.onChange} value={props.value} defaultValue={props.defaultValue}>
        {props.options?.map((option, i) => {
          return <option key={i} value={option.value} selected={option.value === props.selectedBy ? true : false}>{option.name}</option>
        })}
      </select>
    </div>
  )
}

export default CustomSelect