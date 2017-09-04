export const IteratorArr = (arr, type) => {
  let rtnValue
  for (let [k, v] of arr) {
    if (k === type) {
      rtnValue = v
    }
  }
  return rtnValue
}
