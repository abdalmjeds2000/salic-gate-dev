import React, { useState } from 'react';
import { Button, Col, Divider, message, Modal, Row, Typography } from 'antd';
import { HiOutlineTrash } from "react-icons/hi";
import axios from 'axios';


const DeleteAction = ({ id, onFinish }) => {
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false);


  const handleDelete = async () => {
    setLoading(true);

    const response = await axios.post("https://dev.salic.com/api/reports/Delete", { Id: id });
    if(response?.data?.Status === 200) {
      setOpenModal(false);
      onFinish();
      message.success("Item information have been deleted successfully");
    }
    setLoading(false);
  }
  return (
    <>
      <Button type="primary" danger icon={<HiOutlineTrash size={16} />} onClick={() => setOpenModal(true)} style={{ display: "flex", alignItems: "center", gap: 5 }}>
        Delete
      </Button>
      <Modal
        title="WARNING"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        destroyOnClose
        footer={null}
      >
        <Typography.Text style={{ fontSize: "1.5rem" }}>
          Warning! Delete tree item?
        </Typography.Text>

        <Divider />

        <Row gutter={3} justify="end">
          <Col>
            <Button type='primary' htmlType='submit' danger loading={loading} onClick={handleDelete}>
              Delete it!
            </Button>
          </Col>
          <Col>
            <Button onClick={() => setOpenModal(false)} style={{ borderRadius: 5 }}>Close</Button>
          </Col>
        </Row>
      </Modal>
    </>
  )
}

export default DeleteAction