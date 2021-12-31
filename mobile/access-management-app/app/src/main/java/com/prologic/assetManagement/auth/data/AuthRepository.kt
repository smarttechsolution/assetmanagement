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

package com.prologic.assetManagement.auth.data


import com.prologic.assetManagement.network.ResponseWrapper
import kotlinx.coroutines.flow.first
import javax.inject.Inject


/*
* This is the repository class for mangaring authentication request like login
*
*/
class AuthRepository @Inject constructor(
    private val remoteAuthSource: RemoteAuthSource,
    private val authStore: AuthStore
) {

    /*This is the function to perform login */
    suspend fun login(loginParam: LoginParam): ResponseWrapper<LoginRes> {
        return when (val response = remoteAuthSource.login(loginParam)) {
            is ResponseWrapper.Success -> {
                 authStore.saveUserInfo(response.value.loginResponse)
                response
            }
            else ->
                response
        }
    }

    /*This is the function to get year intervals from the api which is to be used in the maintenance intervals*/
    suspend fun getYearIntervals():ResponseWrapper<List<YearIntervalResponse>>{
        val user = authStore.getUser().first()
        return remoteAuthSource.getYearIntervals(user?.waterSchemeSlug?:"")
    }
}