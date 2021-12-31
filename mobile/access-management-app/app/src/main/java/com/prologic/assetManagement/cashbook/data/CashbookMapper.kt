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

import com.prologic.assetManagement.AssetManagementApp
import com.prologic.assetManagement.auth.data.LANGUAGE
import com.prologic.assetManagement.util.getServerDateFormat
import java.util.*

fun CashbookCategoryRes.toCashbookCategory() = CashbookCategory(
    id, name
)

fun getEmptyCashbook(id:String,cashbookType: CashbookType, date: String) = Cashbook(
    id, "", "---------", "------", "", "", date, true, null, cashbookType,
    CashbookCategory("-1", "---")

)

fun CashbookResponse.toCashbook(cashbookType: CashbookType, isWeek: Boolean) = Cashbook(
    id, date, title,
    incomeAmount,
    waterSupplied, dateNep,
    if (AssetManagementApp.sysLanguage == LANGUAGE.ENGLISH) date else dateNep,
    isWeek,
    null,
    cashbookType,
    categoryRes.toCashbookCategory()
)

fun AddCashbookResponse.toCashbook(
    id: String,
    cashbookType: CashbookType,
    category: CashbookCategory,
    isWeek: Boolean?
) = Cashbook(
    id,
    date,
    title,
    amount,
    waterSupplied,
    dateNep,
    if (AssetManagementApp.sysLanguage == LANGUAGE.ENGLISH) date else dateNep,
    isWeek ?: false,
    null,
    cashbookType,
    category
)

fun AddCashbookParam.toAddIncomeParam() = AddIncomeParam(
    category.id, date, title, income, waterSupplied
)

fun AddCashbookParam.toAddExpenseParam() = AddExpenseParam(
    category.id, date, title, income, remarks = remarks
)

fun PresentPreviousResponse.toCashbookTotal(cashbookType: CashbookType) = CashbookTotal(
    if (cashbookType == CashbookType.INCOME) incomeCategoryName else expenseCategoryName,
    if (cashbookType == CashbookType.INCOME) totalIncomeAmount else totalExpenseAmount
)