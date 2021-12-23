import { Dispatch } from "redux";

const initialState = {
    id: null,
    name: "",
    slug: "",
    tokens: {
        access: "",
        refresh: "",
    },
    username: "",
    water_scheme: "",
}

type IUserDetails = {
    id: number | null
    name: string
    slug: string
    tokens: {
        access: string
        refresh: string
    },
    username: string
    water_scheme: string
}

export const userDetailsReducer = (state: IUserDetails = initialState, action: DefaultAction): IUserDetails => {
    switch (action.type) {
        case "ADD_USER_DETAILS":
            return {
                ...state,
                ...action.payload
            }

        default:
            return state;
    }
}

export default userDetailsReducer


export const addUserDetails = (data) => (dispatch: Dispatch) => {
    dispatch({
        type: "ADD_USER_DETAILS",
        payload: data
    })
}