import React from 'react';
import axios from 'axios';

function processTextWithLink(text) {
  if (!text) return '';

  const linkRegex = /(https?:\/\/\S+)/g;
  const matches = text.match(linkRegex);

  if (matches) {
    matches.forEach((match) => {
      const link = `<a href="${match}" target="_blank">${match}</a>`;
      text = text.replace(match, link);
    });
  }

  return text;
}
const correctImgs = (data) => {
  let imgs = document.getElementsByTagName("img");
  for (const element of imgs) {
    if(element.src.startsWith("cid")) {
      let name = element.src.split('@')[0].replace('cid:','');
      var deleteImg = data?.Files?.filter(f => f.FileName === name)[0];
      var src = `https://dev.salic.com/file/${deleteImg?.Guid}`;
      element.setAttribute('src', src);
    }
  }
}


function isHTML(text) {
  const htmlRegex = /<[a-z][\s\S]*>/i;
  return htmlRegex.test(text);
}

const HoverTicketDescription = ({ RequestId }) => {
  const [data, setData] = React.useState({ Description: 'Loading...' });
  React.useEffect(() => {
    const fetchData = async () => {
      const result = await axios(`https://dev.salic.com/api/Tracking/GetShort?id=${RequestId}`);
      if(result?.data?.Status === 200) {
        setData(result?.data?.Data);
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    correctImgs(data);
  }, [data]);
  
  
  return (
    <div className='desc-tooltip-text-black' dangerouslySetInnerHTML={{ __html: isHTML(data?.Description) ? data?.Description : processTextWithLink(data?.Description) }} />
  )
}

export default HoverTicketDescription