import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "src/store";
import api from "src/api";
import { seriesSchema, Series } from "src/schemas/series";
import { ZodError } from "zod";

export const FETCH_SERIES_REQUEST = "series/FETCH_REQUEST";
export const FETCH_SERIES_SUCCESS = "series/FETCH_SUCCESS";
export const FETCH_SERIES_FAILURE = "series/FETCH_FAILURE";
export const UPDATE_SERIES = "series/UPDATE_SERIES";

// New action types for fetching series by ID
export const FETCH_SERIES_BY_ID_REQUEST = "series/FETCH_BY_ID_REQUEST";
export const FETCH_SERIES_BY_ID_SUCCESS = "series/FETCH_BY_ID_SUCCESS";
export const FETCH_SERIES_BY_ID_FAILURE = "series/FETCH_BY_ID_FAILURE";

// Existing actions
export const fetchSeriesRequest = () => ({ type: FETCH_SERIES_REQUEST });
export const fetchSeriesSuccess = (series: Series[]) => ({
  type: FETCH_SERIES_SUCCESS,
  payload: series,
});
export const fetchSeriesFailure = (error: string) => ({
  type: FETCH_SERIES_FAILURE,
  payload: error,
});

// New action for updates
export const updateSeries = (series: Series) => ({
  type: UPDATE_SERIES,
  payload: series,
});

// New actions for fetching series by ID
export const fetchSeriesByIdRequest = (seriesId: number) => ({
  type: FETCH_SERIES_BY_ID_REQUEST,
  payload: seriesId,
});

export const fetchSeriesByIdSuccess = (series: Series) => ({
  type: FETCH_SERIES_BY_ID_SUCCESS,
  payload: series,
});
export const fetchSeriesByIdFailure = (error: string) => ({
  type: FETCH_SERIES_BY_ID_FAILURE,
  payload: error,
});

// Fetch series by week
export const fetchSeries = ({
  timestamp,
  gamePath,
}: {
  timestamp?: number;
  gamePath: string;
}): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    dispatch(fetchSeriesRequest());
    try {
      const client = api(getState);
      const response = await client.get(`/api/${gamePath}/series/week`, {
        params: { timestamp },
      });

      console.log("API Response Data:", response.data);

      const parsedData = seriesSchema.array().parse(response.data);

      dispatch(fetchSeriesSuccess(parsedData));
    } catch (error: any) {
      if (error instanceof ZodError) {
        console.error("Zod Validation Errors:", error.errors);
        dispatch(fetchSeriesFailure("Invalid data format from API"));
      } else {
        dispatch(fetchSeriesFailure(error.message));
      }
    }
  };
};

// Fetch series by ID
export const fetchSeriesById = (
  seriesId: number,
  gamePath: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    dispatch(fetchSeriesByIdRequest(seriesId));
    try {
      const client = api(getState);
      const response = await client.get(`/api/${gamePath}/series/${seriesId}`);

      console.log("API Response Data:", response.data);

      const parsedData = seriesSchema.parse(response.data);

      dispatch(fetchSeriesByIdSuccess(parsedData));
    } catch (error: any) {
      if (error instanceof ZodError) {
        console.error("Zod Validation Errors:", error.errors);
        dispatch(fetchSeriesByIdFailure("Invalid data format from API"));
      } else {
        dispatch(fetchSeriesByIdFailure(error.message));
      }
    }
  };
};
