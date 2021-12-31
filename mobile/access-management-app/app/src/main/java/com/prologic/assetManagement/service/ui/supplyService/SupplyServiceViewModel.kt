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

package com.prologic.assetManagement.service.ui.supplyService

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.prologic.assetManagement.R
import com.prologic.assetManagement.auth.data.AuthRepository
import com.prologic.assetManagement.auth.data.AuthStore
import com.prologic.assetManagement.cashbook.ui.add.AddCashbookViewModel
import com.prologic.assetManagement.network.ResponseWrapper
import com.prologic.assetManagement.service.data.CreateWaterSupplyParam
import com.prologic.assetManagement.service.data.SupplyBelt
import com.prologic.assetManagement.service.data.WaterServiceRepository
import com.prologic.assetManagement.service.data.WaterSupplyRecordResponse
import com.prologic.assetManagement.util.getServerDateFormat
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import java.util.*
import javax.inject.Inject

/**
 * ViewModel for [SupplyServiceFragment]
 */
@HiltViewModel
class SupplyServiceViewModel @Inject constructor(val supplyRepository:WaterServiceRepository,val authStore: AuthStore) : ViewModel(){

    val _supplybelts = MutableLiveData<List<SupplyBelt>>()
    val supplyBelts:LiveData<List<SupplyBelt>> = _supplybelts


    val _actionResponse = MutableLiveData<ResponseWrapper<WaterSupplyRecordResponse>>()
    val actionResponse :LiveData<ResponseWrapper<WaterSupplyRecordResponse>> = _actionResponse


    var selectedSupplyBelt :String? = null
    var fromDate:String? = null
    var toDate:String? = null
    var estimatedHouseholds:String? = null
    var estimatedBeneficiaries:String? = null
    var totalSupply:String? = null


    fun createWaterSupply(){
        viewModelScope.launch {
            val createWaterSupplyParam = CreateWaterSupplyParam(
                dateFrom = fromDate!!,
                dateTo = toDate,
                estimatedHouseholds = estimatedHouseholds?:"0",
                estimatedBeneficiaries = estimatedBeneficiaries?:"0",
                supplyBelt = selectedSupplyBelt?:"",
                isDaily = true,totalSupply = totalSupply?:"0"
            )
            _actionResponse.postValue(supplyRepository.createWaterSupplySource(createWaterSupplyParam))
        }
    }

    fun getWaterSupplyForSelectedDate(){
        viewModelScope.launch {
           _actionResponse.postValue( supplyRepository.getWaterSupplySource(
                fromDate!!,
                toDate
            )
           )
        }
    }

  init {
      viewModelScope.launch {
          val user = authStore.getUser().first()
        _supplybelts.postValue( supplyRepository.getSupplyBelt(user?.waterSchemeSlug?:""))
      }
  }

    fun validateAddIncomeCashbook():SupplyValidateMessage {
        return if (fromDate == null)
           SupplyValidateMessage(false, R.string.error_supply_from_date_empty)
      //  else if (selectedSupplyBelt == null)
        //    SupplyValidateMessage(false, R.string.error_supply_belt_empty)
        else if (totalSupply == null)
            SupplyValidateMessage(false, R.string.error_supply_total_units)
        else if (estimatedHouseholds == null)
           SupplyValidateMessage(false, R.string.error_supply_estimated_household_empty)
        else if (estimatedBeneficiaries==null)
           SupplyValidateMessage(false, R.string.error_supply_estimated_beneficiaries_empty)
        else
           SupplyValidateMessage(true, 0)
    }

    data class SupplyValidateMessage(val valid: Boolean, val message: Int)



}