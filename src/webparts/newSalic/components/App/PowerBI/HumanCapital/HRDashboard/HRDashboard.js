import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppCtx } from '../../../App';
import HistoryNavigation from '../../../Global/HistoryNavigation/HistoryNavigation';

// import { PowerBIEmbed } from 'powerbi-client-react';
// import { models } from 'powerbi-client';
// import { BearerToken } from "@pnp/queryable";
// import axios from 'axios';
import ProtectRoutePowerBI from '../../../../Routers/ProtectRoutes/ProtectRoutePowerBI';




function HRDashboard() {
  const navigate = useNavigate();
  const { defualt_route, sp_context } = useContext(AppCtx);
  

  // useEffect(async () => {

  //   var data = new FormData();
  //   data.append('grant_type', 'client_credentials');
  //   data.append('client_secret', 'Acx3jHswzYXrK4fkVy+QO1ZMYssXwKwgmmb0TVmgjDI=');
  //   data.append('client_id', '8993b048-de71-4fed-98b8-6dae2c6d7503');
  //   data.append('resource', 'https://analysis.windows.net/powerbi/api');
    
  //   var config = {
  //     method: 'post',
  //     url: 'https://login.microsoftonline.com/bea1b417-4237-40b8-b020-57fce9abdb43/oauth2/token',
  //     headers: { 
  //       'Cookie': 'fpc=AgKyHCSxG0ZOlC4qHxBT4XGAjGf5AwAAAFJINdsOAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd', 
  //     },
  //     data : data
  //   };
    
  //   axios(config)
  //   .then(function (response) {
  //     console.log(JSON.stringify(response.data));
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });




  // }, []);



  return (
    <ProtectRoutePowerBI>
      <HistoryNavigation>
        <a onClick={() => navigate(`${defualt_route}/power-bi-dashboards`)}>Power BI Interactive Dashboards</a>
        <a onClick={() => navigate(`${defualt_route}/power-bi-dashboards/human-capital`)}>Human Capital</a>
        <p>HR Dashboard</p>
      </HistoryNavigation>

      
      <div className='folder-explorer-container'>

        <div className='power-bi-iframe-container'>
          <iframe 
            title="HR Dashboard" 
            width="100%" 
            height="100%" 
            src="https://app.powerbi.com/reportEmbed?reportId=154b3d50-6a43-447b-8eee-3d8b37706d54&autoAuth=true&ctid=bea1b417-4237-40b8-b020-57fce9abdb43" 
            frameborder="0"
            allowFullScreen="true"
          ></iframe>
        </div>


        {/* <PowerBIEmbed
          embedConfig = {{
            type: 'report',   // Supported types: report, dashboard, tile, visual and qna
            id: '81440f0b-fa4a-48a3-bc5a-0f1be0cfb7b5',
            embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=81440f0b-fa4a-48a3-bc5a-0f1be0cfb7b5&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVdFU1QtRVVST1BFLUQtUFJJTUFSWS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsibW9kZXJuRW1iZWQiOnRydWUsInVzYWdlTWV0cmljc1ZOZXh0Ijp0cnVlfX0%3d',
            accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvYmVhMWI0MTctNDIzNy00MGI4LWIwMjAtNTdmY2U5YWJkYjQzLyIsImlhdCI6MTY3MTY0MTEzNywibmJmIjoxNjcxNjQxMTM3LCJleHAiOjE2NzE2NDU2MTksImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84VEFBQUEvK0xWbXRCOXhYNE5OU3N5UDV2OEZqTjBmSU5ZdEVxbFN0ckRjK2hlT0g5cnlweVgrZ3pQS29KZ1FMRXR4VlBWIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6IjE4ZmJjYTE2LTIyMjQtNDVmNi04NWIwLWY3YmYyYjM5YjNmMyIsImFwcGlkYWNyIjoiMCIsImdpdmVuX25hbWUiOiJTQUxJQyIsImlwYWRkciI6Ijg2LjEwNC4xOTEuNSIsIm5hbWUiOiJTQUxJQyIsIm9pZCI6Ijc2NDk4Nzg2LWM3NjAtNDg2OC1iZjAwLTlmMTMwNzg0ZjJkNCIsInB1aWQiOiIxMDAzM0ZGRkFBMDdGMTlBIiwicmgiOiIwLkFVZ0FGN1NodmpkQ3VFQ3dJRmY4NmF2YlF3a0FBQUFBQUFBQXdBQUFBQUFBQUFCSUFBMC4iLCJzY3AiOiJBcHAuUmVhZC5BbGwgQ2FwYWNpdHkuUmVhZC5BbGwgQ2FwYWNpdHkuUmVhZFdyaXRlLkFsbCBDb250ZW50LkNyZWF0ZSBEYXNoYm9hcmQuUmVhZC5BbGwgRGFzaGJvYXJkLlJlYWRXcml0ZS5BbGwgRGF0YWZsb3cuUmVhZC5BbGwgRGF0YWZsb3cuUmVhZFdyaXRlLkFsbCBEYXRhc2V0LlJlYWQuQWxsIERhdGFzZXQuUmVhZFdyaXRlLkFsbCBHYXRld2F5LlJlYWQuQWxsIEdhdGV3YXkuUmVhZFdyaXRlLkFsbCBQaXBlbGluZS5EZXBsb3kgUGlwZWxpbmUuUmVhZC5BbGwgUGlwZWxpbmUuUmVhZFdyaXRlLkFsbCBSZXBvcnQuUmVhZC5BbGwgUmVwb3J0LlJlYWRXcml0ZS5BbGwgU3RvcmFnZUFjY291bnQuUmVhZC5BbGwgU3RvcmFnZUFjY291bnQuUmVhZFdyaXRlLkFsbCBUZW5hbnQuUmVhZC5BbGwgVGVuYW50LlJlYWRXcml0ZS5BbGwgVXNlclN0YXRlLlJlYWRXcml0ZS5BbGwgV29ya3NwYWNlLlJlYWQuQWxsIFdvcmtzcGFjZS5SZWFkV3JpdGUuQWxsIiwic3ViIjoiNTNTcjZCQ1NBaEU5QnB1aGtLZXU2U3hCcXhKVGJjUHhGOS12bWNMN0h2OCIsInRpZCI6ImJlYTFiNDE3LTQyMzctNDBiOC1iMDIwLTU3ZmNlOWFiZGI0MyIsInVuaXF1ZV9uYW1lIjoic3RzYWRtaW5Ac2FsaWMub25taWNyb3NvZnQuY29tIiwidXBuIjoic3RzYWRtaW5Ac2FsaWMub25taWNyb3NvZnQuY29tIiwidXRpIjoiaFdqekFMSVhSMEt3Sm1wRGFUVWpBUSIsInZlciI6IjEuMCIsIndpZHMiOlsiZjI4YTFmNTAtZjZlNy00NTcxLTgxOGItNmExMmYyYWY2YjZjIiwiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il19.Gnj622aXeT8Ngk2gzqSERGq1Y0qTpifSLAMP-uvEfnEF7UL86QqnQOm1SARtXdlq7US2U8Cc619gQjEHanDvo24ZJwICmrGdD4MJFOWOTPTGW7YiCqSk9762PxeXtKbH9Z_ah_IEqla-Phm_SJxl6gwPJMZKrm73lxnzdb49SC7l_Da7AwSv4xPMAlq3KZSmKckBywZLvwnhK_ITQB0I4vZIpC9KQ9qi6EWbSznXrtx97jGgBWCdTKc2TZjNAoLN2RVtvhU77RgbfHAJxnT1g6aMfxjvHJxnLj5cpB8zSUSe0bAJhg_kDH_asQnuVPzLPzHRg0rTZ0MiuANOTDgSVw',
            tokenType: models.TokenType.Aad,
            settings: {
              panes: {
                filters: {
                  expanded: false,
                  visible: true
                }
              },
              background: models.BackgroundType.Transparent,
            }
          }}

          eventHandlers = { 
            new Map([
              ['loaded', function () {console.log('Report loaded');}],
              ['rendered', function () {console.log('Report rendered');}],
              ['error', function (event) {console.log(event);}]
            ])
          }
            
          cssClassName = { "report-style-class" }

          getEmbeddedComponent = { (embeddedReport) => {
            window.report = embeddedReport;
          }}
        /> */}

      </div>
    </ProtectRoutePowerBI>
  )
}

export default HRDashboard