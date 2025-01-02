import moment from "moment";
import "moment/locale/id";

export const getRelativeDate = (date: string | Date) => {
  moment.locale("id");
  const today = moment().startOf("day");
  const inputDate = moment(date).startOf("day");

  const diffDays = today.diff(inputDate, "days");
  if (diffDays === 0) {
    return "Hari ini";
  } else if (diffDays === 1) {
    return "Kemarin";
  } else {
    return inputDate.format("DD MMMM YYYY");
  }
};
