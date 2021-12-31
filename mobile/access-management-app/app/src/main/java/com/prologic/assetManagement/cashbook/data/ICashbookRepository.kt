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

import com.prologic.assetManagement.network.ResponseWrapper

interface ICashbookRepository {
  suspend  fun getExpenses(cashbookParam: CashbookParam):ResponseWrapper<List<CashbookResponse>>
   suspend fun getIncome(cashbookParam: CashbookParam):ResponseWrapper<List<CashbookResponse>>

   suspend fun getPresentPreviousExpense(scheme:String,year:String?,month:String?) : ResponseWrapper<PresentPreviousListResponse>
   suspend fun getPresentPreviousIncome(scheme: String,year:String?,month:String?) : ResponseWrapper<PresentPreviousListResponse>
   suspend fun addIncome(addIncomeParam: AddCashbookParam) : ResponseWrapper<AddCashbookResponse>
   suspend fun addExpense(addExpenseParam: AddCashbookParam) : ResponseWrapper<AddCashbookResponse>

   suspend fun editIncome(id:String,addIncomeParam: AddCashbookParam) : ResponseWrapper<AddCashbookResponse>
   suspend fun editExpense(id:String,addExpenseParam: AddCashbookParam) : ResponseWrapper<AddCashbookResponse>

   suspend fun deleteIncome(id:String):ResponseWrapper<Void>
   suspend fun deleteExpense(id:String):ResponseWrapper<Void>
   suspend fun getIncomeCategory(slug:String) : ResponseWrapper<List<CashbookCategoryRes>>
   suspend fun getExpenseCategory(slug: String) : ResponseWrapper<List<CashbookCategoryRes>>

   suspend fun closeCashbook(closeCashbookParam: CloseCashbookParam) :ResponseWrapper<CloseCashbookResponse>

   suspend fun getClosedCashbooks():List<ClosedCashbook>
}