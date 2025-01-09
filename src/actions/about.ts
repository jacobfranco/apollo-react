import api from "../api";

import type { AnyAction } from "redux";
import type { RootState } from "src/store";

const FETCH_ABOUT_PAGE_REQUEST = "FETCH_ABOUT_PAGE_REQUEST";
const FETCH_ABOUT_PAGE_SUCCESS = "FETCH_ABOUT_PAGE_SUCCESS";
const FETCH_ABOUT_PAGE_FAIL = "FETCH_ABOUT_PAGE_FAIL";

const fetchAboutPage =
  (slug = "index", locale?: string) =>
  (dispatch: React.Dispatch<AnyAction>, getState: () => RootState) => {
    dispatch({ type: FETCH_ABOUT_PAGE_REQUEST, slug, locale });

    const filename = `${slug}${locale ? `.${locale}` : ""}.html`;
    return api(getState)
      .get(`/instance/about/${filename}`)
      .then((response) => response.text())
      .then((html) => {
        dispatch({ type: FETCH_ABOUT_PAGE_SUCCESS, slug, locale, html });
        return html;
      })
      .catch((error) => {
        dispatch({ type: FETCH_ABOUT_PAGE_FAIL, slug, locale, error });
        throw error;
      });
  };

export {
  fetchAboutPage,
  FETCH_ABOUT_PAGE_REQUEST,
  FETCH_ABOUT_PAGE_SUCCESS,
  FETCH_ABOUT_PAGE_FAIL,
};
