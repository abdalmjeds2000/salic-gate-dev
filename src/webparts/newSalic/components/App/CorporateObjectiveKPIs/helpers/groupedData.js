import { roundedNum } from "../../Global/roundedNum";

export const groupedData = (data) => {
  let groups = data.reduce((r, a) => {
    r[a.field_1] = [...(r[a.field_1] || []), a];
    return r;
  }, {});
  
  let wwe = [];
  Object.values(groups).map((row, i) => {
    let rowObjectives = Object.values(row).reduce((r, a) => {
      r[a.field_3?.toLowerCase()] = [
        ...(r[a.field_3?.toLowerCase()] || []),
        a,
      ];
      return r;
    }, {});
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

  const convertPercentageNumbers = wwe.map(item => {
    if(item.field_5 === "%") {
      item.field_14 = roundedNum(Number(item.field_14) * 100);
      item.field_22 = roundedNum(Number(item.field_22) * 100);
      item.TargetQ1 = roundedNum(Number(item.TargetQ1) * 100);
      item.ActualQ1 = roundedNum(Number(item.ActualQ1) * 100);
      item.TargetQ2 = roundedNum(Number(item.TargetQ2) * 100);
      item.ActualQ2 = roundedNum(Number(item.ActualQ2) * 100);
      item.TargetQ3 = roundedNum(Number(item.TargetQ3) * 100);
      item.ActualQ3 = roundedNum(Number(item.ActualQ3) * 100);
      item.TargetQ4 = roundedNum(Number(item.TargetQ4) * 100);
      item.ActualQ4 = roundedNum(Number(item.ActualQ4) * 100);
    }
    return item
  })
  return convertPercentageNumbers;
};
