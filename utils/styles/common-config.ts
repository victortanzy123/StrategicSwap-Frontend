import { AttributeType } from "../helpers/types";

/* ==================================================
                        BUTTONS
=====================================================*/
export const PRIMARY_BUTTON_STYLE: string =
  "bg-red hover:bg-red-hover active:bg-red-active text-white";
export const SECONDARY_BUTTON_STYLE: string =
  "bg-white hover:bg-red-light active:bg-red-active";

// Data Table
const SMALL_TABLE_MAX_HEIGHT: string = "20rem";
const FULL_TABLE_MAX_HEIGHT: string = "60rem";
export const DATA_TABLE_MAX_HEIGHT: Record<string, AttributeType> = {
  SMALL: SMALL_TABLE_MAX_HEIGHT,
  FULL: FULL_TABLE_MAX_HEIGHT,
};

export const DEFAULT_SKELETON_BORDER_RADIUS: string = "0.5rem";
