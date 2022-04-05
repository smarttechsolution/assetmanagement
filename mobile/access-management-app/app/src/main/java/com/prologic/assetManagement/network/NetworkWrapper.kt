/*
 * <Asset Management Water System for managing water system assets like
 * finance, maintenance and supply by Community Level.>
 *     Copyright (C) <2021>  <Smart Tech Solution PVT. LTD.>
 *     This program is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *     This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Affero General Public License for more details.
 *     You should have received a copy of the GNU Affero General Public
 * License along with this program.  If not, see
 * <https://www.gnu.org/licenses/>.
 * Smart Tech Solution Pvt. Ltd.
 * Bhakti Thapa Sadak, New Baneshwor,
 * Kathmandu, Nepal
 * Tel: +977-01-5245027
 * Email: info@smarttech.com.np
 * Website: http://www.smarttech.com.np/
 */

package com.prologic.assetManagement.network

import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import retrofit2.HttpException
import timber.log.Timber
import java.io.IOException

suspend fun <T> safeApiCall(
    dispatcher: CoroutineDispatcher,
    apiCall: suspend () -> T
): ResponseWrapper<T> {
    return withContext(dispatcher) {
        try {
            Timber.d("inside try")
            ResponseWrapper.Success(apiCall.invoke())

        } catch (throwable: Throwable) {
            Timber.d("inside catching::" + throwable.message)

            throwable.printStackTrace()
            when (throwable) {

                is NoConnectionException -> {
                    ResponseWrapper.NoConnectionError
                }

                is IOException -> {
                    ResponseWrapper.NetworkError
                }
                is HttpException -> {
                    val code = throwable.code()
                    Timber.d("the code is:"+code)
                    if (code == 500) {
                        Timber.d("the code is:"+code)
                        ResponseWrapper.GenericError(ApiError("Server error", 500))
                    }else {
                        val errorResponse = convertErrorBody(throwable)
                        ResponseWrapper.GenericError(errorResponse)
                    }

                }

                else -> {
                    ResponseWrapper.GenericError(null)
                }
            }
        }
    }
}

private fun convertErrorBody(throwable: HttpException): ApiError? {
    return try {
        val jsonObject = JSONObject(throwable.response()?.errorBody()?.string())
        return when {
            jsonObject.has("detail") -> ApiError(jsonObject.getString("detail"), throwable.code())
            jsonObject.has("error") -> {
                when {
                    jsonObject.get("error") is JSONObject -> {
                        ApiError(jsonObject.getString("error"), throwable.code())
                    }
                    jsonObject.get("error") is JSONArray -> {
                        val item = jsonObject.getJSONArray("error")
                        ApiError(item.get(0).toString(), throwable.code())
                    }
                    else -> {
                        ApiError("Something wrong happened", throwable.code())
                    }
                }
            }
            jsonObject.has("message") -> ApiError(jsonObject.getString("message"), throwable.code())
            jsonObject.has("maintenance_date") -> ApiError(
                "maintenance_date " + jsonObject.getJSONArray(
                    "maintenance_date"
                ).get(0).toString(), throwable.code()
            )
            else -> ApiError("Something wrong happened", throwable.code())
        }
    } catch (exception: Exception) {
        null
    }
}

data class ApiError(var message: String, var responseCode: Int)