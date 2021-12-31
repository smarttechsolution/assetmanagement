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

package com.prologic.assetManagement.cashbook.data.remote

import com.prologic.assetManagement.cashbook.data.*
import com.prologic.assetManagement.cashbook.data.local.LocalCashbookSource
import com.prologic.assetManagement.network.IoDispatcher
import com.prologic.assetManagement.network.ResponseWrapper
import com.prologic.assetManagement.network.safeApiCall
import kotlinx.coroutines.CoroutineDispatcher
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.File
import javax.inject.Inject
import kotlin.collections.HashMap

/**
 * [RemoteCashbookSource] performs all the remote/api related cashbook operation in the database
 */
class RemoteCashbookSource @Inject constructor(
    private val cashbookService: CashbookService,
    @IoDispatcher private val dispatcher: CoroutineDispatcher
) {

    /**
     * To get the income as per the given parameter
     * @param cashbookParam
     */
    suspend fun getIncome(cashbookParam: CashbookParam): ResponseWrapper<List<CashbookResponse>> =
        safeApiCall(dispatcher) {
            cashbookService.getIncome(
                cashbookParam.slug,
                cashbookParam.year,
                cashbookParam.month,
                if (cashbookParam.week) true else null,
                cashbookParam.start,
                cashbookParam.end
            )
        }

    /**
     * get the total income of previous and present month
     */
    suspend fun getPreviousPresentIncome(
        scheme: String,
        year: String?,
        month: String?
    ): ResponseWrapper<PresentPreviousListResponse> =
        safeApiCall(dispatcher) {
            cashbookService.getPresentPreviousIncome(scheme, year, month)
        }

    /**
     * geet the expense as per the given parameter
     * @param cashbookParam
     */
    suspend fun getExpense(cashbookParam: CashbookParam): ResponseWrapper<List<CashbookResponse>> =
        safeApiCall(dispatcher) {
            cashbookService.getExpense(
                cashbookParam.slug,
                cashbookParam.year,
                cashbookParam.month,
                if (cashbookParam.week) true else null,
                cashbookParam.start,
                cashbookParam.end
            )
        }

    /**
     * get the expense of previous and pressent month
     */
    suspend fun getPreviousPresentExpense(
        scheme: String,
        year: String?,
        month: String?
    ): ResponseWrapper<PresentPreviousListResponse> =
        safeApiCall(dispatcher) {
            cashbookService.getPresentPreviousExpense(scheme, year, month)
        }

    /**
     * add expense
     */
    suspend fun addExpense(addExpenseParam: AddExpenseParam): ResponseWrapper<AddCashbookResponse> =
        safeApiCall(dispatcher) {
            cashbookService.createExpenditure(addExpenseParam)
        }

    /**
     * add income
     */
    suspend fun addIncome(addIncomeParam: AddIncomeParam): ResponseWrapper<AddCashbookResponse> =
        safeApiCall(dispatcher) {
            cashbookService.createIncome(addIncomeParam)
        }

    /**
     * edit expense
     */
    suspend fun editExpense(
        id: String,
        addExpenseParam: AddExpenseParam
    ): ResponseWrapper<AddCashbookResponse> =
        safeApiCall(dispatcher) {
            cashbookService.editExpenditure(id, addExpenseParam)
        }

    /**
     * edit income
     */
    suspend fun editIncome(
        id: String,
        addIncomeParam: AddIncomeParam
    ): ResponseWrapper<AddCashbookResponse> =
        safeApiCall(dispatcher) {
            cashbookService.editIncome(id, addIncomeParam)
        }

    /**
     * delete income
     */
    suspend fun deleteIncome(id: String): ResponseWrapper<Void> =
        safeApiCall(dispatcher) {
            cashbookService.deleteIncome(id)
        }

    /**
     * delete expense
     */
    suspend fun deleteExpense(id: String): ResponseWrapper<Void> =
        safeApiCall(dispatcher) {
            cashbookService.deleteExpenditure(id)
        }


    /**
     * get income category
     */
    suspend fun getIncomeCategory(slug: String): ResponseWrapper<List<CashbookCategoryRes>> =
        safeApiCall(dispatcher) {
            cashbookService.getIncomeCategory(slug)
        }

    /**
     * get expense category
     */
    suspend fun getExpenseCategory(slug: String): ResponseWrapper<List<CashbookCategoryRes>> =
        safeApiCall(dispatcher) {
            cashbookService.getExpenseCategory(slug)
        }

    /**
     * get closed month list required to close the cashbook [closeCashbook] only the cashbooks that haven't been closed can be closed
     * otherwise the button is disabled
     */
    suspend fun getClosedMonths(): ResponseWrapper<List<ClosedCashbookResponse>> =
        safeApiCall(dispatcher) {
            cashbookService.getClosedMonths()
        }


    /**
     * close cashbook
     */
    suspend fun closeCashbook(param: CloseCashbookParam): ResponseWrapper<CloseCashbookResponse> =
        safeApiCall(dispatcher) {
            val images = param.selectedFiles.map {
                getImageBody(it)
            }
            cashbookService.closeCashbook(images = images, params = getRequestBodyMap(param.date))
        }


    private fun getImageBody(pictureFile: File?): MultipartBody.Part? {
        return pictureFile?.let {
            val imageBody: RequestBody = pictureFile.asRequestBody("image/*".toMediaTypeOrNull())
            val body: MultipartBody.Part = imageBody.let {
                MultipartBody.Part?.createFormData(
                    "image",
                    pictureFile.name ?: "Name",
                    body = imageBody
                )
            }
            body
        }
    }

    private fun getRequestBodyMap(date: String): MutableMap<String, RequestBody> {
        val requestBodyMap: MutableMap<String, RequestBody> = HashMap()
        date.toRequestBody().let {
            requestBodyMap["date"] = it
        }
        return requestBodyMap
    }

}