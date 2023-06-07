import React, { useContext, useEffect, useState } from 'react';
import { DownOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, message, Space, Typography, Upload } from 'antd';
import useIsAdmin from '../../../../../Hooks/useIsAdmin';
import pnp from 'sp-pnp-js';
import { Mention, MentionsInput } from 'react-mentions';
import mentionsInputStyle from '../mentionsInputStyle';
import axios from 'axios';
import { AppCtx } from '../../../../../App';



const ReplyForm = ({ fileList, setFileList, btnLoader, onFinish, replyForm }) => {
  const { sp_site } = useContext(AppCtx);
  const [isAdmin] = useIsAdmin("IT_Admin")
  const [replysTemplates, setReplysTemplates] = useState([]);
  const [textboxVal, setTextboxVal] = useState('');

  const fetchReplysTemplates = async () => {
    const response = await pnp.sp.web.lists.getByTitle('IT Replys Templates').items.get();
    setReplysTemplates(response);
    console.log(response);
  }
  useEffect(() => {
    if(isAdmin) {
      fetchReplysTemplates();
    }
  }, [isAdmin]);

  const items = replysTemplates.map((item, i) => ({
    key: i,
    label: (
      <Typography.Link onClick={() => replyForm.setFieldValue("reply_body", item.Content)}>
        {item.Title}
      </Typography.Link>
    ),
  }))

  const controller = new AbortController();
  const signal = controller.signal;
  var data = async function(query, callback) {
    /* debounce */
    if(query.length < 2) return;
    try {
      let response = await axios.get(`https://dev.salic.com/api/User/AutoComplete?term=${query}&_type=query&q=${query}&_=1667805757891`, { signal });
      const _usrs = response.data.Data.value.map((item) => ({ id: item.mail, display: item.displayName }))
      callback(_usrs);
    } catch(err) {
      console.log(err);
    }
  };
  useEffect(() => {
    return () => controller.abort();
  }, [textboxVal]);
  
  return (
    <Form form={replyForm} layout="vertical" onFinish={onFinish} onFinishFailed={() => message.error("Write Content First!")}> 
      <Space direction='vertical' style={{width: '100%'}}>
        <Form.Item name="reply_body" rules={[{required: true, message: ""}]} style={{ margin: 0 }}>
          {/* <TextArea rows={4} placeholder="Add Reply" maxLength={500} /> */}
          <MentionsInput
            rows={4}
            placeholder="Write Your Reply. Use '@' for mention"
            value={textboxVal}
            onChange={e => setTextboxVal(e.target.value)}
            style={mentionsInputStyle}
            a11ySuggestionsListLabel='select user'
          >
            <Mention 
              markup='@{display: __display__, id: __id__}' 
              style={{ backgroundColor: "#cfe6ff" }} 
              data={data}
              renderSuggestion={(entry, search, highlightedDisplay) => ( 
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <img src={`${sp_site}/_layouts/15/userphoto.aspx?size=s&username=${entry.id}`} width={20} style={{ borderRadius: 99 }} />
                  <span>{highlightedDisplay}</span>
                </div>
              )} 
            />
          </MentionsInput>
        </Form.Item>

        <Upload
          action="https://dev.salic.com/api/uploader/up"
          fileList={fileList}
          onChange={({ fileList: newFileList }) => setFileList(newFileList)}
        >
          <Button type='default' size='middle' icon={<UploadOutlined />}>Attach Files</Button>
        </Upload>


        {
          isAdmin
          ? (
            <Dropdown.Button
              type="primary"
              htmlType="submit"
              icon={<DownOutlined />}
              loading={btnLoader}
              menu={{ items }}
            >
              Add Feedback
            </Dropdown.Button>
          ) : (
            <Button htmlType="submit" type='primary' loading={btnLoader}>
              Add Feedback
            </Button>
          )
        }

      </Space>
    </Form>
  )
}

export default ReplyForm