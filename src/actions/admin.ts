import { fetchRelationships } from "src/actions/accounts";
import {
  importFetchedAccount,
  importFetchedAccounts,
  importFetchedStatuses,
} from "src/actions/importer";
import { accountIdsToUsernames } from "src/selectors";
import { filterBadges, getTagDiff } from "src/utils/badges";

import api from "../api/index";

import type { AppDispatch, RootState } from "src/store";
import type { APIEntity } from "src/types/entities";

const ADMIN_REPORTS_FETCH_REQUEST = "ADMIN_REPORTS_FETCH_REQUEST";
const ADMIN_REPORTS_FETCH_SUCCESS = "ADMIN_REPORTS_FETCH_SUCCESS";
const ADMIN_REPORTS_FETCH_FAIL = "ADMIN_REPORTS_FETCH_FAIL";

const ADMIN_REPORTS_PATCH_REQUEST = "ADMIN_REPORTS_PATCH_REQUEST";
const ADMIN_REPORTS_PATCH_SUCCESS = "ADMIN_REPORTS_PATCH_SUCCESS";
const ADMIN_REPORTS_PATCH_FAIL = "ADMIN_REPORTS_PATCH_FAIL";

const ADMIN_USERS_FETCH_REQUEST = "ADMIN_USERS_FETCH_REQUEST";
const ADMIN_USERS_FETCH_SUCCESS = "ADMIN_USERS_FETCH_SUCCESS";
const ADMIN_USERS_FETCH_FAIL = "ADMIN_USERS_FETCH_FAIL";

const ADMIN_USERS_DELETE_REQUEST = "ADMIN_USERS_DELETE_REQUEST";
const ADMIN_USERS_DELETE_SUCCESS = "ADMIN_USERS_DELETE_SUCCESS";
const ADMIN_USERS_DELETE_FAIL = "ADMIN_USERS_DELETE_FAIL";

const ADMIN_USERS_DEACTIVATE_REQUEST = "ADMIN_USERS_DEACTIVATE_REQUEST";
const ADMIN_USERS_DEACTIVATE_SUCCESS = "ADMIN_USERS_DEACTIVATE_SUCCESS";
const ADMIN_USERS_DEACTIVATE_FAIL = "ADMIN_USERS_DEACTIVATE_FAIL";

const ADMIN_STATUS_DELETE_REQUEST = "ADMIN_STATUS_DELETE_REQUEST";
const ADMIN_STATUS_DELETE_SUCCESS = "ADMIN_STATUS_DELETE_SUCCESS";
const ADMIN_STATUS_DELETE_FAIL = "ADMIN_STATUS_DELETE_FAIL";

const ADMIN_STATUS_TOGGLE_SENSITIVITY_REQUEST =
  "ADMIN_STATUS_TOGGLE_SENSITIVITY_REQUEST";
const ADMIN_STATUS_TOGGLE_SENSITIVITY_SUCCESS =
  "ADMIN_STATUS_TOGGLE_SENSITIVITY_SUCCESS";
const ADMIN_STATUS_TOGGLE_SENSITIVITY_FAIL =
  "ADMIN_STATUS_TOGGLE_SENSITIVITY_FAIL";

const ADMIN_USERS_TAG_REQUEST = "ADMIN_USERS_TAG_REQUEST";
const ADMIN_USERS_TAG_SUCCESS = "ADMIN_USERS_TAG_SUCCESS";
const ADMIN_USERS_TAG_FAIL = "ADMIN_USERS_TAG_FAIL";

const ADMIN_USERS_UNTAG_REQUEST = "ADMIN_USERS_UNTAG_REQUEST";
const ADMIN_USERS_UNTAG_SUCCESS = "ADMIN_USERS_UNTAG_SUCCESS";
const ADMIN_USERS_UNTAG_FAIL = "ADMIN_USERS_UNTAG_FAIL";

const ADMIN_ADD_PERMISSION_GROUP_REQUEST = "ADMIN_ADD_PERMISSION_GROUP_REQUEST";
const ADMIN_ADD_PERMISSION_GROUP_SUCCESS = "ADMIN_ADD_PERMISSION_GROUP_SUCCESS";
const ADMIN_ADD_PERMISSION_GROUP_FAIL = "ADMIN_ADD_PERMISSION_GROUP_FAIL";

