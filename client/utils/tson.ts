import { TextMessageType } from "../../types/client";

type EncodeJSONType = (value: TextMessageType) => string;
type DecodeJSONType = (value: string) => TextMessageType | null;

const decodeJSON = (value : string) => {
  try {
      return JSON.parse(value);
  }
  catch (error) {
      console.log("Decode JSON Error:", error);
  }
  return null;
};

const encodeJSON = (value : TextMessageType) => {
  try {
      return JSON.stringify(value);
  }
  catch (error) {
      console.log("Encode JSON Error:", error);
  }
  return null;
};

export const TSON = {
  /**
   * Object -> String
   */
  encode: encodeJSON as EncodeJSONType,
  /**
   * String -> Object
   */
  decode: decodeJSON as DecodeJSONType,
};
