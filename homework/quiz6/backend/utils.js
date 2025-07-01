export function getToday() {
  const date = new Date();
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate());
  const hh = String(date.getHours()).padStart(2, "0");
  const nn = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

console.log(getToday());
