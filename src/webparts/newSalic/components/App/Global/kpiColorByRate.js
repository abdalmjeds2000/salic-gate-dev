class kpiColorByRate {
  constructor(number) {
    this.number = number;
  }
  getColor() {
    let num = +this.number;
    if(num < 50) return "#ff4477"
    else if(num >= 50 && num < 70) return "#ffb864"
    else if(num >= 70 && num <= 100) return "#05d17c"
    else return "#74c4ff"
  }
  getDarkColor() {
    let num = +this.number;
    if(num < 50) return "#c0244f"
    else if(num >= 50 && num < 70) return "#c5873e"
    else if(num >= 70 && num <= 100) return "#03a260"
    else return "#4d91c4"
  }
}

export default kpiColorByRate;