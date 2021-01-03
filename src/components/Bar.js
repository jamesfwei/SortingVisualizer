import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";

export default function Bar({ value, selected, sorted }) {
  return (
    <div
      style={{
        width: "30px",
        height: value,
        color: "#fff",
        backgroundColor: selected ? "blue" : sorted ? "green" : "red",
        textAlign: "center",
        borderRadius: "5px 5px 0px 0px",
      }}
    >
      <Typography>{value}</Typography>
    </div>
  );
}

Bar.propTypes = {
  value: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  sorted: PropTypes.bool.isRequired,
};
