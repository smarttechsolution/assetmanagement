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

package com.prologic.assetManagement.cashbook.data

import com.prologic.assetManagement.cashbook.data.local.LocalCashbookSource
import com.prologic.assetManagement.cashbook.data.remote.RemoteCashbookSource
import com.prologic.assetManagement.network.ResponseWrapper
import com.prologic.assetManagement.util.getCurrentWeekRange

import com.prologic.assetManagement.util.getWeekFormatDate
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.map
import timber.log.Timber
import java.text.SimpleDateFormat
import javax.inject.Inject


/**
 * [CashbookRepository] which is manages the communication between [LocalCashbookSource] and [RemoteCashbookSource]
 */
class CashbookRepository @Inject constructor(
    private val localCashbookSource: LocalCashbookSource,
    private val remoteCashbookSource: RemoteCashbookSource
) : ICashbookRepository {



    fun getCashbooks(
        cashbookType: CashbookType,
        isWeek: Boolean
    ): Flow<MutableList<CashbookUiModel>> {
        val flow = localCashbookSource.getCashbooks(cashbookType, isWeek)
        return flow.map { cashbooks ->
            val items = mutableListOf<CashbookUiModel>()
            if (isWeek) {
                val datesGroup = cashbooks.groupBy { it.dateEn }
                datesGroup.map {
                    items.add(CashbookUiModel.CashbookDateUiModel(it.key))
                    val categories = getCashbookWithCategory(it.value)
                    items.addAll(categories)
                }

            } else {
                items.addAll(getCashbookWithCategory(cashbooks))
            }
            items

        }
    }

    fun getCashbookWithCategory(cashbooks: List<Cashbook>): List<CashbookUiModel> {
        val items = mutableListOf<CashbookUiModel>()

        val categories = cashbooks.groupBy { it.category }
        categories.entries.map { enteirs ->
            items.add(CashbookUiModel.CashbookCategoryUiModel(enteirs.key))
            val infos = enteirs.value.map {
                CashbookUiModel.CashbookInfoUiModel(it)
            }
            items.addAll(infos)

        }
        return items
    }

    fun getCashbook(id: String): Flow<Cashbook> = localCashbookSource.getCashbook(id)

    override suspend fun getExpenses(cashbookParam: CashbookParam): ResponseWrapper<List<CashbookResponse>> {
        return when (val response = remoteCashbookSource.getExpense(cashbookParam)) {
            is ResponseWrapper.Success -> {
                Timber.d("inside get expense success:" + cashbookParam)
                localCashbookSource.deleteCashbookByType(CashbookType.EXPENDITURE)
                val items = mutableListOf<Cashbook>()
                val serverCashbooks = response.value.map {
                    it.toCashbook(
                        CashbookType.EXPENDITURE,
                        cashbookParam.week
                    )
                }
                items.addAll(serverCashbooks)

                if (cashbookParam.week) {
                    cashbookParam.start?.let {
                        cashbookParam.selectedDate?.getCurrentWeekRange()?.let {
                            for (date in it) {
                                if (serverCashbooks.find { cashbook -> date == cashbook.date } == null)
                                    items.add(
                                        getEmptyCashbook(
                                            Math.random().toString(),
                                            cashbookType = CashbookType.EXPENDITURE,
                                            date
                                        )
                                    )
                            }
                        }

                    }
                }
                localCashbookSource.addCashbooks(items)
                Timber.d("inside adding all the cashbooks really")
                response
            }

            else -> {
                response
            }

        }


    }

    override suspend fun getIncome(cashbookParam: CashbookParam): ResponseWrapper<List<CashbookResponse>> {

        return when (val response = remoteCashbookSource.getIncome(cashbookParam)) {
            is ResponseWrapper.Success -> {
                localCashbookSource.deleteCashbookByType(CashbookType.INCOME)
                val items = mutableListOf<Cashbook>()
                val serverCashbooks =
                    response.value.map { it.toCashbook(CashbookType.INCOME, cashbookParam.week) }
                items.addAll(serverCashbooks)

                if (cashbookParam.week) {
                    cashbookParam.start?.let {
                        cashbookParam.selectedDate?.getCurrentWeekRange()?.let {
                            for (date in it) {
                                if (serverCashbooks.find { cashbook -> date == cashbook.date } == null)
                                    items.add(
                                        getEmptyCashbook(
                                            Math.random().toString(),
                                            cashbookType = CashbookType.EXPENDITURE,
                                            date
                                        )
                                    )
                            }
                        }


                    }
                }

                Timber.d("the size of items is:" + items.size)
                localCashbookSource.addCashbooks(items)

                if (serverCashbooks.isEmpty()) {
                    val id = Math.random().toString()
                    localCashbookSource.addCashbook(
                        getEmptyCashbook(
                            id,
                            cashbookParam.cashbookType,
                            ""
                        )
                    )
                    localCashbookSource.deleteCashbook(id)
                }
                response
            }
            else -> {
                response
            }

        }


    }

    override suspend fun getPresentPreviousExpense(
        scheme: String,
        year: String?,
        month: String?
    ): ResponseWrapper<PresentPreviousListResponse> {
        return remoteCashbookSource.getPreviousPresentExpense(scheme, year, month)
    }

    override suspend fun getPresentPreviousIncome(
        scheme: String,
        year: String?,
        month: String?
    ): ResponseWrapper<PresentPreviousListResponse> {
        return remoteCashbookSource.getPreviousPresentIncome(scheme, year, month)
    }

    override suspend fun addIncome(addIncomeParam: AddCashbookParam): ResponseWrapper<AddCashbookResponse> {
        return when (val response =
            remoteCashbookSource.addIncome(addIncomeParam.toAddIncomeParam())) {
            is ResponseWrapper.Success -> {
                localCashbookSource.addCashbook(
                    response.value.toCashbook(
                        response.value.id, CashbookType.INCOME,
                        addIncomeParam.category, addIncomeParam.isWeek
                    )
                )
                response
            }
            else -> response
        }

    }

    override suspend fun addExpense(addExpenseParam: AddCashbookParam): ResponseWrapper<AddCashbookResponse> {
        return when (val response =
            remoteCashbookSource.addExpense(addExpenseParam.toAddExpenseParam())) {
            is ResponseWrapper.Success -> {
                localCashbookSource.addCashbook(
                    response.value.toCashbook(
                        response.value.id,
                        CashbookType.EXPENDITURE,
                        addExpenseParam.category,
                        addExpenseParam.isWeek
                    )
                )
                response
            }
            else -> response
        }
    }

    override suspend fun editIncome(
        id: String,
        addIncomeParam: AddCashbookParam
    ): ResponseWrapper<AddCashbookResponse> {
        return when (val response =
            remoteCashbookSource.editIncome(id, addIncomeParam.toAddIncomeParam())) {
            is ResponseWrapper.Success -> {
                localCashbookSource.updateCashbook(
                    response.value.toCashbook(
                        id,
                        CashbookType.INCOME,
                        addIncomeParam.category,
                        addIncomeParam.isWeek
                    )
                )
                response
            }
            else -> response
        }
    }

    override suspend fun editExpense(
        id: String,
        addExpenseParam: AddCashbookParam
    ): ResponseWrapper<AddCashbookResponse> {
        return when (val response =
            remoteCashbookSource.editExpense(id, addExpenseParam.toAddExpenseParam())) {
            is ResponseWrapper.Success -> {
                localCashbookSource.updateCashbook(
                    response.value.toCashbook(
                        id,
                        CashbookType.EXPENDITURE,
                        addExpenseParam.category,
                        addExpenseParam.isWeek
                    )
                )
                response
            }
            else -> response
        }
    }

    override suspend fun deleteIncome(id: String): ResponseWrapper<Void> {
        localCashbookSource.deleteCashbook(id)
        return when (val response = remoteCashbookSource.deleteIncome(id)) {
            is ResponseWrapper.Success -> {
                response
            }
            else -> response
        }
    }

    override suspend fun deleteExpense(id: String): ResponseWrapper<Void> {
        localCashbookSource.deleteCashbook(id)
        return when (val response = remoteCashbookSource.deleteExpense(id)) {
            is ResponseWrapper.Success -> {
                 response
            }
            else -> response
        }
    }


    override suspend fun getIncomeCategory(slug: String): ResponseWrapper<List<CashbookCategoryRes>> {
        return remoteCashbookSource.getIncomeCategory(slug)
    }

    override suspend fun getExpenseCategory(slug: String): ResponseWrapper<List<CashbookCategoryRes>> {
        return remoteCashbookSource.getExpenseCategory(slug)
    }

    override suspend fun closeCashbook(closeCashbookParam: CloseCashbookParam): ResponseWrapper<CloseCashbookResponse> {
        return remoteCashbookSource.closeCashbook(closeCashbookParam)
    }

    override suspend fun getClosedCashbooks(): List<ClosedCashbook> {
        val list = mutableListOf<ClosedCashbook>()
        val response = remoteCashbookSource.getClosedMonths()
        return when (response) {
            is ResponseWrapper.Success -> {
                list.addAll(response.value.map { ClosedCashbook(it.dateNp, it.date) })
                list
            }
            else -> list
        }
    }
}

