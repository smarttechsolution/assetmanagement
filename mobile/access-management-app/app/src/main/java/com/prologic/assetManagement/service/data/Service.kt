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

import com.google.gson.annotations.SerializedName
import java.util.*

enum class ServiceType {
    SUPPLY, QUALITY_TESTS
}

data class WaterSupplyRecordResponse(
    @SerializedName("total_supply") val totalSupply: String,
    @SerializedName("estimated_household") val estimatedHouseholds: String,
    @SerializedName("estimated_beneficiaries") val estimatedBeneficiaries: String,
    @SerializedName("is_daily") val isDaily: Boolean,
    @SerializedName("supply_belts") val supplyBelts: String?
)

data class WaterSupplySource(
    val estimatedHouseholds: Int,
    val estimatedBeneficiaries: Int,
    val supplyBelt: String,
    val isDaily: Boolean
)

data class CreateWaterSupplyParam(
    @SerializedName("date_from") val dateFrom: String,
    @SerializedName("date_to") val dateTo: String?,
    @SerializedName("total_supply") val totalSupply: String,
    @SerializedName("estimated_household") val estimatedHouseholds: String,
    @SerializedName("estimated_beneficiaries") val estimatedBeneficiaries: String,
    @SerializedName("supply_belts") val supplyBelt: String,
    @SerializedName("is_daily") val isDaily: Boolean

)

data class SupplyBelt(
    val id: String,
    val name: String,
    val beltType: String,
    val beneficiaryHouseholdsCount: Int,
    val beneficiaryPopulationCount: Int,
    val publicTapsCount: Int,
    val institutionalConnectionCount: Int
)

data class SupplyBeltResponse(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("belt_type") val beltType: String,
    @SerializedName("beneficiary_household") val beneficiaryHousehold: Int,
    @SerializedName("beneficiary_population") val beneficiaryPopulation: Int,
    @SerializedName("public_taps") val publicTaps: Int,
    @SerializedName("institutional_connection") val institutionalConnection: Int
)

data class WaterQualityParameter(
    val id: String,
    val name: String,
    val unit: String,
    val standard: String?,
    var value: String?
)

data class WaterParam(
    @SerializedName("parameter") val id: String,
    @SerializedName("value") val value: String?
)

data class WaterTestResult(
    @SerializedName("date_from") val dateFrom:String,
    @SerializedName("date_to") val dateTo: String?,
    @SerializedName("supply_belts") val supplyBelt: String?,
    @SerializedName("test_result_parameter") val items:List<WaterParam>
)


data class WaterTestParameterResponse(
    @SerializedName("id") val id: String,
    @SerializedName("parameter_name") val parameterName: String,
    @SerializedName("unit") val unit: String,
    @SerializedName("NDWQS_standard") val standard: String?
)
