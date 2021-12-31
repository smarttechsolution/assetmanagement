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

package com.prologic.assetManagement.cashbook.ui.home

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.prologic.assetManagement.auth.data.AuthRepository
import com.prologic.assetManagement.auth.data.YearInterval
import com.prologic.assetManagement.cashbook.data.CashbookRepository
import com.prologic.assetManagement.cashbook.data.ClosedCashbook
import com.prologic.assetManagement.maintenance.data.MaintenanceRepository
import com.prologic.assetManagement.util.getCurrentMonthOnly
import com.prologic.assetManagement.util.getCurrentYearOnly
import com.prologic.assetManagement.util.getMonthOnly
import com.prologic.assetManagement.util.yearOnly
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import timber.log.Timber
import java.time.Year
import java.util.*
import javax.inject.Inject

@HiltViewModel
class CashbookHomeViewModel @Inject constructor(val cashbookRepository: CashbookRepository) :
    ViewModel() {

    val closedBooks = mutableListOf<ClosedCashbook>()

    init {
        viewModelScope.launch {
            val response = cashbookRepository.getClosedCashbooks()
            closedBooks.addAll(response)
            val currentDate =
                SelectedYearMonth(month = getCurrentMonthOnly(), year = getCurrentYearOnly())
            _selectedMonth.postValue(currentDate)
        }
    }

    val _selectedMonth = MutableLiveData<SelectedYearMonth>()
    val selectedMonth: LiveData<SelectedYearMonth> = _selectedMonth

    var selectedDate: Date = Calendar.getInstance().time

    fun increaseDateCount() {
        val calendar = Calendar.getInstance()
        calendar.time = selectedDate
        calendar.add(Calendar.MONTH, 1)
        val monthOnly = calendar.time.getMonthOnly()
        val yearOnly = calendar.time.yearOnly()
        _selectedMonth.postValue(SelectedYearMonth(yearOnly, monthOnly))
        selectedDate.time = calendar.time.time
    }

    fun decreaseDateCount() {
        val calendar = Calendar.getInstance()
        calendar.time = selectedDate
        calendar.add(Calendar.MONTH, -1)
        val monthOnly = calendar.time.getMonthOnly()
        val yearOnly = calendar.time.yearOnly()
        _selectedMonth.postValue(SelectedYearMonth(yearOnly, monthOnly))
        selectedDate.time = calendar.time.time
    }


    data class SelectedYearMonth(val year: String, val month: String)

}