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
        let groupLvl_4 = Object.values(k).reduce((r, a) => {
          r[a.Year] = [
            ...(r[a.Year] || []),
            a,
          ];
          return r;
        }, {});
        dataTable.push({
          key: `${i}_${ii}_${ki}`,
          parent: Object.keys(groupLvl_1)[i],
          header: Object.keys(groupLvl_3)[ki],
          SubClassification: Object.keys(groupLvl_2)[ii],
          groupBy: "Description",
          level: 2,
          isEditable: false,
          DescriptionIndex: data.find(row => row.FType?.toLowerCase()?.toLowerCase() === Object.keys(groupLvl_1)[i]?.toLowerCase() && row.SubClassification?.toLowerCase() === Object.keys(groupLvl_2)[ii]?.toLowerCase() && row.Description?.toLowerCase() === Object.keys(groupLvl_3)[ki]?.toLowerCase())?.DescriptionIndex,
          children: [...Object.values(groupLvl_4).map((row_L4, i_L4) => {
            let groupLvl_5 = Object.values(row_L4).reduce((r, a) => {
              r[a.Month] = [...(r[a.Month] || []), a,];
              return r;
            }, {});
            return ({
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
              })],
            })
          })]
        });
      });
    });
  });
  return dataTable;
};