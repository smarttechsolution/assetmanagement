import Axios, { AxiosRequestConfig, AxiosResponse, CancelTokenSource, Method } from 'axios';
import { Dispatch } from 'redux';

import initDispatchTypes from './default-action-type';
import initApiRequest from '../../services/api-request/api-request';
import { apiDetailType } from '../actionNames';
import { FailToast, SuccessToast } from '../../components/React/ToastNotifier/ToastNotifier';
import { requestTimeoutLanguage, noConnectionLanguage } from '../../i18n/i18n';

/**
 * Request details for XMLHTTP request
 */
interface APIRequestDetail {
    /**Request data for the API */
    requestData?: any;
    /**REST API Method */
    requestMethod?: Method;
    /**Path variables present in controller
     *
     * Provided pathVariables -> {id: 1, type: 'test'}
     * Converts controller-url/{id}/{type} -> controller-url/1/test
     */
    pathVariables?: { [key: string]: Primitive };
    /**Request params
     *
     * Provided params -> {id: 1, type: 'test'}
     * Converts controller-url -> controller-url?id=1&type=test
     */
    params?: { [key: string]: Primitive };
    /**Axios cancel token source */
    cancelSource?: CancelTokenSource;
    /**Disable Success Toast */
    disableSuccessToast?: boolean;
    /**Disable Failure Toast */
    disableFailureToast?: boolean;

    disableToast?: boolean;
}

interface CustomResponse<TData = any> extends AxiosResponse {
    message: string;
    data: TData | null;
    status: number;
    noconnection: boolean;
    config: AxiosRequestConfig;
    isAxiosError: boolean;
}

export type APIResponseDetail<TData = any> = Promise<CustomResponse<TData>>

let timeoutLanguageCount = 0;
let noServerConnectionLanguageCount = 0;
let noConnectionLanguageCount = 0;
const axiosCancelSource = Axios.CancelToken.source();

/**
 * Manages API call and updates reducer with success or failure
 * @param apiDetails redux action and api config
 * @param dispatch redux dispatch function
 * @param apiRequestDetails request details for XMLHTTP request
 */
export default async function initDefaultAction(apiDetails: apiDetailType, dispatch: Dispatch, apiRequestDetails: APIRequestDetail = {}) {
    const { requestData, requestMethod, params, cancelSource, disableSuccessToast = false, disableFailureToast, pathVariables, disableToast = false } = apiRequestDetails;

    // Init Dispatch Types
    const dispatchTypes = initDispatchTypes(apiDetails.actionName);

    // Progress Dispatch
    dispatch({ type: dispatchTypes.progressDispatch, payload: null });


    // Check for path variables in controllername
    const sanitizedApiDetails = sanitizeController(apiDetails, pathVariables);


    let responseData;
    try {
        responseData = await initApiRequest(sanitizedApiDetails, requestData, requestMethod || sanitizedApiDetails.requestMethod || "GET", params, cancelSource || axiosCancelSource);

        console.log(responseData.data, "responseData")
        // Success Dispatch
        dispatch({ type: dispatchTypes.successDispatch, payload: responseData.data });

        if (disableSuccessToast || disableToast) {
            // No work done
        } else { 
            if (requestMethod !== "GET") {
                SuccessToast(responseData.data?.message)
            }
        }

    } catch (customThrownError) {
        responseData = customThrownError;

        // Failure Dispatch
        dispatch({ type: dispatchTypes.failureDispatch, payload: responseData.data });
        if (disableFailureToast || disableToast) {
            // No work done
        } else {
            responseData.data?.message && FailToast(responseData.data.message);
        }

        // Axios Timeout
        if (responseData.config.code === 'ECONNABORTED') {
            if (!timeoutLanguageCount) {
                timeoutLanguageCount++;
                FailToast(requestTimeoutLanguage());
            }
        }

        // No Connection
        if (responseData.noconnection) {
            // No Server Connection
            if (responseData.message === 'Server could not be reached') {
                if (!noServerConnectionLanguageCount) {
                    noServerConnectionLanguageCount++;
                    FailToast(noConnectionLanguage());
                }
            }
            // No Connection
            else if (responseData.config.code !== 'ECONNABORTED') {
                if (!noConnectionLanguageCount) {
                    noConnectionLanguageCount++;
                    FailToast(noConnectionLanguage());
                }
            }
        }
    }

    return responseData as APIResponseDetail | Promise<any>;
};


function sanitizeController(
    apiDetail: apiDetailType,
    pathVariables?: { [key: string]: Primitive }
) {
    return pathVariables && Object.keys(pathVariables).length
        ? {
            ...apiDetail,
            controllerName: Object.entries(pathVariables).reduce(
                (acc, [key, value]) =>
                    (acc = acc.replace(`{${key}}`, value?.toString())),
                apiDetail.controllerName
            ),
        }
        : apiDetail;
}

