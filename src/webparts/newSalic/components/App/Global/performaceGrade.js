const performaceGrade = (grade) => {
  if(grade >= 0 && grade <= 75) {
    return {Grade: "Below Expectation", Color: '#EF9494'}
  } else if(grade > 75 && grade < 90) {
    return {Grade: "Partially Meets Expectations", Color: '#FABD81'}
  } else if(grade >= 90 && grade <= 100) {
    return {Grade: "Meets Expectations", Color: '#55ACEE'}
  } else if(grade > 100 ) {
    return {Grade: "Exceeds Expectations", Color: '#277C62'}
  } else {
    return "?"
  }
}

export default performaceGrade;