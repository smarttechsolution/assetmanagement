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

import com.prologic.assetManagement.cashbook.data.Cashbook
import com.prologic.assetManagement.cashbook.data.CashbookType
import com.prologic.assetManagement.network.IoDispatcher
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext
import javax.inject.Inject

/**
 * [LocalCashbookSource] performs all the local cashbook operation in the database
 */
class LocalCashbookSource @Inject constructor(
    private val cashbookDao: CashbookDao,
    @IoDispatcher private val ioDispatcher: CoroutineDispatcher
) {


    fun getCashbooks(cashbookType: CashbookType, isWeek: Boolean): Flow<List<Cashbook>> =
        cashbookDao.getCashbooks(cashbookType, isWeek = isWeek)

    fun getCashbook(cashbookId: String): Flow<Cashbook> =
        cashbookDao.getCashbook(cashbookId)

    suspend fun addCashbook(cashbook: Cashbook) = withContext(ioDispatcher) {
        cashbookDao.insertCashbook(cashbook)
    }

    suspend fun updateCashbook(cashbook: Cashbook) = withContext(ioDispatcher) {
        cashbookDao.insertCashbook(cashbook)
    }

    suspend fun deleteCashbook(cashbookId: String) = withContext(ioDispatcher) {
        cashbookDao.deleteCashbook(cashbookId)
    }

    suspend fun deleteCashbookByType(cashbookType: CashbookType) = withContext(ioDispatcher) {
        cashbookDao.deleteCashbookByType(cashbookType)
    }

    suspend fun addCashbooks(cashbooks: List<Cashbook>) = withContext(ioDispatcher) {
        cashbookDao.insertCashbooks(cashbooks)
    }

    suspend fun clearCache() = withContext(ioDispatcher) {
        cashbookDao.clearCache()
    }

}