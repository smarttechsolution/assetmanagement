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
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.http.*

interface CashbookService {

    @GET("income/{lang}/list/{water_scheme_slug}/")
    suspend fun getIncome(@Path("water_scheme_slug")  slug:String,
                          @Query("year") year:String?,
                          @Query("month")month:String?,
                          @Query("week") week:Boolean?,
    @Query("start") start: String?,
    @Query("end") end:String?): List<CashbookResponse>

    @GET("expenditure/{lang}/list/{water_scheme_slug}/")
    suspend fun getExpense(@Path("water_scheme_slug") slug:String,
                           @Query("year") year:String?,
                           @Query("month") month:String?,
                           @Query("week") week: Boolean?,
                           @Query("start") start:String?,
                           @Query("end") end:String?
    ): List<CashbookResponse>

    @GET("income-category/list/{water_scheme_slug}/")
    suspend fun getIncomeCategory(@Path("water_scheme_slug") slug:String): List<CashbookCategoryRes>

    @GET("expense-category/list/{water_scheme_slug}")
    suspend fun getExpenseCategory(@Path("water_scheme_slug") slug:String): List<CashbookCategoryRes>

    @GET("present-previous-month/expenditure-total/{lang}/{water_scheme_slug}/")
    suspend fun getPresentPreviousExpense(@Path("water_scheme_slug")waterSchemeSlug:String,@Query("year")year: String?,@Query("month") month: String?): PresentPreviousListResponse


   @GET("present-previous-month/income-total/{lang}/{water_scheme_slug}/")
    suspend fun getPresentPreviousIncome(@Path("water_scheme_slug")waterSchemeSlug: String,@Query("year")year: String?,@Query("month") month: String?): PresentPreviousListResponse


    @POST("expenditure/{lang}/create/")
    suspend fun createExpenditure(@Body addExpenseParam: AddExpenseParam): AddCashbookResponse

    @POST("income/{lang}/create/")
    suspend fun createIncome(@Body addExpenseParam: AddIncomeParam): AddCashbookResponse

    @PUT("expenditure/{lang}/update/{id}/")
    suspend fun editExpenditure(@Path("id") id:String,@Body addExpenseParam: AddExpenseParam): AddCashbookResponse

    @PUT("income/{lang}/update/{id}/")
    suspend fun editIncome(@Path("id")  id:String,@Body addExpenseParam: AddIncomeParam): AddCashbookResponse

    @DELETE("income/delete/{id}/")
    suspend fun deleteIncome(@Path("id")  id:String): Void

    @DELETE("expenditure/delete/{id}/")
    suspend fun deleteExpenditure(@Path("id") id:String) : Void

    @GET("income-expense/closed-month/nep/")
    suspend fun getClosedMonths():List<ClosedCashbookResponse>

    @Multipart
    @POST("close-income-expense/{lang}/")
    suspend fun closeCashbook(  @PartMap params: MutableMap<String, RequestBody>,@Part images: List<MultipartBody.Part?>):CloseCashbookResponse

}