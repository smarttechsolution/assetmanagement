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

package com.prologic.assetManagement.maintenance.data

import com.prologic.assetManagement.maintenance.data.remote.RemoteMaintenanceSource
import com.prologic.assetManagement.network.ResponseWrapper
import timber.log.Timber
import javax.inject.Inject

/**
 * To perform the maintenance operation
 */
class MaintenanceRepository @Inject constructor(private val remoteMaintenanceSource: RemoteMaintenanceSource) :
    IMaintenanceRepository {

    /**
     * to get the maintenance logs
     */
    override suspend fun getMaintenanceLogs(maintenanceParam: MaintenanceParam): List<Maintenance> {
        var result = listOf<Maintenance>()
        return when (val response = remoteMaintenanceSource.getMaintenanceLogs(maintenanceParam)) {
            is ResponseWrapper.Success -> {
                result = response.value.map { it.toMaintenance() }
                result
            }
            else -> {
                result
            }
        }
    }

    /**
     * to get the maintenance detail
     */
    override suspend fun getMaintenanceDetail(id: String,yearId:String): ResponseWrapper<MaintenanceDetailResponse> {
        return remoteMaintenanceSource.getMaintenanceDetail(id,yearId)
    }

    /**
     * to create maintenance log
     */
    override suspend fun createMaintenanceLog(maintenanceLog: MaintenanceLog,type:String?): ResponseWrapper<MaintenanceLogDetailResponse> {
        return remoteMaintenanceSource.createMaintenanceLog(maintenanceLog,type)
    }

    /**
     * to update the maintenance log
     */
    override suspend fun updateMaintenanceLog(maintenanceLog: MaintenanceLog): ResponseWrapper<MaintenanceLogDetailResponse> {
        return remoteMaintenanceSource.updateMaintenanceLog(maintenanceLog)

    }

    /**
     * to get the maintenance log detail
     */
    override suspend fun getMaintenanceLogsDetail(
        ids: List<String>,
        totalEntries: Int,
        componentId: String,
        componentName: String,
        possibleFailure: String,
        possibleSolution: String,
        rangeId: String
    ): MutableList<MaintenanceLog?> {
        val maintenanceLogs = mutableListOf<MaintenanceLog?>()

        ids.map {
            val response = remoteMaintenanceSource.getMaintenanceLogDetail(it, rangeId)
            when (response) {
                is ResponseWrapper.Success -> {

                    maintenanceLogs.add(response.value.toMaintenanceDetail(componentName))
                }
                else -> {
                    maintenanceLogs.add(null)
                }
            }
        }

        do {
            maintenanceLogs.add(
                getMaintenanceLog(
                    componentId,
                    componentName,
                    possibleFailure,
                    possibleSolution
                )
            )
        } while (maintenanceLogs.size < totalEntries)

        Timber.d("maintenance log is:" + maintenanceLogs)

        return maintenanceLogs

    }


}