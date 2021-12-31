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

package com.prologic.assetManagement.maintenance.data.remote

import com.prologic.assetManagement.maintenance.data.MaintenanceDetailResponse
import com.prologic.assetManagement.maintenance.data.MaintenanceLogDetailResponse
import com.prologic.assetManagement.maintenance.data.MaintenanceResponse
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.http.*

interface MaintenanceService {

    @GET("maintenance/component-info/{lang}/list/")
    suspend fun getMaintenanceLogs(
        @Query("year") year: String,
        @Query("mitigation") mitigation: String?,
        @Query("type") type:String?,
        @Query("ordering") ordering:String?
    ): List<MaintenanceResponse>

    @GET("maintenance/component-info/{lang}/{id}/")
    suspend fun getMaintenanceDetail(@Path("id") id: String,@Query("year") year:String): MaintenanceDetailResponse

    @GET("maintenance/component-info-log/{lang}/update/{id}/")
    suspend fun getMaintenanceInfoLogDetail(@Path("id") id: String,@Query("year") rangeId:String): MaintenanceLogDetailResponse

    @Multipart
    @POST("maintenance/component-info-log/{lang}/create/")
    suspend fun createMaintenanceLog(
        @PartMap params: MutableMap<String, RequestBody>,
        @Part image: MultipartBody.Part?,
        @Query("type") type: String?

    ): MaintenanceLogDetailResponse

    @Multipart
    @PUT("maintenance/component-info-log/{lang}/update/{id}/")
    suspend fun updateMaintenanceLog(
        @Path("id") id: String,
        @PartMap params: MutableMap<String, RequestBody>,
        @Part image: MultipartBody.Part?

    ): MaintenanceLogDetailResponse


}