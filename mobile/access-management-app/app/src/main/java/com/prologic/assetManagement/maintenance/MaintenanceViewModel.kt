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

package com.prologic.assetManagement.maintenance

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.prologic.assetManagement.maintenance.data.*
import com.prologic.assetManagement.network.ResponseWrapper
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
class MaintenanceViewModel @Inject constructor(private val maintenanceRepository: MaintenanceRepository): ViewModel() {

    private val _maintenanceLogs = MutableLiveData<List<Maintenance>>()
     val maintenanceLogs : LiveData<List<Maintenance>> = _maintenanceLogs




    private val _maintenanceDetail = MutableLiveData<ResponseWrapper<MaintenanceDetailResponse>>()
    val maintenanceDetail : LiveData<ResponseWrapper<MaintenanceDetailResponse>> = _maintenanceDetail

     val _logActionResponse = MutableLiveData<ResponseWrapper<MaintenanceLogDetailResponse>>()
     val logActionResponse =  _logActionResponse

    val _logs = MutableLiveData<MutableList<MaintenanceLog?>>()
    val logs: LiveData<MutableList<MaintenanceLog?>> = _logs

    val _logPosition = MutableLiveData<Int>()
    val logPosition :LiveData<Int> = _logPosition

    var totalLogs : Int = 0

    fun getMaintenanceLogs(maintenanceType: MaintenanceType,rangeId:String,ordering:String?){
        viewModelScope.launch {
            val maintenanceParam = MaintenanceParam(maintenanceType,rangeId,null,ordering)
            _maintenanceLogs.postValue(maintenanceRepository.getMaintenanceLogs(maintenanceParam))
        }
    }



    fun getMaintenanceLogsDetail( ids:List<String>,totalEntries:Int, componentId:String, componentName:String,possibleFailure:String, possibleSolution:String,rangeId: String){
        viewModelScope.launch {
          _logs.postValue(maintenanceRepository.getMaintenanceLogsDetail(ids,totalEntries,componentId, componentName, possibleFailure, possibleSolution,rangeId))
        }
    }


    fun getMaintenanceDetail(id:String,rangeId:String){
        viewModelScope.launch {
           _maintenanceDetail.postValue(maintenanceRepository.getMaintenanceDetail(id,rangeId))
        }
    }

    fun createMaintenance(maintenanceLog: MaintenanceLog){
        Timber.d("the log is:"+maintenanceLog)
        viewModelScope.launch {
          _logActionResponse.postValue(  maintenanceRepository.createMaintenanceLog(maintenanceLog,null))
        }
    }
 fun updateMaintenance(maintenanceLog: MaintenanceLog){
        viewModelScope.launch {
            _logActionResponse.postValue(maintenanceRepository.updateMaintenanceLog(maintenanceLog))
        }
    }


}