import React, { useEffect } from 'react';
const editStyle = () => {
  try {
    var iframe = document.getElementById("spIframe");
    var elmnt = iframe.contentWindow.document.getElementsByClassName("od-ItemsScopeList-content")[0];
    elmnt.style.backgroundColor = "#fff";
    var btn = iframe.contentWindow.document.getElementsByClassName("od-ItemContent-header")[0].children[1];
    btn.style.visibility = "hidden";
  } catch {
    console.log('failed hide some elements in Organization iframe');
  }
}


function Organization() {

  useEffect(() => {
    document.title = '.:: SALIC Gate | Organization ::.';
  }, []);


  return (
    <div>
      <iframe 
        src='https://devsalic.sharepoint.com/sites/newsalic/KSA/Forms/AllItems.aspx?id=%2Fsites%2Fnewsalic%2FKSA%2FKSA&viewid=018cffe9%2Dcb6e%2D4574%2D9e9d%2D9e663c4909d1' 
        width='100%'
        id='spIframe'
        onLoad={editStyle}
      >
      </iframe>
    </div>
  )
}

export default Organization