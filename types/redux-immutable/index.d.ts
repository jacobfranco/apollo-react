declare module 'redux-immutable' {
    import { Collection, Record } from 'immutable';
    import { ReducersMapObject, Reducer, Action } from 'redux';
  
    export function combineReducers<S, A extends Action, T>(reducers: ReducersMapObject<S, A>, getDefaultState?: () => Collection.Keyed<T, S>): Reducer<S, A>;
    export function combineReducers<S, A extends Action>(reducers: ReducersMapObject<S, A>, getDefaultState?: () => Collection.Indexed<S>): Reducer<S, A>;
    export function combineReducers<S>(reducers: ReducersMapObject<S, any>, getDefaultState?: () => Collection.Indexed<S>): Reducer<S>;
    export function combineReducers<S extends object, T extends object>(reducers: ReducersMapObject<S, any>, getDefaultState?: Record.Factory<T>): Reducer<ReturnType<Record.Factory<S>>>;
  }