const ADMIN_REMOVE_PERMISSION_GROUP_REQUEST =
  "ADMIN_REMOVE_PERMISSION_GROUP_REQUEST";
const ADMIN_REMOVE_PERMISSION_GROUP_SUCCESS =
  "ADMIN_REMOVE_PERMISSION_GROUP_SUCCESS";
const ADMIN_REMOVE_PERMISSION_GROUP_FAIL = "ADMIN_REMOVE_PERMISSION_GROUP_FAIL";

const ADMIN_SPACES_FETCH_REQUEST = "ADMIN_SPACES_FETCH_REQUEST";
const ADMIN_SPACES_FETCH_SUCCESS = "ADMIN_SPACES_FETCH_SUCCESS";
const ADMIN_SPACES_FETCH_FAIL = "ADMIN_SPACES_FETCH_FAIL";

const ADMIN_SPACE_CREATE_REQUEST = "ADMIN_SPACE_CREATE_REQUEST";
const ADMIN_SPACE_CREATE_SUCCESS = "ADMIN_SPACE_CREATE_SUCCESS";
const ADMIN_SPACE_CREATE_FAIL = "ADMIN_SPACE_CREATE_FAIL";

const ADMIN_SPACE_DELETE_REQUEST = "ADMIN_SPACE_DELETE_REQUEST";
const ADMIN_SPACE_DELETE_SUCCESS = "ADMIN_SPACE_DELETE_SUCCESS";
const ADMIN_SPACE_DELETE_FAIL = "ADMIN_SPACE_DELETE_FAIL";

const ADMIN_SPACE_UPDATE_REQUEST = "ADMIN_SPACE_UPDATE_REQUEST";
const ADMIN_SPACE_UPDATE_SUCCESS = "ADMIN_SPACE_UPDATE_SUCCESS";
const ADMIN_SPACE_UPDATE_FAIL = "ADMIN_SPACE_UPDATE_FAIL";

function fetchReports(params: Record<string, any> = {}) {
  return async (
    dispatch: AppDispatch,
    getState: () => RootState
  ): Promise<void> => {
    console.log("Starting fetchReports");
    dispatch({ type: ADMIN_REPORTS_FETCH_REQUEST, params });
    try {
      console.log("Making API request to /api/admin/reports");
      const response = await api(getState).get("/api/admin/reports", {
        searchParams: params,
      });
      const reports = await response.json();

      reports.forEach((report: APIEntity) => {
        console.log("Full report data:", report);
        console.log("Account structure:", {
          reporter: report.account,
          target: report.target_account,
        });

        if (report.account?.account) {
          console.log(
            "Reporter account data to import:",
            report.account.account
          );
          dispatch(importFetchedAccount(report.account.account));
        } else {
          console.log("No reporter account data to import");
        }

        if (report.target_account?.account) {
          console.log(
            "Target account data to import:",
            report.target_account.account
          );
          dispatch(importFetchedAccount(report.target_account.account));
        } else {
          console.log("No target account data to import");
        }
      });

      dispatch({ type: ADMIN_REPORTS_FETCH_SUCCESS, reports, params });
    } catch (error) {
      console.error("Error in fetchReports:", error);
      dispatch({ type: ADMIN_REPORTS_FETCH_FAIL, error, params });
    }
  };
}

function patchReports(ids: string[], reportState: string) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const reports = ids.map((id) => ({ id, state: reportState }));

    dispatch({ type: ADMIN_REPORTS_PATCH_REQUEST, reports });

    return Promise.all(
      reports.map(async ({ id, state }) => {
        try {
          await api(getState).post(
            `/api/admin/reports/${id}/${
              state === "resolved" ? "reopen" : "resolve"
            }`
          );
          dispatch({ type: ADMIN_REPORTS_PATCH_SUCCESS, reports });
        } catch (error) {
          dispatch({ type: ADMIN_REPORTS_PATCH_FAIL, error, reports });
        }
      })
    );
  };
}

function closeReports(ids: string[]) {
  return patchReports(ids, "closed");
}

