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

package com.prologic.assetManagement.service.ui.qualityTest

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.prologic.assetManagement.R
import com.prologic.assetManagement.network.ResponseWrapper
import com.prologic.assetManagement.service.data.WaterParam
import com.prologic.assetManagement.service.data.WaterQualityParameter
import com.prologic.assetManagement.service.data.WaterServiceRepository
import com.prologic.assetManagement.service.data.WaterTestResult
import com.prologic.assetManagement.util.getServerDateFormat
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import java.util.*
import javax.inject.Inject

@HiltViewModel
class QualityTestViewModel @Inject constructor(val waterServiceRepository: WaterServiceRepository) :ViewModel(){

    private val _waterQualityParams=MutableLiveData<List<WaterQualityParameter>>()
    val waterQualityParams:LiveData<List<WaterQualityParameter>> = _waterQualityParams

     val _actionResponse = MutableLiveData<ResponseWrapper<WaterTestResult>>()
    val actionResponse :LiveData<ResponseWrapper<WaterTestResult>> = _actionResponse



    var fromDate:String? =null
    var toDate:String? = null
    var parameters: MutableList<WaterQualityParameter> = mutableListOf()
    var selectedSupplyBelt:String? = null

    init {
        viewModelScope.launch {
           _waterQualityParams.postValue( waterServiceRepository.getWaterQualityTestParameter())
        }
    }

    fun createWaterTestResult(){
        viewModelScope.launch {
            val result = WaterTestResult(
                fromDate!!,
                toDate,
                selectedSupplyBelt,
                parameters.map { WaterParam(it.id,it.value) }
            )
           _actionResponse.postValue( waterServiceRepository.createWaterTestResult(result))
        }
    }

    fun validateAddIncomeCashbook():WaterValidateMessage {
        return if (fromDate == null)
            WaterValidateMessage(false, R.string.error_supply_from_date_empty)
        else if (parameters.size <1)
            WaterValidateMessage(false, R.string.error_water_parameters)
        else {
            val nullNames = parameters.filter { it.value == null }
            if (nullNames.isNotEmpty()){
                WaterValidateMessage(false, R.string.error_supply_total_units)
            }else {
                WaterValidateMessage(true, 0)
            }
        }
    }

    data class WaterValidateMessage(val valid: Boolean, val message: Int)

}