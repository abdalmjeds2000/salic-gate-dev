import React from 'react'
import { Button, Form, Modal, Select, message } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import pnp from 'sp-pnp-js';
import TextArea from 'antd/lib/input/TextArea';



const ManageSnapshotsLinks = ({ defaultPage, onUpdate }) => {
  const [openModal, setOpenModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [pagesList, setPagesList] = React.useState([]);
  const [selectedPage, setSelectedPage] = React.useState(null);
  const [link, setLink] = React.useState(null);

  const getPages = async () => {
    setLoading(true);
    try {
      const pages = await pnp.sp.web.lists.getByTitle('BoD Snapshots Links').items.get();
      setPagesList(pages);
      if (defaultPage) {
        const page = pages.find(page => page?.Title === defaultPage);
        if (page) {
          setSelectedPage(page?.Id);
          setLink(page?.Link);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }
  React.useEffect(() => {
    getPages();
  }, []);


  React.useEffect(() => {
    if(selectedPage) {
      const page = pagesList?.find(page => page?.Id === selectedPage);
      if (page) setLink(page.Link);
    }
  }, [selectedPage]);

  const handleUpdateLink = async () => {
    setLoading(true);
    try {
      await pnp.sp.web.lists.getByTitle('BoD Snapshots Links').items.getById(selectedPage).update({ Link: link });
      const newPagesList = pagesList.map(page => {
        if (page.Id === selectedPage) {
          return { ...page, Link: link };
        }
        return page;
      });
      setPagesList(newPagesList);
      setLoading(false);
      message.success('Link updated successfully');
      if(onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <Button type='primary' icon={<LinkOutlined />} onClick={() => setOpenModal(true)}>
        Manage Snapshots
      </Button>

      <Modal
        title="Manage Snapshots"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
      >
        <Form layout='vertical'>
          <Form.Item label="Page" required>
            <Select
              placeholder="Select a page"
              allowClear
              showSearch
              value={selectedPage}
              onChange={setSelectedPage}
              optionFilterProp="children"
              disabled={loading}
              filterOption={(input, option) => option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}
            >
              {pagesList.map(page => <Select.Option key={page.Id} value={page.Id}>{page.Title}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="Link" required>
            <TextArea rows={4} placeholder="Enter link" disabled={loading} value={link} onChange={e => setLink(e.target.value)} />
          </Form.Item>
          <Form.Item style={{margin: 0}}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="primary" onClick={handleUpdateLink} loading={loading} disabled={!selectedPage || !link || link?.trim() === ''}>
                Save
              </Button>
              <Button onClick={() => setOpenModal(false)} style={{ marginLeft: 8 }}>
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ManageSnapshotsLinks