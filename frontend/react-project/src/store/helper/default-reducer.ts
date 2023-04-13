export default function initDefaultReducer(actionName: string, action: DefaultAction, state: DefaultState): DefaultState {
    switch (action.type) {
        case actionName + "_PROGRESS": {
            return {
                ...state,
                isFetching: true,
                isFailed: false,
                isSuccess: false,
            };
        }

        case actionName + "_SUCCESS": {
            const data = action.payload!;

            return {
                ...state,
                isFetching: false,
                isFailed: false,
                isSuccess: true,
                data,
                message: "No Message"
            };
        }

        case actionName + "_FAILURE": {
            if (action.payload) {
                const data = action.payload;

                return {
                    ...state,
                    isFetching: false,
                    isFailed: true,
                    isSuccess: false,
                    data: data || null,
                    message:  "Unable to process request"
                };
            }
            else {
                return {
                    ...state,
                    isFetching: false,
                    isFailed: true,
                    isSuccess: false,
                    data: null,
                    message: "Unable to process request"
                }
            }
        }

        default: {
            return state;
        }
    }
};