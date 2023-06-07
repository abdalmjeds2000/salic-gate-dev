export const groupedData = (data) => {
  let groups = data.reduce((r, a) => {
    r[a.field_1] = [...(r[a.field_1] || []), a];
    return r;
  }, {});
  
  let wwe = [];
  Object.values(groups).map((row, i) => {
    let rowEnabler = Object.values(row).reduce((r, a) => {
      r[a.field_2?.toLowerCase()] = [...(r[a.field_2?.toLowerCase()] || []), a];
      return r;
    }, {});
    Object.values(rowEnabler).map((a, index) => {
      let rowObjectives = Object.values(a).reduce((r, a) => {
        r[a.field_3?.toLowerCase()] = [
          ...(r[a.field_3?.toLowerCase()] || []),
          a,
        ];
        return r;
      }, {});
      wwe.push({
        key: 'row-level-1',
        parent: Object.keys(groups)[i],
        header: Object.keys(rowEnabler)[index],
        enablerTitle: `${index + 1}- ${Object.keys(rowEnabler)[index]}`,
        groupBy: "Enabler",
      });

      Object.values(rowObjectives).map((obj, ii) => {
        let rowKPIs = Object.values(obj).reduce((r, a) => {
          r[a.field_4?.toLowerCase()] = [
            ...(r[a.field_4?.toLowerCase()] || []),
            a,
          ];
          return r;
        }, {});
        wwe.push({
          key: 'row-level-2',
          parent: Object.keys(groups)[i],
          enabler: Object.keys(rowEnabler)[index],
          header: Object.keys(rowObjectives)[ii],
          groupBy: "Objective",
        });
        Object.values(rowKPIs).map((k, ki) => {
          wwe.push({
            key: k[0].ID,
            parent: Object.keys(groups)[i],
            header: Object.keys(rowKPIs)[ki],
            groupBy: "KPI",
            ...k[0]
          });
        });
      });
    });
  });

  const convertPercentageNumbers = wwe.map(item => {
    if(item.field_5 === "%") {
      item.field_14 = Number(item.field_14) * 100;
      item.field_22 = Number(item.field_22) * 100;
      item.Q1Target = Number(item.Q1Target) * 100;
      item.Q2Target = Number(item.Q2Target) * 100;
      item.Q3Target = Number(item.Q3Target) * 100;
      item.Q4Target = Number(item.Q4Target) * 100;
    }
    return item
  })
  return convertPercentageNumbers;
};
