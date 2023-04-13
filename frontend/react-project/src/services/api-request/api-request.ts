import Axios, {
    AxiosResponse,
    AxiosError,
    AxiosRequestConfig,
    CancelTokenSource,
    CancelTokenStatic,
    Method,
    AxiosBasicCredentials,
} from "axios";
import { apiDetailType } from "store/actionNames";

import TokenService from "../jwt-token/jwt-token";

interface RequestParam {
    [key: string]: any
}

const basicAuth: AxiosBasicCredentials = {
    username: "clientid",
    password: "secret",
};

const getGrantType = () => ({ key: "grant_type", value: "password" });

// Cancel a request using a cancel token.
const cancelToken: CancelTokenStatic = Axios.CancelToken;
const source: CancelTokenSource = cancelToken.source();

export default function initApiRequest(apiDetails: apiDetailType, requestData: any, requestMethod: Method, params?: RequestParam, cancelSource?: CancelTokenSource) {
    // API URL
    let url = process.env.REACT_APP_API_ENDPOINT as string;
    const access_token: string = TokenService.getAccessToken()?.tokens?.access;

    const headers = getRequestHeaders(apiDetails, access_token);
    const transformedRequestData = transformRequestData(apiDetails, requestData);

    if (transformedRequestData instanceof FormData) {
        debugger;
        console.log(transformedRequestData, 'transdatattt')
    }

    let axiosReqParams: AxiosRequestConfig = {
        url: apiDetails.controllerName,
        method: requestMethod,
        baseURL: url,
        responseType: 'json',
        timeout: 60 * 3 * 1000,
        cancelToken: cancelSource ? cancelSource.token : source.token,
        headers: headers,
        ...transformedRequestData,
    };

    if (params) {
        axiosReqParams = {
            ...axiosReqParams,
            params: params,
        }
    }

    return Axios.request(axiosReqParams)
        .then((response: AxiosResponse) => response)
        .catch((error: AxiosError) => {
            const errorResponse = manageErrorResponse(error);
            throw errorResponse;
        });
};

const getRequestHeaders = (apiDetails: apiDetailType, access_token: string) => {

    let headers: { [key: string]: string } = { "Content-Type": "application/json" };

    if (access_token) {
        headers = { ...headers, "Authorization": "Bearer " + access_token }
    }

    switch (apiDetails.requestBodyType) {
        case "QUERY-STRING":
            headers = {
                ...headers,
                "Content-Type": "application/x-www-form-urlencoded",
            };
            break;
        case "FORM-DATA":
            headers = {
                ...headers,
                "Content-Type": "multipart/form-data",
            };
            break;
        case "NO-AUTH":
            if (!TokenService.getAccessToken()?.tokens?.access) {
                delete headers["Authorization"];
            }
            break;
        default:
            headers = { ...headers };
    }
    return headers;
};

interface TransformedRequestData {
    auth?: AxiosBasicCredentials,
    data: any
}
const transformRequestData = (apiDetails: apiDetailType, requestData: any) => {
    let transformedRequestData: TransformedRequestData = { data: requestData };

    switch (apiDetails.requestBodyType) {
        case "AUTH":
            // const grant_type = getGrantType();
            // transformedRequestData.auth = basicAuth;
            transformedRequestData.data = requestData;
            // transformedRequestData.data.append(grant_type.key, grant_type.value);
            break;
        case "FORM-DATA":
            transformedRequestData.data = getFormData(requestData);
            break;
        case "QUERY-STRING":
            transformedRequestData.data = getQueryString(requestData);
            break;
        default:
            transformedRequestData.data = requestData;
            break;
    }

    return transformedRequestData;
};

function getQueryString(data: { [key: string]: string }) {
    return new URLSearchParams(data);
}

function getFormData(requestData: { [key: string]: any }) {
    let formData = new FormData();
    console.log(requestData, 'transdatattt')

    for (let data in requestData) {
        if (requestData[data] instanceof Array) {
            requestData[data].forEach((dataEl: any, index: number) => {
                if (dataEl instanceof Object) {
                    Object.keys(dataEl).forEach((elKey) => formData.append(`${data}[${index}].${elKey}`, dataEl[elKey]))
                }
            });
        }
        else if (requestData[data] instanceof File) {
            formData.append(data, requestData[data]);
        }
        else if (requestData[data] instanceof FileList) {
            Array.from(requestData[data]).map((f: any) => {
                formData.append(`${data}`, f);
                for(let i in requestData) {
                    console.log(i , requestData [i], " requestData dataRequest ==========")
                }
            });
        }
        else if (requestData[data] instanceof Object) {
            Object.entries(requestData[data]).forEach(([key, value]: [string, any]) => formData.append(`${data}.${key}`, value))
        }
        else {
            console.log(data, "data insodez")
            formData.append(data, requestData[data]);
        }
    }

    return formData;
}

const manageErrorResponse = (error: AxiosError) => {
    const { message, config, code, request, response, isAxiosError } = error;

    let errorResponse = {
        message: message, // Something happened in setting up the request that triggered an Error
        data: null,
        status: code || 400,
        noconnection: false,
        config: config, // Request Params Configs
        isAxiosError: isAxiosError //If Axios Error
    };

    if (response) {
        errorResponse.data = response.data; // The server responded with a status code and data
    } else if (request) {
        errorResponse.message = "Server could not be reached."; // No response was received
        errorResponse.noconnection = true;
    }

    return errorResponse;
};
