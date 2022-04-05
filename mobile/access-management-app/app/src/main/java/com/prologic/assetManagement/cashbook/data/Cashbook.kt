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

import androidx.annotation.StringRes
import androidx.room.Embedded
import androidx.room.Entity
import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName
import java.io.File
import java.util.*

enum class CashbookType {
    INCOME, EXPENDITURE
}

@Entity
data class Cashbook(
    @PrimaryKey val id: String,
    val dateEn: String,
    val title: String,
    val amount: String,
    val waterSupplied: String?,
    val dateNep: String?,
    val date: String,
    val isWeek: Boolean,
    val remarks: String?,
    val cashbookType: CashbookType,
    @Embedded(prefix = "category") val category: CashbookCategory
)

sealed class CashbookUiModel {
    class CashbookDateUiModel(var cashbookDate: String) : CashbookUiModel()
    class CashbookCategoryUiModel(var cashbookCategory: CashbookCategory) : CashbookUiModel()
    class CashbookInfoUiModel(var cashbook: Cashbook) : CashbookUiModel()

}

data class CashbookCategory(
    val id: String,
    val name: String,
    val eName:String?

)

data class CashbookTotal(
    val category: String,
    val total: String
)

data class CashbookToggle(
    val title: String,
    val isWeek: Boolean?
)

data class CashbookParam(
    val cashbookType: CashbookType,
    val slug: String,
    val year: String?,
    val month: String?,
    val week: Boolean,
    val start: String?,
    val end: String?,
    val selectedDate: Date?
)

data class AddCashbookParam(
    val category: CashbookCategory,
    val date: String,
    val title: String,
    val income: Double,
    val replacementAmt:Double?,
    val labourAmount:Double?,
    val materialAmount:Double?,
    val waterSupplied: Int?,
    val isWeek: Boolean?,
    val remarks: String?,
)

data class AddIncomeParam(
    @SerializedName("category") val category: String,
    @SerializedName("date") val date: String,
    @SerializedName("title") val title: String,
    @SerializedName("income_amount") val income: Double,
    @SerializedName("water_supplied") val waterSupplied: Int?
)

data class DeleteCashbookResponse(val message: String)


data class AddExpenseParam(
    @SerializedName("category") val category: String,
    @SerializedName("date") val date: String,
    @SerializedName("title") val title: String,
    @SerializedName("income_amount") val amount: Double,
    @SerializedName("remarks") val remarks: String?,
    @SerializedName("consumables_cost") val consumableCost:Double?,
    @SerializedName("replacement_cost") val replacementCost:Double?,
    @SerializedName("labour_cost") val labourCost:Double?
)

data class AddCashbookResponse(
    @SerializedName("id") val id: String,
    @SerializedName("category") val category: String,
    @SerializedName("date") val date: String,
    @SerializedName("date_np") val dateNep: String,
    @SerializedName("title") val title: String,
    @SerializedName("income_amount") val amount: String,
    @SerializedName("remarks") val remarks: String?,
    @SerializedName("water_supplied") val waterSupplied: String
)

data class ClosedCashbookResponse(
    @SerializedName("date_np") val dateNp: String,
    @SerializedName("date") val date: String
)

data class CashbookResponse(
    @SerializedName("id") val id: String,
    @SerializedName("category") val categoryRes: CashbookCategoryRes,
    @SerializedName("date") val date: String,
    @SerializedName("title") val title: String,
    @SerializedName("income_amount") val incomeAmount: String,
    @SerializedName("water_supplied") val waterSupplied: String,
    @SerializedName("date_np") val dateNep: String
)

data class CashbookCategoryRes(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("e_name") val eName: String?,

)

data class ClosedCashbook(val dateEn: String, val date: String)

data class CloseCashbookResponse(
    @SerializedName("message") val message: String
)

data class CloseCashbookParam(
    val date: String,
    val selectedFiles: List<File?>

)

data class PresentPreviousListResponse(
    @SerializedName("previous_month_data") val previousMonthData: List<PresentPreviousResponse>,
    @SerializedName("present_month_data") val presentMonthData: List<PresentPreviousResponse>,
)

data class PresentPreviousResponse(
    @SerializedName("income_category_name") val incomeCategoryName: String,
    @SerializedName("expense_category_name") val expenseCategoryName: String,
    @SerializedName("total_income_amount") val totalIncomeAmount: String,
    @SerializedName("total_expense_amount") val totalExpenseAmount: String,
)

