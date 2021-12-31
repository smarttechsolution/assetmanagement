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

package com.prologic.assetManagement.cashbook.ui

import androidx.lifecycle.*
import com.prologic.assetManagement.auth.data.AuthStore
import com.prologic.assetManagement.cashbook.data.*
import com.prologic.assetManagement.network.ResponseWrapper
import com.prologic.assetManagement.util.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import java.util.*
import javax.inject.Inject

@HiltViewModel
class CashbookViewModel @Inject constructor(
    private val authStore: AuthStore,
    private val cashbookRepository: CashbookRepository
) :
    ViewModel() {


    val _isWeek = MutableLiveData<Boolean>(false)
    val isWeek: LiveData<Boolean> = _isWeek

    val _selectedWeek = MutableLiveData<Date>()
    val selectedWeek: LiveData<Date> = _selectedWeek

    val _cashbookResponse = MutableLiveData<ResponseWrapper<List<CashbookResponse>>>()
    val cashbookResponse: LiveData<ResponseWrapper<List<CashbookResponse>>> = _cashbookResponse


    fun getCashbooks(cashbookType: CashbookType): LiveData<MutableList<CashbookUiModel>> {
        val items = isWeek.switchMap { isWeek ->
            cashbookRepository.getCashbooks(cashbookType, isWeek = isWeek).asLiveData()
        }
        return items
    }

    fun swapToWeekView(year: String, month: String) {
        if (selectedWeek.value == null) {
            _selectedWeek.postValue(getDateFromYearAndMonth(year, month))
        }
        val value = isWeek.value
        value?.let {
            if (value) {
                _isWeek.postValue(false)
            } else {
                _isWeek.postValue(true)
            }
        }
    }


    fun reduceWeeks() {
        val calendar = Calendar.getInstance()
        calendar.time = selectedWeek.value
        calendar.firstDayOfWeek = Calendar.SUNDAY
        calendar[Calendar.DAY_OF_WEEK] = Calendar.SUNDAY
        calendar.add(Calendar.DAY_OF_MONTH, -7)
        _selectedWeek.postValue(calendar.time)

    }

    fun increaseWeeks() {
        val calendar = Calendar.getInstance()
        calendar.time = selectedWeek.value
        calendar.firstDayOfWeek = Calendar.SUNDAY
        calendar[Calendar.DAY_OF_WEEK] = Calendar.SUNDAY
        calendar.add(Calendar.DAY_OF_MONTH, 7)
        _selectedWeek.postValue(calendar.time)
    }

    private val _previousMonthTotal = MutableLiveData<List<CashbookTotal>>()
    val previousMonthTotal: LiveData<List<CashbookTotal>> = _previousMonthTotal

    private val _currentMonthTotal = MutableLiveData<List<CashbookTotal>>()
    val currentMonthTotal: LiveData<List<CashbookTotal>> = _currentMonthTotal


    fun refreshCashbooks(
        cashbookType: CashbookType,
        isWeek: Boolean,
        selectedYear: String?,
        selectedMonth: String?
    ) {
        viewModelScope.launch {
            val user = authStore.getUser().first()
            var startDate: String? = null
            var endDate: String? = null
            if (isWeek) {
                val weeks = selectedWeek.value?.getCurrentWeekRange()
                weeks?.let {
                    startDate = it[0]
                    endDate = it[it.size - 1]
                }
            }

            val param = CashbookParam(
                cashbookType,
                user?.waterSchemeSlug ?: "",
                selectedYear,
                selectedMonth,
                isWeek, startDate, endDate,
                selectedWeek.value
            )
            when (cashbookType) {
                CashbookType.EXPENDITURE ->
                    _cashbookResponse.postValue(
                        cashbookRepository.getExpenses(
                            param
                        )
                    )
                CashbookType.INCOME -> _cashbookResponse.postValue(
                    cashbookRepository.getIncome(
                        param
                    )
                )
            }
        }
    }

    fun getPresentPreviousMonthCashbook(
        cashbookType: CashbookType, selectedYear: String?,
        selectedMonth: String?
    ) {
        viewModelScope.launch {
            val user = authStore.getUser().first()
            val slug = user?.waterSchemeSlug ?: ""
            when (cashbookType) {
                CashbookType.INCOME -> {
                    when (val response = cashbookRepository.getPresentPreviousIncome(slug,selectedYear,selectedMonth)) {
                        is ResponseWrapper.Success -> {
                            _previousMonthTotal.postValue(response.value.previousMonthData.map {
                                it.toCashbookTotal(
                                    CashbookType.INCOME
                                )
                            })
                            _currentMonthTotal.postValue(response.value.presentMonthData.map {
                                it.toCashbookTotal(
                                    CashbookType.INCOME
                                )
                            })
                        }
                    }

                }
                CashbookType.EXPENDITURE -> {
                    when (val response = cashbookRepository.getPresentPreviousExpense(slug,selectedYear,selectedMonth)) {
                        is ResponseWrapper.Success -> {
                            _previousMonthTotal.postValue(response.value.previousMonthData.map {
                                it.toCashbookTotal(
                                    CashbookType.EXPENDITURE
                                )
                            })
                            _currentMonthTotal.postValue(response.value.presentMonthData.map {
                                it.toCashbookTotal(
                                    CashbookType.EXPENDITURE
                                )
                            })
                        }
                    }

                }
            }
        }
    }


    fun deleteCashbook(cashbookType: CashbookType,selectedYear: String?,selectedMonth: String?, id: String) {
        viewModelScope.launch {
            when (cashbookType) {
                CashbookType.INCOME -> {

                    cashbookRepository.deleteIncome(id)
                    getPresentPreviousMonthCashbook(cashbookType,selectedYear,selectedMonth)
                }
                CashbookType.EXPENDITURE -> {
                    cashbookRepository.deleteExpense(id)
                    getPresentPreviousMonthCashbook(cashbookType,selectedYear,selectedMonth)
                }

            }
        }
    }


}