function fetchUsers(
  filters: Record<string, boolean>,
  page = 1,
  query?: string | null,
  pageSize = 50,
  url?: string | null
) {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ADMIN_USERS_FETCH_REQUEST, filters, page, pageSize });

    const params: Record<string, any> = {
      ...filters,
      username: query,
    };

    try {
      const response = await api(getState).get(url || "/api/admin/accounts", {
        searchParams: params,
      });
      const accounts = await response.json();
      const next = response.next();

      dispatch(
        importFetchedAccounts(accounts.map(({ account }: APIEntity) => account))
      );
      dispatch(
        fetchRelationships(accounts.map((account_1: APIEntity) => account_1.id))
      );
      dispatch({
        type: ADMIN_USERS_FETCH_SUCCESS,
        accounts,
        pageSize,
        filters,
        page,
        next,
      });
      return { accounts, next };
    } catch (error) {
      return dispatch({
        type: ADMIN_USERS_FETCH_FAIL,
        error,
        filters,
        page,
        pageSize,
      });
    }
  };
}

function revokeName(accountId: string, reportId?: string) {
  return (_dispatch: AppDispatch, getState: () => RootState) => {
    const params = {
      type: "revoke_name",
      report_id: reportId,
    };

    return api(getState).post(
      `/api/admin/accounts/${accountId}/action`,
      params
    );
  };
}

function deactivateUsers(accountIds: string[], reportId?: string) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    return Promise.all(
      accountIds.map(async (accountId) => {
        const params = {
          type: "disable",
          report_id: reportId,
        };
        try {
          await api(getState).post(
            `/api/admin/accounts/${accountId}/action`,
            params
          );
          dispatch({
            type: ADMIN_USERS_DEACTIVATE_SUCCESS,
            accountIds: [accountId],
          });
        } catch (error) {
          dispatch({
            type: ADMIN_USERS_DEACTIVATE_FAIL,
            error,
            accountIds: [accountId],
          });
        }
      })
    );
  };
}

const deleteUser =
  (accountId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ADMIN_USERS_DELETE_REQUEST, accountId });
    return api(getState)
      .request("DELETE", "/api/admin/users", { accountId })
      .then((response) => response.json())
      .then(({ accountId }) => {
        dispatch({ type: ADMIN_USERS_DELETE_SUCCESS, accountId });
      })
      .catch((error) => {
        dispatch({ type: ADMIN_USERS_DELETE_FAIL, error, accountId });
      });
  };

const deleteStatus =
  (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ADMIN_STATUS_DELETE_REQUEST, id });
    return api(getState)
      .delete(`/api/admin/statuses/${id}`)
      .then(() => {
        dispatch({ type: ADMIN_STATUS_DELETE_SUCCESS, id });
      })
      .catch((error) => {
        dispatch({ type: ADMIN_STATUS_DELETE_FAIL, error, id });
      });
  };

const toggleStatusSensitivity =
  (id: string, sensitive: boolean) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ADMIN_STATUS_TOGGLE_SENSITIVITY_REQUEST, id });
    return api(getState)
      .put(`/api/admin/statuses/${id}`, { sensitive: !sensitive })
      .then(() => {
        dispatch({ type: ADMIN_STATUS_TOGGLE_SENSITIVITY_SUCCESS, id });
      })
      .catch((error) => {
        dispatch({ type: ADMIN_STATUS_TOGGLE_SENSITIVITY_FAIL, error, id });
      });
  };

const tagUsers =
  (accountIds: string[], tags: string[]) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const nicknames = accountIdsToUsernames(getState(), accountIds);
    dispatch({ type: ADMIN_USERS_TAG_REQUEST, accountIds, tags });
    return api(getState)
      .put("/api/admin/users/tag", { nicknames, tags })
      .then(() => {
        console.log("tagUsers: " + tags);
        dispatch({ type: ADMIN_USERS_TAG_SUCCESS, accountIds, tags });
      })
      .catch((error) => {
        dispatch({ type: ADMIN_USERS_TAG_FAIL, error, accountIds, tags });
      });
  };

const untagUsers =
  (accountIds: string[], tags: string[]) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const nicknames = accountIdsToUsernames(getState(), accountIds);

    // Legacy: allow removing legacy 'donor' tags.
    if (tags.includes("badge:donor")) {
      tags = [...tags, "donor"];
    }

    dispatch({ type: ADMIN_USERS_UNTAG_REQUEST, accountIds, tags });
    return api(getState)
      .request("DELETE", "/api/admin/users/tag", { nicknames, tags })
      .then(() => {
        console.log("untag users: " + tags);
        dispatch({ type: ADMIN_USERS_UNTAG_SUCCESS, accountIds, tags });
      })
      .catch((error) => {
        dispatch({ type: ADMIN_USERS_UNTAG_FAIL, error, accountIds, tags });
      });
  };

