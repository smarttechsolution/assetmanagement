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

package com.prologic.assetManagement.maintenance.ui.notScheduled

import androidx.lifecycle.*
import com.prologic.assetManagement.cashbook.data.CashbookCategory
import com.prologic.assetManagement.cashbook.data.CashbookResponse
import com.prologic.assetManagement.maintenance.data.*
import com.prologic.assetManagement.network.ResponseWrapper
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
class NotScheduledViewModel @Inject constructor(val maintenanceRepository: MaintenanceRepository) :
    ViewModel() {



    private val _unScheduledMaintenanceLogs = MutableLiveData<List<Maintenance>>()
    val unscheduledMaintenanceLogs: LiveData<List<Maintenance>> = _unScheduledMaintenanceLogs

    var selectedMaintenance: Maintenance? = null

    val _addLogResponse = MutableLiveData<ResponseWrapper<MaintenanceLogDetailResponse>>()
    val addLogResponse: LiveData<ResponseWrapper<MaintenanceLogDetailResponse>> = _addLogResponse



    fun getUnscheduledMaintenanceLogs(rangeId: String, type: String) {
        viewModelScope.launch {
            val maintenanceParam = MaintenanceParam(null, rangeId, type, null)
            _unScheduledMaintenanceLogs.postValue(
                maintenanceRepository.getMaintenanceLogs(
                    maintenanceParam
                )
            )
        }
    }

     fun saveMaintenanceLog(maintenanceLog: MaintenanceLog) {
        viewModelScope.launch {
            _addLogResponse.postValue(maintenanceRepository.createMaintenanceLog(maintenanceLog,"not-schedule"))
        }
    }




}