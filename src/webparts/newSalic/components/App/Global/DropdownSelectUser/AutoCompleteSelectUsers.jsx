import { Form, Select, Spin, Typography } from 'antd';
import debounce from 'lodash/debounce';
import React, { useContext, useMemo, useRef, useState } from 'react';
import { AppCtx } from '../../App';
import fetchUsers from './fetchUsers';


function DebounceSelect({ fetchOptions, debounceTimeout = 500, name, isRequired, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      if(value.length >= 3) {
        setOptions([]);
        setFetching(true);
        fetchOptions(value).then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return;
          }
          setOptions(newOptions);
          setFetching(false);
        });
      }
      
    };
    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);
  return (
    <Form.Item name={name} style={{marginBottom: 0}} rules={[{ required: isRequired, message: false }]}>
      <Select
        labelInValue
        filterOption={false}
        onSearch={debounceFetcher}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        {...props}
        options={options}
      />
    </Form.Item>
  );
}

// Usage of DebounceSelect


const AutoCompleteSelectUsers = (props) => {
  const { sp_site } = useContext(AppCtx);
  const [value, setValue] = useState([]);


  async function fetchUserList(username) {
    return fetchUsers(username)
      .then((res) =>
        res.data?.Data?.value?.map((user) => ({
          label: (
            <div style={{display: 'flex', alignItems: 'center', gap: 7}}>
              <img src={`${sp_site}/_layouts/15/userphoto.aspx?size=M&username=${user.mail}`} alt='' style={{width: 25, borderRadius: 99}} />
              <Typography.Text>{user.displayName}</Typography.Text>
            </div>
          ),
          value: user.mail,
        })),
      );
  }


  return (
    <DebounceSelect
      mode="multiple"
      value={value}
      placeholder="Select users"
      fetchOptions={fetchUserList}
      onChange={(newValue) => { setValue(newValue) }}
      style={{width: '100%',}}
      name={props.name}
      size={props.size}
      isRequired={props.isRequired}
    />
  );
};
export default AutoCompleteSelectUsers;