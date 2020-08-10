import { createActionTypes } from '../utils/helpers'

export const CREATE_GAME = createActionTypes('CREATE_GAME')
export const JOIN_GAME = createActionTypes('JOIN_GAME')
export const REMOVE_PLAYER = createActionTypes('REMOVE_PLAYER')
export const MAKE_MOVE = createActionTypes('MAKE_MOVE')
export const REMOVE_LOCAL_PLAYER = 'REMOVE_LOCAL_PLAYER'
export const STORAGE_CHANGE = 'STORAGE_CHANGE'
export const REMOVE_ERROR_FROM_STORE = 'REMOVE_ERROR_FROM_STORE'
