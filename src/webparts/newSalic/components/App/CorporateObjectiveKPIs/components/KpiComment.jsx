import React, { useEffect, useState } from 'react';
import { CommentOutlined } from '@ant-design/icons';
import { Button, Form, message, Modal, Tooltip } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import UpdateItem from '../API/UpdateItem';
import GetKpiItem from '../API/GetKpiItem';

function KpiComment(props) {
  const [openModal, setOpenModal] = useState(false)
  const [btnLoader, setBtnLoader] = useState(0);
  const [form] = Form.useForm();
  const [item, setItem] = useState({});

  const fetchItem = async () => {
    const item = await GetKpiItem(props.KpiId);
    setItem(item);
  }

  useEffect(() => {
    if(openModal) {
      fetchItem();
    }
  }, [openModal]);


  const AddComment = async (FormData) => {
    setBtnLoader(true);
    console.log('comment FormData', FormData)
    if(item.Comment !== FormData.Comment) {
      const updateResponse = await UpdateItem(props.KpiId, FormData);
      setOpenModal(false);
      message.success("Your Comment has been Added Successfully");
    } else {
      message.error("Error, same last Comment!");
    }

    setBtnLoader(false);
  }
  return (
    <>
      <Tooltip placement="left" title="Click to Add Comment">
        <a onClick={() => setOpenModal(true)}>
          <CommentOutlined style={{width: '100%'}} />
        </a>
      </Tooltip>
      <Modal
        title={`Comment for KPI .::: ${props.KpiTitle} :::.`}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        okButtonProps={{ style: {display: 'none'}}}
        destroyOnClose
      >
        {
          Object.keys(item).length > 0 
          ? <Form name="KPI-Comment" form={form} onFinish={AddComment} layout="vertical" onFinishFailed={() => message.error("Fill Form Correctly!")}>
              <Form.Item
                label="Comment"
                name="Comment"
                rules={[{required: true, message: ''}]}
                initialValue={item.Comment}
              >
                <TextArea showCount rows={4} maxLength={500} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={{width: '100%'}} disabled={btnLoader}>
                  Send Comment
                </Button>
              </Form.Item>
            </Form>
          : null
        }
      </Modal>
    </>
  )
}

export default KpiComment