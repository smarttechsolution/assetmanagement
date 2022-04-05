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

package com.prologic.assetManagement.cashbook.ui.add

import androidx.lifecycle.*
import com.prologic.assetManagement.R
import com.prologic.assetManagement.auth.data.AuthStore
import com.prologic.assetManagement.cashbook.data.*
import com.prologic.assetManagement.network.ResponseWrapper
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import timber.log.Timber
import java.text.NumberFormat
import java.util.*
import javax.inject.Inject

/**
 * ViewModel for [AddCashbookDialogFragment]
 */
@HiltViewModel
class AddCashbookViewModel @Inject constructor(
    private val cashbookRepository: CashbookRepository,
    private val authStore: AuthStore
) : ViewModel() {

    fun getCashbook(id: String): LiveData<Cashbook> =
        cashbookRepository.getCashbook(id).asLiveData()


    val _categories = MutableLiveData<List<CashbookCategory>>()
    val categories = _categories

    val _addCashbookResponse = MutableLiveData<ResponseWrapper<AddCashbookResponse>>()
    val addCashbookResponse = _addCashbookResponse


    var selectedCategory: CashbookCategory? = null
    var selectedDate: String? = null
    var incomeTitle: String? = null
    var incomeAmount: String? = null
    var replacementAmount: String? = null
    var labourAmount: String? = null
    var materialAmount: String? = null
    var waterSupplied: String? = null
    var remarks: String? = null

    /**
     * to get the category of the income and expense that we need to add
     * @param cashbookType
     */
    fun getCategory(cashbookType: CashbookType) {
        viewModelScope.launch {
            val slug = authStore.getUser().first()?.waterSchemeSlug ?: ""
            when (cashbookType) {
                CashbookType.INCOME -> {
                    val response = cashbookRepository.getIncomeCategory(slug)
                    when (response) {
                        is ResponseWrapper.Success -> {
                            _categories.postValue(response.value.map { it.toCashbookCategory() })
                        }
                        else -> {

                        }
                    }
                }
                CashbookType.EXPENDITURE -> {
                    val response = cashbookRepository.getExpenseCategory(slug)
                    when (response) {
                        is ResponseWrapper.Success -> {
                            _categories.postValue(response.value.map { it.toCashbookCategory() })
                        }
                        else -> {

                        }
                    }
                }
            }
        }
    }

    /**
     * to edit the cashbook
     * @param cashbookId received from argument of the fragment [AddCashbookDialogFragment]
     * @param cashbookType received from the argument the fragment [AddCashbookDialogFragment]
     * @param isWeek is also received from the argument of the fragment [AddCashbookDialogFragment]
     */
    fun editCashbook(cashbookId: String, cashbookType: CashbookType, isWeek: Boolean?,extraCost: Boolean) {
        viewModelScope.launch {
            val format = NumberFormat.getNumberInstance(Locale.getDefault())


            when (cashbookType) {
                CashbookType.INCOME -> {
                    val addParam = AddCashbookParam(
                        category = selectedCategory!!,
                        date = selectedDate!!,
                        title = incomeTitle!!,
                        income = format.parse(incomeAmount).toDouble(),
                        replacementAmt = null, labourAmount = null, materialAmount = null,
                        waterSupplied = waterSupplied?.let { format.parse(waterSupplied).toInt() }?:0,
                        isWeek = isWeek, remarks = remarks,

                        )
                    _addCashbookResponse.postValue(
                        cashbookRepository.editIncome(
                            cashbookId,
                            addParam
                        )
                    )
                }
                CashbookType.EXPENDITURE -> {
                    val addParam = AddCashbookParam(
                        category = selectedCategory!!,
                        date = selectedDate!!,
                        title = incomeTitle!!,
                        income = getExpenditureAmount(extraCost),
                        replacementAmt = replacementAmount?.let { format.parse(it).toDouble() },
                        labourAmount = labourAmount?.let { format.parse(it).toDouble() },
                        materialAmount = materialAmount?.let { format.parse(it).toDouble() },
                        waterSupplied = null,
                        isWeek = isWeek, remarks = remarks
                    )
                    _addCashbookResponse.postValue(
                        cashbookRepository.editExpense(
                            cashbookId,
                            addParam
                        )
                    )
                }
            }
        }
    }


    /**
     *  cashbook type is either [CashbookType.EXPENDITURE] or [CashbookType.INCOME]
     *  add income or expense as per the cashbook type
     */
    fun addCashbook(cashbookType: CashbookType, isWeek: Boolean?, extraCost: Boolean) {
        viewModelScope.launch {
            val format = NumberFormat.getNumberInstance(Locale.getDefault())

            when (cashbookType) {
                CashbookType.INCOME -> {
                    val addParam = AddCashbookParam(
                        category = selectedCategory!!,
                        date = selectedDate!!,
                        title = incomeTitle!!,
                        income = format.parse(incomeAmount).toDouble(),
                        replacementAmt = null, labourAmount = null, materialAmount = null,
                        waterSupplied = waterSupplied?.let { format.parse(waterSupplied).toInt() },
                        isWeek,
                        remarks = remarks
                    )
                    _addCashbookResponse.postValue(cashbookRepository.addIncome(addParam))
                }
                CashbookType.EXPENDITURE -> {


                    val addParam = AddCashbookParam(
                        category = selectedCategory!!,
                        date = selectedDate!!,
                        title = incomeTitle!!,
                        income = getExpenditureAmount(extraCost),
                        replacementAmt = replacementAmount?.let { format.parse(it).toDouble() },
                        labourAmount = labourAmount?.let { format.parse(it).toDouble() },
                        materialAmount = materialAmount?.let { format.parse(it).toDouble() },
                        waterSupplied = null,
                        isWeek,
                        remarks = remarks
                    )
                    Timber.d("the add param is:" + addParam)

                    _addCashbookResponse.postValue(cashbookRepository.addExpense(addParam))
                }
            }
        }
    }


    fun getExpenditureAmount(extraCost: Boolean): Double {
        var amount = 0.0
        val format = NumberFormat.getNumberInstance(Locale.getDefault())

        amount = if (extraCost) {

            val rAmnt = replacementAmount?.let { format.parse(it).toDouble() } ?: 0.0
            val lAmnt = labourAmount?.let { format.parse(it).toDouble() } ?: 0.0
            val mAmnt = materialAmount?.let { format.parse(it).toDouble() } ?: 0.0
            lAmnt + rAmnt + mAmnt
        } else {
            format.parse(incomeAmount).toDouble()
        }
        return amount
    }


    fun validateAddIncomeCashbook(): ValidateMessage {
        return if (selectedCategory == null)
            ValidateMessage(false, R.string.add_cashbook_select_category)
        else if (selectedDate == null)
            ValidateMessage(false, R.string.add_cashbook_select_date)
        else if (incomeTitle == null || incomeTitle!!.length < 3)
            ValidateMessage(false, R.string.cashbook_income_title_empty)
        else if (incomeAmount == null)
            ValidateMessage(false, R.string.cashbook_income_amount_empty)
        else
            ValidateMessage(true, 0)
    }

    fun validateAddExpenseCashbook(extraCost: Boolean): ValidateMessage {
        return if (selectedCategory == null)
            ValidateMessage(false, R.string.add_cashbook_select_category)
        else if (selectedDate == null)
            ValidateMessage(false, R.string.add_cashbook_select_date)
        else if (incomeTitle == null || incomeTitle!!.length < 3)
            ValidateMessage(false, R.string.cashbook_expense_title_empty)
        else {
            if (extraCost) {
                if (labourAmount == null || materialAmount == null || replacementAmount == null) {
                    ValidateMessage(false, R.string.cashbook_expense_amount_empty)
                } else {
                    ValidateMessage(true, 0)
                }
            } else {
                if (incomeAmount == null)
                    ValidateMessage(false, R.string.cashbook_expense_amount_empty)
                else
                    ValidateMessage(true, 0)
            }
        }
    }

    data class ValidateMessage(val valid: Boolean, val message: Int)

}