/** Synchronizes user tags to the backend. */
const setTags =
  (accountId: string, oldTags: string[], newTags: string[]) =>
  async (dispatch: AppDispatch) => {
    const diff = getTagDiff(oldTags, newTags);

    await dispatch(tagUsers([accountId], diff.added));
    await dispatch(untagUsers([accountId], diff.removed));
  };

/** Synchronizes badges to the backend. */
const setBadges =
  (accountId: string, oldTags: string[], newTags: string[]) =>
  (dispatch: AppDispatch) => {
    console.log("oldTags: " + oldTags);
    const oldBadges = filterBadges(oldTags);
    console.log("oldBadges: " + oldBadges);

    console.log("newTags: " + newTags);
    const newBadges = filterBadges(newTags);
    console.log("newBadges: " + newBadges);

    return dispatch(setTags(accountId, oldBadges, newBadges));
  };

const addPermission =
  (accountIds: string[], permissionGroup: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const nicknames = accountIdsToUsernames(getState(), accountIds);
    dispatch({
      type: ADMIN_ADD_PERMISSION_GROUP_REQUEST,
      accountIds,
      permissionGroup,
    });
    return api(getState)
      .post(`/api/admin/users/permission_group/${permissionGroup}`, nicknames)
      .then((response) => response.json())
      .then((data) => {
        dispatch({
          type: ADMIN_ADD_PERMISSION_GROUP_SUCCESS,
          accountIds,
          permissionGroup,
          data,
        });
      })
      .catch((error) => {
        dispatch({
          type: ADMIN_ADD_PERMISSION_GROUP_FAIL,
          error,
          accountIds,
          permissionGroup,
        });
      });
  };

const removePermission =
  (accountIds: string[], permissionGroup: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const nicknames = accountIdsToUsernames(getState(), accountIds);
    dispatch({
      type: ADMIN_REMOVE_PERMISSION_GROUP_REQUEST,
      accountIds,
      permissionGroup,
    });
    return api(getState)
      .request(
        "DELETE",
        `/api/admin/users/permission_group/${permissionGroup}`,
        nicknames
      )
      .then((response) => response.json())
      .then((data) => {
        dispatch({
          type: ADMIN_REMOVE_PERMISSION_GROUP_SUCCESS,
          accountIds,
          permissionGroup,
          data,
        });
      })
      .catch((error) => {
        dispatch({
          type: ADMIN_REMOVE_PERMISSION_GROUP_FAIL,
          error,
          accountIds,
          permissionGroup,
        });
      });
  };

const promoteToAdmin = (accountId: string) => (dispatch: AppDispatch) =>
  Promise.all([
    dispatch(addPermission([accountId], "admin")),
    dispatch(removePermission([accountId], "moderator")),
  ]);

const promoteToModerator = (accountId: string) => (dispatch: AppDispatch) =>
  Promise.all([
    dispatch(removePermission([accountId], "admin")),
    dispatch(addPermission([accountId], "moderator")),
  ]);

const demoteToUser = (accountId: string) => (dispatch: AppDispatch) =>
  Promise.all([
    dispatch(removePermission([accountId], "admin")),
    dispatch(removePermission([accountId], "moderator")),
  ]);

const setRole =
  (accountId: string, role: "user" | "moderator" | "admin") =>
  (dispatch: AppDispatch) => {
    switch (role) {
      case "user":
        return dispatch(demoteToUser(accountId));
      case "moderator":
        return dispatch(promoteToModerator(accountId));
      case "admin":
        return dispatch(promoteToAdmin(accountId));
    }
  };

interface ICreateSpace {
  id: string;
  name: string;
}

const createSpace =
  (params: ICreateSpace) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: "ADMIN_SPACE_CREATE_REQUEST" });

    try {
      await api(getState).post("/api/admin/spaces", params);
      dispatch({ type: "ADMIN_SPACE_CREATE_SUCCESS", space: params });
      return params;
    } catch (error) {
      dispatch({ type: "ADMIN_SPACE_CREATE_FAIL", error });
      throw error;
    }
  };

