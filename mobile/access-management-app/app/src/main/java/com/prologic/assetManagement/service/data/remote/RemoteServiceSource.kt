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

package com.prologic.assetManagement.service.data.remote

import com.prologic.assetManagement.maintenance.data.remote.MaintenanceService
import com.prologic.assetManagement.network.IoDispatcher
import com.prologic.assetManagement.network.ResponseWrapper
import com.prologic.assetManagement.network.safeApiCall
import com.prologic.assetManagement.service.data.*
import kotlinx.coroutines.CoroutineDispatcher
import retrofit2.http.GET
import javax.inject.Inject

class RemoteServiceSource @Inject constructor(
    private val service: WaterService,
    @IoDispatcher val dispatcher: CoroutineDispatcher
) {

    suspend fun createWaterSupplyRecord(waterSupplyParam: CreateWaterSupplyParam): ResponseWrapper<WaterSupplyRecordResponse> =
        safeApiCall(dispatcher) {
            service.createWaterSupplyRecord(waterSupplyParam)
        }

    suspend fun getWaterSupplyRecord(dateFrom:String,dateTo:String?): ResponseWrapper<WaterSupplyRecordResponse> =
        safeApiCall(dispatcher) {
            service.getWaterSupplyRecord(dateFrom,dateTo)
        }

    suspend fun getSupplyBelt(slug:String) :ResponseWrapper<List<SupplyBeltResponse>> =
        safeApiCall(dispatcher){
            service.getSupplyBelt(slug)
        }

    suspend fun getWaterQualityTestParameter():ResponseWrapper<List<WaterTestParameterResponse>> = safeApiCall(dispatcher){
        service.getWaterQualityTestParameter()
    }

    suspend fun createWaterTestResult(param: WaterTestResult):ResponseWrapper<WaterTestResult> = safeApiCall(dispatcher){
        service.createWaterTestResult(param)
    }

}
