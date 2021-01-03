import { IconButton, Snackbar } from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import PropTypes from "prop-types";
import React from "react";

export default function MySnackbar({ open, setOpen, message }) {
  const handleClose = (e, reason) => reason !== "clickaway" && setOpen(false);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      message={message}
      action={
        <React.Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    />
  );
}

MySnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};
