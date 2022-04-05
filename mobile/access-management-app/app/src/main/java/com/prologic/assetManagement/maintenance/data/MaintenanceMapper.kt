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

import kotlin.math.cos
import kotlin.math.log

fun MaintenanceResponse.toMaintenance() =

    Maintenance(
        id = id,
        component = componentRes.toMaintenanceComponent(),
        possibleFailure = possibleFailure,
        actionDate = actionDate,
        estCost = cost,
        action = action,
        riskScore = riskScore,
        logEntry = logEntry,
        interval = maintenanceInterval,
        picture = picture,
        type = MaintenanceType.valueOf(mitigation.uppercase())
    )


fun MaintenanceComponentRes.toMaintenanceComponent() = MaintenanceComponent(
    id, name,
    category.toMaintenanceCategory(),

    )

fun MaintenanceCategoryRes.toMaintenanceCategory() = MaintenanceCategory(
    id, name
)

fun MaintenanceLogDetailResponse.toMaintenanceDetail(componentName:String) = MaintenanceLog(
    id = id,
    serverId = id,
    componentId = component,
    componentName = componentName,
    failureReason = possibleFailure,
    possibleSolution = maintenanceAction,
    selectedDate = date,
    intervalDay = duration,
    totalCost = totalCost,
    picture = picture,
    pictureFile = null,
    remarks = remarks,
    supplyBelt = supplyBelt,
    labourCost = labourCost,
    materialCost = materialCost,
    replacementCost = replacementCost,
    isCostSegregated =  false,
    logType = null

)
fun getMaintenanceLog(componentId:String,componentName: String,possibleFailure:String,possibleSolution:String) = MaintenanceLog(
    id = Math.random().toString(),
    serverId = null,
    componentId = componentId,
    componentName = componentName,
    failureReason = possibleFailure,
    possibleSolution = possibleSolution,
    selectedDate = null,
    intervalDay = null,
    totalCost = null,
    picture = null,
    pictureFile = null,
    remarks = null,
    supplyBelt = null,
    labourCost = null,
    materialCost = null,
    replacementCost = null,
    isCostSegregated = false,
    logType = null
)
