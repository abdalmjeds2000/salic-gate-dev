export const groupedData = (data) => {
  let groupLvl_1 = data.reduce((r, a) => {
    r[a.KeyFinancialRatio] = [...(r[a.KeyFinancialRatio] || []), a];
    return r;
  }, {});
  
  let dataTable = [];

  Object.values(groupLvl_1).map((row, i) => {
    let groupLvl_2 = Object.values(row).reduce((r, a) => {
      r[a.Measures] = [
        ...(r[a.Measures] || []),
        a,
      ];
      return r;
    }, {});
    Object.values(groupLvl_2).map((obj, ii) => {
      dataTable.push({
        key: `${i}_${ii}`,
        parent: Object.keys(groupLvl_1)[i],
        header: Object.keys(groupLvl_2)[ii],
        groupBy: "Measures",
        level: 1,
        isEditable: false,
      });
      let groupLvl_3 = Object.values(obj).reduce((r, a) => {
        r[a.Year] = [
          ...(r[a.Year] || []),
          a,
        ];
        return r;
      }, {});
      Object.values(groupLvl_3).map((k, ki) => {
        let groupLvl_4 = Object.values(k).reduce((r, a) => {
          r[a.Month] = [
            ...(r[a.Month] || []),
            a,
          ];
          return r;
        }, {});
        dataTable.push({
          key: `${i}_${ii}_${ki}`,
          parent: Object.keys(groupLvl_1)[i],
          Measures: Object.keys(groupLvl_2)[ii],
          header: Object.keys(groupLvl_3)[ki],
          groupBy: "Year",
          level: 2,
          isEditable: false,
          children: [...Object.values(groupLvl_4).map((row_L4, i_L4) => {
            return ({
              Id: row_L4[0].Id,
              key: `${i}_${ii}_${ki}${i_L4}`,
              parent: Object.keys(groupLvl_1)[i],
              header: Object.keys(groupLvl_4)[i_L4],
              groupBy: "Month",
              isEditable: true,
              level: 3,
              ...row_L4[0],
            });
          })]
        });
      });
    });
  });
  return dataTable;
};