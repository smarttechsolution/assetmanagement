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

import com.google.gson.annotations.SerializedName
import java.io.File
import java.util.*

enum class MaintenanceType {
    PREVENTIVE,INSPECTION,REACTIVE
}

data class Maintenance(
    val id:String,
    val component:MaintenanceComponent,
    val possibleFailure: String,
    val action:String,
    val actionDate:String?,
    val estCost:String,
    val riskScore:String,
    val interval:String,
    val logEntry:String,
    val picture:String?,
    val type:MaintenanceType
)

data class MaintenanceParam(
    val maintenanceType: MaintenanceType?,
    val rangeId:String,
    val type:String?,
    val ordering:String?
)
data class MaintenanceComponent(
    val id:String,
    val name:String,
    val category: MaintenanceCategory
)

data class MaintenanceCategory(
    val id:String,
    val name:String,

)
data class MaintenanceResponse(
    @SerializedName("id") val id:String,
    @SerializedName("component") val componentRes: MaintenanceComponentRes,
    @SerializedName("possible_failure") val possibleFailure:String,
    @SerializedName("maintenance_cost") val cost:String,
    @SerializedName("maintenance_action") val action:String,
    @SerializedName("next_action") val actionDate: String?,
    @SerializedName("mitigation") val mitigation:String,
    @SerializedName("componant_picture") val picture:String?,
    @SerializedName("resulting_risk_score") val riskScore:String,
    @SerializedName("maintenance_interval") val maintenanceInterval:String,
    @SerializedName("log_entry") val logEntry:String,
)




data class MaintenanceDetailResponse(
    @SerializedName("id") val id:String,
    @SerializedName("component") val component:String,
    @SerializedName("possible_failure") val possibleFailure:String,
    @SerializedName("maintenance_cost") val maintenanceCost:Double,
    @SerializedName("labour_cost") val labourCost:Double,
    @SerializedName("replacement_cost") val replacementCost:Double,
    @SerializedName("maintenance_action") val action:String,
    @SerializedName("supply_belt") val supplyBelt:String,
    @SerializedName("maintenance_interval") val maintenanceInterval:String,
    @SerializedName("impact_of_failure") val impactOfFailure:String,
    @SerializedName("possibility_of_failure") val failurePossibility:String,
    @SerializedName("resulting_risk_score") val riskScore:String,
    @SerializedName("mitigation") val mitigation:String,
    @SerializedName("responsible") val designatedPerson:String,
    @SerializedName("next_action") val actionDate: String?,
    @SerializedName("componant_picture") val picture:String?,
    @SerializedName("log_entry") val logEntry:String,
    @SerializedName("possible_total_logs") val possibleTotalLogs:String,
    @SerializedName("existing_logs") val logs:List<LogsRes>,
)
data class LogsRes(
   @SerializedName("id") val id:String
)
data class MaintenanceComponentRes(
    @SerializedName("id") val id:String,
    @SerializedName("name") val name:String,
    @SerializedName("category") val category:MaintenanceCategoryRes
)

data class MaintenanceCategoryRes(
    @SerializedName("id") val id:String,
    @SerializedName("name") val name:String
)

data class MaintenanceLogDetailResponse(
    @SerializedName("id") val id:String,
    @SerializedName("component") val component: String,
    @SerializedName("maintenance_date") val date: String,
    @SerializedName("possible_failure") val possibleFailure: String,
    @SerializedName("maintenance_action") val maintenanceAction:String,
    @SerializedName("duration") val duration:String,
    @SerializedName("cost_total") val totalCost: String,
    @SerializedName("labour_cost") val labourCost: String?,
    @SerializedName("material_cost") val materialCost: String?,
    @SerializedName("replacement_cost") val replacementCost: String?,
    @SerializedName("componant_picture") val picture :String?,
    @SerializedName("supply_belt") val supplyBelt:String?,
    @SerializedName("remarks") val remarks: String

)

data class MaintenanceLog(
    var id:String,
    var serverId:String?,
    var componentId:String,
    var componentName:String,
    var failureReason:String,
    var possibleSolution:String,
    var selectedDate: String?,
    var intervalDay:String?,
    var totalCost:String?,
    var picture:String?,
    var pictureFile: File?,
    var remarks:String?,
    var supplyBelt:String?,
    var labourCost: String?,
    var materialCost:String?,
    var replacementCost: String?,
    var isCostSegregated:Boolean,
    var logType:String?
)