const deleteSpace =
  (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ADMIN_SPACE_DELETE_REQUEST, id });

    return api(getState)
      .delete(`/api/admin/spaces/${id}`)
      .then(() => {
        dispatch({ type: ADMIN_SPACE_DELETE_SUCCESS, id });
      })
      .catch((error) => {
        dispatch({ type: ADMIN_SPACE_DELETE_FAIL, error, id });
        throw error;
      });
  };

const updateSpace =
  (id: string, params: { name: string }) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ADMIN_SPACE_UPDATE_REQUEST, id, params });

    return api(getState)
      .put(`/api/admin/spaces/${id}`, params)
      .then((response) => response.json())
      .then((space) => {
        dispatch({ type: ADMIN_SPACE_UPDATE_SUCCESS, space });
        return space;
      })
      .catch((error) => {
        dispatch({ type: ADMIN_SPACE_UPDATE_FAIL, error, id });
        throw error;
      });
  };

export {
  ADMIN_REPORTS_FETCH_REQUEST,
  ADMIN_REPORTS_FETCH_SUCCESS,
  ADMIN_REPORTS_FETCH_FAIL,
  ADMIN_REPORTS_PATCH_REQUEST,
  ADMIN_REPORTS_PATCH_SUCCESS,
  ADMIN_REPORTS_PATCH_FAIL,
  ADMIN_USERS_FETCH_REQUEST,
  ADMIN_USERS_FETCH_SUCCESS,
  ADMIN_USERS_FETCH_FAIL,
  ADMIN_USERS_DELETE_REQUEST,
  ADMIN_USERS_DELETE_SUCCESS,
  ADMIN_USERS_DELETE_FAIL,
  ADMIN_USERS_DEACTIVATE_REQUEST,
  ADMIN_USERS_DEACTIVATE_SUCCESS,
  ADMIN_USERS_DEACTIVATE_FAIL,
  ADMIN_STATUS_DELETE_REQUEST,
  ADMIN_STATUS_DELETE_SUCCESS,
  ADMIN_STATUS_DELETE_FAIL,
  ADMIN_STATUS_TOGGLE_SENSITIVITY_REQUEST,
  ADMIN_STATUS_TOGGLE_SENSITIVITY_SUCCESS,
  ADMIN_STATUS_TOGGLE_SENSITIVITY_FAIL,
  ADMIN_USERS_TAG_REQUEST,
  ADMIN_USERS_TAG_SUCCESS,
  ADMIN_USERS_TAG_FAIL,
  ADMIN_USERS_UNTAG_REQUEST,
  ADMIN_USERS_UNTAG_SUCCESS,
  ADMIN_USERS_UNTAG_FAIL,
  ADMIN_ADD_PERMISSION_GROUP_REQUEST,
  ADMIN_ADD_PERMISSION_GROUP_SUCCESS,
  ADMIN_ADD_PERMISSION_GROUP_FAIL,
  ADMIN_REMOVE_PERMISSION_GROUP_REQUEST,
  ADMIN_REMOVE_PERMISSION_GROUP_SUCCESS,
  ADMIN_REMOVE_PERMISSION_GROUP_FAIL,
  ADMIN_SPACES_FETCH_REQUEST,
  ADMIN_SPACES_FETCH_SUCCESS,
  ADMIN_SPACES_FETCH_FAIL,
  ADMIN_SPACE_CREATE_REQUEST,
  ADMIN_SPACE_CREATE_SUCCESS,
  ADMIN_SPACE_CREATE_FAIL,
  ADMIN_SPACE_DELETE_REQUEST,
  ADMIN_SPACE_DELETE_SUCCESS,
  ADMIN_SPACE_DELETE_FAIL,
  ADMIN_SPACE_UPDATE_REQUEST,
  ADMIN_SPACE_UPDATE_SUCCESS,
  ADMIN_SPACE_UPDATE_FAIL,
  fetchReports,
  closeReports,
  fetchUsers,
  deactivateUsers,
  deleteUser,
  revokeName,
  deleteStatus,
  toggleStatusSensitivity,
  tagUsers,
  untagUsers,
  setTags,
  setBadges,
  addPermission,
  removePermission,
  promoteToAdmin,
  promoteToModerator,
  demoteToUser,
  setRole,
  createSpace,
  deleteSpace,
  updateSpace,
};
