import {
  Canister,
  Variant,
  text,
  Result,
  update,
  query,
  Ok,
  Err,
  Record,
  StableBTreeMap,
  nat64,
  ic,
} from "azle";

const Name = Record({
  name: text,
  createdAt: nat64,
});

// Initialize error variants.
const Error = Variant({
  NotFound: text,
  Unauthorized: text,
  Forbidden: text,
  BadRequest: text,
  InternalError: text,
});

const nameStorage = StableBTreeMap(0, text, Name);

export default Canister({
  helloWorld: query([text], Result(text, Error), (name) => {
    if (!name) {
      return Err({ BadRequest: "Name is required" });
    }

    return Ok(`Hello ${name}`);
  }),
  saveName: update([text], Result(text, Error), (name) => {
    if (!name) {
      return Err({ BadRequest: "Name is required" });
    }
    nameStorage.insert(name, { name, createdAt: ic.time() });
    return Ok(name);
  }),
  getName: query([text], Result(text, Error), (name) => {
    const value = nameStorage.get(name);
    return value ? Ok(value.Some) : Err({ NotFound: "Name not found" });
  }),
});
