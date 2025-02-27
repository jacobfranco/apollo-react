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

export const FETCH_SERIES_BY_ID_REQUEST = "series/FETCH_BY_ID_REQUEST";
export const FETCH_SERIES_BY_ID_SUCCESS = "series/FETCH_BY_ID_SUCCESS";
export const FETCH_SERIES_BY_ID_FAILURE = "series/FETCH_BY_ID_FAILURE";

export const fetchSeriesRequest = () => ({ type: FETCH_SERIES_REQUEST });

export const fetchSeriesSuccess = (series: Series[]) => ({
  type: FETCH_SERIES_SUCCESS,
  payload: series,
});

export const fetchSeriesFailure = (error: string) => ({
  type: FETCH_SERIES_FAILURE,
  payload: error,
});

export const updateSeries = (series: Series) => ({
  type: UPDATE_SERIES,
  payload: series,
});

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
      // Construct path with query parameters if timestamp exists
      const path = timestamp
        ? `/api/${gamePath}/series/week?timestamp=${timestamp}`
        : `/api/${gamePath}/series/week`;

      const response = await client.get(path);
      const data = await response.json();
      console.log("API Response Data:", data);
      const parsedData = seriesSchema.array().parse(data);
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

export const fetchSeriesById = (
  seriesId: number,
  gamePath: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    dispatch(fetchSeriesByIdRequest(seriesId));
    try {
      const client = api(getState);
      const response = await client.get(`/api/${gamePath}/series/${seriesId}`);
      const data = await response.json();
      console.log("API Response Data:", data);
      const parsedData = seriesSchema.parse(data);
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
