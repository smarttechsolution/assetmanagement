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

package com.prologic.assetManagement.cashbook.data.local

import androidx.room.*
import com.prologic.assetManagement.cashbook.data.Cashbook
import com.prologic.assetManagement.cashbook.data.CashbookType
import kotlinx.coroutines.flow.Flow

@Dao
interface CashbookDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCashbooks(cashbook: List<Cashbook>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCashbook(cashbook: Cashbook)

    @Update
    suspend fun updateCashbook(cashbook: Cashbook)

    @Query("DELETE from cashbook")
    suspend fun clearCache()

     @Query("DELETE from cashbook WHERE id=:id")
    suspend fun deleteCashbook(id:String)

    @Query("DELETE from cashbook WHERE cashbookType=:cashbookType")
    suspend fun deleteCashbookByType(cashbookType: CashbookType)

    @Query("SELECT * from cashbook WHERE cashbookType=:cashbookType AND isWeek=:isWeek ")
    fun getCashbooks(cashbookType: CashbookType,isWeek:Boolean?):Flow<List<Cashbook>>

    @Query("SELECT * from cashbook WHERE id=:cashbookId")
    fun getCashbook(cashbookId: String):Flow<Cashbook>

}