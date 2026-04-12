export const getStatusClass = (status) => {
  if (status === "Published") return "badge green";
  if (status === "Under Review") return "badge yellow";
  if (status === "Needs Revision") return "badge red";
  return "badge";
};
