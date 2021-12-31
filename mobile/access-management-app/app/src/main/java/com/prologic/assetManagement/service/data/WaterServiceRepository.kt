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

package com.prologic.assetManagement.service.data

import com.prologic.assetManagement.network.ResponseWrapper
import com.prologic.assetManagement.service.data.remote.RemoteServiceSource
import timber.log.Timber
import javax.inject.Inject

class WaterServiceRepository @Inject constructor(private val remoteServiceSource: RemoteServiceSource):IWaterServiceRepository
{
    override suspend fun createWaterSupplySource(createWaterSupplyParam: CreateWaterSupplyParam): ResponseWrapper<WaterSupplyRecordResponse> {
      return remoteServiceSource.createWaterSupplyRecord(createWaterSupplyParam)
    }

    override suspend fun getWaterSupplySource(dateFrom:String,dateTo:String?):ResponseWrapper< WaterSupplyRecordResponse> {
       return remoteServiceSource.getWaterSupplyRecord(dateFrom, dateTo)
    }

    override suspend fun getSupplyBelt(slug: String): List<SupplyBelt> {
        val items = mutableListOf<SupplyBelt>()
        when(val response = remoteServiceSource.getSupplyBelt(slug)){
            is ResponseWrapper.Success-> items.addAll(response.value.map { it.toSupplyBelt() })
            else-> {Timber.d("error")}
        }
        return items
    }

    override suspend fun getWaterQualityTestParameter(): List<WaterQualityParameter> {
        val parameters = mutableListOf<WaterQualityParameter>()
        when(val response = remoteServiceSource.getWaterQualityTestParameter()){
            is ResponseWrapper.Success -> parameters.addAll(response.value.map { it.toWaterQualityParameter() })
            else -> Timber.d("error error error")
        }
        return parameters
    }

    override suspend fun createWaterTestResult(param:WaterTestResult): ResponseWrapper<WaterTestResult> {
        return remoteServiceSource.createWaterTestResult(param)
    }
}