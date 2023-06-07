// import pnp from 'sp-pnp-js';


export const groupedData = (data) => {
  let groupLvl_1 = data.reduce((r, a) => {
    r[a.FType] = [...(r[a.FType] || []), a];
    return r;
  }, {});
  
  let dataTable = [];

  Object.values(groupLvl_1).map((row, i) => {
    let groupLvl_2 = Object.values(row).reduce((r, a) => {
      r[a.SubClassification] = [
        ...(r[a.SubClassification] || []),
        a,
      ];
      return r;
    }, {});
    Object.values(groupLvl_2).map((obj, ii) => {
      let groupLvl_3 = Object.values(obj).reduce((r, a) => {
        r[a.Description] = [
          ...(r[a.Description] || []),
          a,
        ];
        return r;
      }, {});
      dataTable.push({
        key: `${i}_${ii}`,
        parent: Object.keys(groupLvl_1)[i],
        header: Object.keys(groupLvl_2)[ii],
        groupBy: "SubClassification",
        level: 1,
        isEditable: false,
      });
      Object.values(groupLvl_3).map((k, ki) => {
        dataTable.push({
          key: `${i}_${ii}_${ki}`,
          parent: Object.keys(groupLvl_1)[i],
          header: Object.keys(groupLvl_3)[ki],
          SubClassification: Object.keys(groupLvl_2)[ii],
          groupBy: "Description",
          level: 2,
          isEditable: false,
          DescriptionIndex: data.find(row => row.FType?.toLowerCase()?.toLowerCase() === Object.keys(groupLvl_1)[i]?.toLowerCase() && row.SubClassification?.toLowerCase() === Object.keys(groupLvl_2)[ii]?.toLowerCase() && row.Description?.toLowerCase() === Object.keys(groupLvl_3)[ki]?.toLowerCase())?.DescriptionIndex,
        });
        let groupLvl_4 = Object.values(k).reduce((r, a) => {
          r[a.Year] = [
            ...(r[a.Year] || []),
            a,
          ];
          return r;
        }, {});
        Object.values(groupLvl_4).map((row_L4, i_L4) => {
          let groupLvl_5 = Object.values(row_L4).reduce((r, a) => {
            r[a.Month] = [...(r[a.Month] || []), a,];
            return r;
          }, {});
          dataTable.push({
            key: `${i}_${ii}_${ki}_${i_L4}`,
            parent: Object.keys(groupLvl_1)[i],
            header: Object.keys(groupLvl_4)[i_L4],
            groupBy: "Year",
            level: 3,
            isEditable: false,
            children: [...Object.values(groupLvl_5).map((row_L5, i_L5) => {
              return ({
                Id: row_L5[0].Id,
                key: `${i}_${ii}_${ki}_${i_L4}_${i_L5}`,
                parent: Object.keys(groupLvl_1)[i],
                header: Object.keys(groupLvl_5)[i_L5],
                groupBy: "Month",
                isEditable: true,
                level: 4,
                ...row_L5[0],
              });
            })]
          });
          // Object.values(groupLvl_5).map((row_L5, i_L5) => {
          //   row_L5[0].Change = Number(row_L5[0].Change) * 100;
          //   row_L5[0].Variance = Number(row_L5[0].Variance) * 100;
        
          //   dataTable.push({
          //     Id: row_L5[0].Id,
          //     key: `${i}_${ii}_${ki}_${i_L4}_${i_L5}`,
          //     parent: Object.keys(groupLvl_1)[i],
          //     header: Object.keys(groupLvl_5)[i_L5],
          //     groupBy: "Month",
          //     isEditable: true,
          //     level: 4,
          //     ...row_L5[0],
          //   });
          // });
        });
      });
    });
  });

  // const dataAfterConvertPercNumbers = dataTable?.map(item => {
  //   item.Change = Number(item.Change) * 100;
  //   item.Variance = Number(item.Variance) * 100;

  //   return item;
  // });
  return dataTable;
};




