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

import com.prologic.assetManagement.maintenance.data.*
import com.prologic.assetManagement.network.IoDispatcher
import com.prologic.assetManagement.network.ResponseWrapper
import com.prologic.assetManagement.network.safeApiCall
import com.prologic.assetManagement.util.getServerDateFormat
import kotlinx.coroutines.CoroutineDispatcher
import okhttp3.MediaType
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import javax.inject.Inject
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.http.Multipart
import java.io.File

/**
 * To communicate with api with [MaintenanceService]
 */
class RemoteMaintenanceSource @Inject constructor(
    private val maintenanceService: MaintenanceService,
    @IoDispatcher val dispatcher: CoroutineDispatcher
) {

    suspend fun getMaintenanceLogs(maintenanceParam: MaintenanceParam): ResponseWrapper<List<MaintenanceResponse>> =
        safeApiCall(dispatcher) {
            maintenanceService.getMaintenanceLogs(
                maintenanceParam.rangeId,
                maintenanceParam.maintenanceType?.name?.lowercase()?.replaceFirstChar(Char::uppercase),
                maintenanceParam.type,
                maintenanceParam.ordering
            )
        }

    suspend fun getMaintenanceDetail(id: String,yearId:String): ResponseWrapper<MaintenanceDetailResponse> =
        safeApiCall(dispatcher) {
            maintenanceService.getMaintenanceDetail(id,yearId)
        }

    suspend fun getMaintenanceLogDetail(
        id: String,
        rangeId: String
    ): ResponseWrapper<MaintenanceLogDetailResponse> =
        safeApiCall(dispatcher) {
            maintenanceService.getMaintenanceInfoLogDetail(id, rangeId)
        }

    suspend fun createMaintenanceLog(log: MaintenanceLog,type:String?): ResponseWrapper<MaintenanceLogDetailResponse> =
        safeApiCall(dispatcher) {
            maintenanceService.createMaintenanceLog(
                getRequestBodyMap(log),
                log.pictureFile?.let { getImageBody(it) },type

            )
        }

    suspend fun updateMaintenanceLog(log: MaintenanceLog): ResponseWrapper<MaintenanceLogDetailResponse> =
        safeApiCall(dispatcher) {


            maintenanceService.updateMaintenanceLog(
                log.id,
                getRequestBodyMap(log),
                log.pictureFile?.let { getImageBody(it) }

            )
        }

    private fun getImageBody(pictureFile: File): MultipartBody.Part? {
        val imageBody: RequestBody = pictureFile.asRequestBody("image/*".toMediaTypeOrNull())
        val body: MultipartBody.Part = imageBody.let {
            MultipartBody.Part?.createFormData(
                "componant_picture",
                pictureFile.name ?: "Name",
                body = imageBody
            )
        }
        return body
    }

    private fun getRequestBodyMap(log: MaintenanceLog): MutableMap<String, RequestBody> {
        val requestBodyMap: MutableMap<String, RequestBody> = HashMap()
        log.componentId.toRequestBody().let {
            requestBodyMap["component"] = it
        }
        log.serverId?.toRequestBody()?.let {
            requestBodyMap["id"] = it
        }
        log.selectedDate?.toRequestBody()?.let {
            requestBodyMap["maintenance_date"] = it
        }
        log.failureReason.toRequestBody().let {
            requestBodyMap["possible_failure"] = it
        }
        log.possibleSolution.toRequestBody().let {
            requestBodyMap["maintenance_action"] = it
        }
        log.intervalDay?.toRequestBody()?.let {
            requestBodyMap["duration"] = it
        }

        log.totalCost?.toRequestBody()?.let {
            requestBodyMap["cost_total"] = it
        }

        log.labourCost?.toRequestBody()?.let {
            requestBodyMap["labour_cost"] = it
        }

        log.materialCost?.toRequestBody()?.let {
            requestBodyMap["material_cost"] = it
        }

        log.replacementCost?.toRequestBody()?.let {
            requestBodyMap["replacement_cost"] = it
        }
        log.remarks?.toRequestBody()?.let {
            requestBodyMap["remarks"] = it
        }
        log.supplyBelt?.toRequestBody()?.let {
            requestBodyMap["supply_belt"] = it
        }
        return requestBodyMap


    }
}

