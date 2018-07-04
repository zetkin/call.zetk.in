export const getNumbers = (target) => {
    let numbers = [];
    if (target.get("phone")) {
        numbers.push(target.get("phone"))
    }
    if (target.get("alt_phone")) {
        numbers.push(target.get("alt_phone"))
    }
    return numbers;
}