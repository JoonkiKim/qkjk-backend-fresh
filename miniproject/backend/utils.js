export function getToday() {
  return "2022-10-02";
}

export function maskLastSeven(personal) {
  return personal.replace(/(\d{6}-)\d{7}/, "$1*******");
}