const descriptions = [
  // { Type: "Group Revenues", SubClassification: "Revenue", Description: "SALIC Ukraine" },
  // { Type: "Group Revenues", SubClassification: "Revenue", Description: "SALIC Australia" }, 
  // { Type: "Group Revenues", SubClassification: "Revenue", Description: "SALIC KSA / UFIC" }, 
  // { Type: "Group Revenues", SubClassification: "Revenue", Description: "Consolidated revenues" }, 
  // { Type: "Group Net Income", SubClassification: "International Investments", Description: "SALIC Ukraine " },
  // { Type: "Group Net Income", SubClassification: "International Investments", Description: "SALIC Australia" }, 
  // { Type: "Group Net Income", SubClassification: "International Investments", Description: "Olam share of results" }, 
  // { Type: "Group Net Income", SubClassification: "International Investments", Description: "Minerva share of results" }, 
  // { Type: "Group Net Income", SubClassification: "International Investments", Description: "Minerva warrants FV gain" }, 
  // { Type: "Group Net Income", SubClassification: "International Investments", Description: "G3 share of results" }, 
  // { Type: "Group Net Income", SubClassification: "International Investments", Description: "HTL share of results" }, 
  // { Type: "Group Net Income", SubClassification: "International Investments", Description: "MFA share of results" }, 
  // { Type: "Group Net Income", SubClassification: "International Investments", Description: "Daawat/ LT Foods share of results" }, 
  // { Type: "Group Net Income", SubClassification: "International Investments", Description: "Income from International Investments" }, 
  // { Type: "Group Net Income", SubClassification: "Local Investments", Description: "Almarai - dividends income" }, 
  // { Type: "Group Net Income", SubClassification: "Local Investments", Description: "NADEC share of results" }, 
  // { Type: "Group Net Income", SubClassification: "Local Investments", Description: "Saudi Fisheries share" }, 
  // { Type: "Group Net Income", SubClassification: "Local Investments", Description: "NGC share of results" }, 
  // { Type: "Group Net Income", SubClassification: "Local Investments", Description: "Income from Local Investments" }, 
  // { Type: "Group Net Income", SubClassification: "Net Income Before Holiding Cost", Description: "Consolidated Net Income Before Holiding Cost " }, 
  // { Type: "Group Net Income", SubClassification: "Holding Cost", Description: "UFIC Sub-Holding Company" }, 
  // { Type: "Group Net Income", SubClassification: "Holding Cost", Description: "UK Sub-Holding Company" }, 
  // { Type: "Group Net Income", SubClassification: "Holding Cost", Description: "SIIC Sub-Holding Company" }, 
  // { Type: "Group Net Income", SubClassification: "Holding Cost", Description: "KSA Holding Company" }, 
  // { Type: "Group Net Income", SubClassification: "Holding Cost", Description: "Consol adjustments" }, 
  // { Type: "Group Net Income", SubClassification: "Group Net Income (Loss)", Description: "Consolidated Net Income (Loss)" }, 
  // { Type: "Consolidated EBITDA", SubClassification: "EBITDA", Description: "EBITDA" },
  // { Type: "Balance Sheet", SubClassification: "Non Current Assets", Description: "Intangible Assets" }, 
  // { Type: "Balance Sheet", SubClassification: "Non Current Assets", Description: "Investment in Associates" }, 
  // { Type: "Balance Sheet", SubClassification: "Non Current Assets", Description: "Investment in Joint Ventures" }, 
  // { Type: "Balance Sheet", SubClassification: "Non Current Assets", Description: "Investment in Financial Assets at FVTOCI" }, 
  // { Type: "Balance Sheet", SubClassification: "Non Current Assets", Description: "Other Non-Current Assets" }, 
  // { Type: "Balance Sheet", SubClassification: "Total Non-Current Assets", Description: "Total Non-Current Assets" }, 
  // { Type: "Balance Sheet", SubClassification: "Current Assets", Description: "Cash and cash equivalents" }, 
  // { Type: "Balance Sheet", SubClassification: "Current Assets", Description: "Investment in Financial Assets at FVTPL" }, 
  // { Type: "Balance Sheet", SubClassification: "Current Assets", Description: "Other Current Assets" }, 
  // { Type: "Balance Sheet", SubClassification: "Total Current Assets", Description: "Total Current Assets" }, 
  // { Type: "Balance Sheet", SubClassification: "Total Assets", Description: "Total Assets" },
  // { Type: "Balance Sheet", SubClassification: "Shareholder's Equity", Description: "Total Shareholder's Equity" }, 
  // { Type: "Balance Sheet", SubClassification: "Non-Current Liabilities", Description: "Debt - Long Term" }, 
  // { Type: "Balance Sheet", SubClassification: "Non-Current Liabilities", Description: "Other Non-Current Liabilities" }, 
  // { Type: "Balance Sheet", SubClassification: "Total Non-Current Liabilities", Description: "Total Non-Current Liabilities" }, 
  // { Type: "Balance Sheet", SubClassification: "Current Liabilities", Description: "Debt - Short Term" }, 
  // { Type: "Balance Sheet", SubClassification: "Current Liabilities", Description: "Other Current Liabilities" }, 
  // { Type: "Balance Sheet", SubClassification: "Total Current Liabilities", Description: "Total Current Liabilities" }, 
  // { Type: "Balance Sheet", SubClassification: "Total Liabilities and Equity", Description: "Total Liabilities and Equity" }, 
  // { Type: "Cash Flow", SubClassification: "Operating Cash Flow", Description: "Gross operating cash flows" }, 
  // { Type: "Cash Flow", SubClassification: "Operating Cash Flow", Description: "Net change in working capital" }, 
  // { Type: "Cash Flow", SubClassification: "Net Operating Cash Flow", Description: "Net cash flows from operating activities" }, 
  // { Type: "Cash Flow", SubClassification: "Investing Cash Flow", Description: "Property, plant and equipment" }, 
  // { Type: "Cash Flow", SubClassification: "Investing Cash Flow", Description: "Investments in associates and JVs" }, 
  // { Type: "Cash Flow", SubClassification: "Investing Cash Flow", Description: "Investments in financial assets" }, 
  // { Type: "Cash Flow", SubClassification: "Investing Cash Flow", Description: "Dividends and finance income" }, 
  // { Type: "Cash Flow", SubClassification: "Net Investing activities", Description: "Net cash flows from investing activities" }, 
  // { Type: "Cash Flow", SubClassification: "Finance Cash Flow", Description: "Increase in capital" }, 
  // { Type: "Cash Flow", SubClassification: "Finance Cash Flow", Description: "Net movement in bank loans and lease liabilities" }, 
  // { Type: "Cash Flow", SubClassification: "Net Financing activities", Description: "Net cash flows from financing activities" }, 
  // { Type: "Cash Flow", SubClassification: "Net Cash flow", Description: "Net cash flows during the year" }, 
  // { Type: "Cash Flow", SubClassification: "Cash Equivalent", Description: "Cash and cash equivalents - beginning" }, 
  // { Type: "Cash Flow", SubClassification: "Cash Equivalent END", Description: "Cash and cash equivalents - at year end" }, 
  // { Type: "Income Statement", SubClassification: "Income Statement", Description: "Revenue" },
  // { Type: "Income Statement", SubClassification: "Income Statement", Description: "Cost of Sales " },
  // { Type: "Income Statement", SubClassification: "Gross Profit", Description: "Gross Profit" },
  // { Type: "Income Statement", SubClassification: "Income Statement", Description: "Selling, general & administration expenses" },
  // { Type: "Income Statement", SubClassification: "Income Statement", Description: "Other operating income (loss), net" },
  // { Type: "Income Statement", SubClassification: "Income Statement", Description: "Share in results of associates" },
  // { Type: "Income Statement", SubClassification: "Income Statement", Description: "Share in results of joint ventures" },
  // { Type: "Income Statement", SubClassification: "Income Statement", Description: "Net gain on financial assets at FVTPL" },
  // { Type: "Income Statement", SubClassification: "Income Statement", Description: "Income before interest & tax" },
  // { Type: "Income Statement", SubClassification: "Income Statement", Description: "Finance costs, net" },
  // { Type: "Income Statement", SubClassification: "Income Statement", Description: "Profit before tax" },
  // { Type: "Income Statement", SubClassification: "Income Statement", Description: "Tax" },
  // { Type: "Income Statement", SubClassification: "Income Statement", Description: "Net Profit" },
  // { Type: "Income Statement", SubClassification: "Income Statement", Description: "EBITDA" },
];
// const dates = {
//   2018: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
//   2019: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
//   2020: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
//   2021: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
//   2022: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
//   2023: [1, 2, 3, 4],
// };

// export const handleCreateItems = async () => {
//   for(const item of descriptions) {
//     for (const year in dates) {
//       for(const month of dates[year]) {
//         const newItem = {
//           Title: "",
//           FType: item.Type,
//           SubClassification: item.SubClassification,
//           Description: item.Description,
//           Year: year,
//           Month: month,
//           Actual: 0,
//           Budget: 0,
//           Forcast: 0,
//           Change: 0,
//           Variance: 0,
//           DescriptionIndex: 1,
//         }
//         pnp.sp.web.lists.getByTitle('FinanceMaster').items.add(newItem);
//         console.log("item created => ", newItem.Description);
//       }
//     }
//   }
// }