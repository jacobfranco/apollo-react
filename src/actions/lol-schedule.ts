import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';
import { RootState } from 'src/store';
import api from 'src/api';
import { seriesSchema, Series } from 'src/schemas/series';
import { ZodError } from 'zod';

export const FETCH_LOL_SCHEDULE_REQUEST = 'lolSchedule/FETCH_REQUEST';
export const FETCH_LOL_SCHEDULE_SUCCESS = 'lolSchedule/FETCH_SUCCESS';
export const FETCH_LOL_SCHEDULE_FAILURE = 'lolSchedule/FETCH_FAILURE';

export const fetchLolScheduleRequest = () => ({
  type: FETCH_LOL_SCHEDULE_REQUEST,
});

export const fetchLolScheduleSuccess = (series: Series[]) => ({
  type: FETCH_LOL_SCHEDULE_SUCCESS,
  payload: series,
});

export const fetchLolScheduleFailure = (error: string) => ({
  type: FETCH_LOL_SCHEDULE_FAILURE,
  payload: error,
});

export const fetchLolSchedule = ({
  timestamp,
}: {
  timestamp?: number;
}): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    dispatch(fetchLolScheduleRequest());
    try {
      const client = api(getState);
      const response = await client.get('/api/lolseries/week', {
        params: { timestamp },
      });

      console.log('API Response Data:', response.data);

      // Validate response data with Zod
      const parsedData = seriesSchema.array().parse(response.data);

      dispatch(fetchLolScheduleSuccess(parsedData));
    } catch (error: any) {
      if (error instanceof ZodError) {
        // Handle validation errors
        console.error('Zod Validation Errors:', error.errors);
        dispatch(fetchLolScheduleFailure('Invalid data format from API'));
      } else {
        dispatch(fetchLolScheduleFailure(error.message));
      }
    }
  };
};
