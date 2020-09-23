import { statesObject } from "./states";

// FINDS IF REGION IS A STATE AND ABBREVIATES IF TRUE
const findState = (stateName) => {
  const findStateObject = statesObject.find(
    (state) => state.name.toUpperCase() === stateName.toUpperCase()
  );
  if (findStateObject) {
    return findStateObject["alpha-2"];
  } else return stateName;
};
export { findState };
