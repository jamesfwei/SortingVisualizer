function Bar({ value, selected, sorted }) {
  return (
    <div
      style={{
        width: "30px",
        height: value,
        backgroundColor: sorted ? "green" : selected ? "blue" : "red",
        margin: "1px",
        textAlign: "center",
        padding: "2px",
        borderRadius: "5px",
      }}
    >
      {value}
    </div>
  );
}

export default Bar;
