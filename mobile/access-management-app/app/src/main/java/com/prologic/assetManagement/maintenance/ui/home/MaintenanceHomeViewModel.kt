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

package com.prologic.assetManagement.maintenance.ui.home

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.prologic.assetManagement.auth.data.AuthRepository
import com.prologic.assetManagement.auth.data.YearInterval
import com.prologic.assetManagement.auth.data.YearIntervalResponse
import com.prologic.assetManagement.maintenance.data.MaintenanceRepository
import com.prologic.assetManagement.network.ResponseWrapper
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import java.time.Year
import javax.inject.Inject

/**
 * ViewModel from [MaintenanceHomeFragment]
 */
@HiltViewModel
class MaintenanceHomeViewModel @Inject constructor(authRepository: AuthRepository) : ViewModel() {


    val _selectedYear = MutableLiveData<YearInterval>()
    val selectedYear: LiveData<YearInterval> = _selectedYear

    val _rangeResponse = MutableLiveData<ResponseWrapper<List<YearIntervalResponse>>>()
    val rangeResponse: LiveData<ResponseWrapper<List<YearIntervalResponse>>> = _rangeResponse


    val ranges: MutableList<YearInterval> = mutableListOf()
    var count = 0

    init {
        viewModelScope.launch {
            val response = authRepository.getYearIntervals()
            when (response) {
                is ResponseWrapper.Success -> {
                    val items = response.value
                    if (items.isNotEmpty()) {
                        ranges.addAll(items.map { YearInterval(it.id, it.date, it.endDate,it.yearNo) })
                        val positionResponse = items.find { it.isPresentYear }
                        val pos = items.indexOf(positionResponse)
                        count = pos
                        _selectedYear.postValue(ranges[count])
                    }

                }
                else -> {

                }
            }
            _rangeResponse.postValue(response)


        }
    }

    fun increaseDateRage() {
        if (count < ranges.size) {
            count += 1
            if (ranges.size > count) {
                _selectedYear.postValue(ranges.get(count))
            }
        }
    }

    fun decreaseDateRange() {
        if (count > 0) {
            count -= 1
            if (ranges.size > count) {
                _selectedYear.postValue(ranges.get(count))
            }
        }
    }

}