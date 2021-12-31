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

package com.prologic.assetManagement.cashbook.ui.close

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.prologic.assetManagement.cashbook.data.CashbookRepository
import com.prologic.assetManagement.cashbook.data.CloseCashbookParam
import com.prologic.assetManagement.cashbook.data.CloseCashbookResponse
import com.prologic.assetManagement.network.ResponseWrapper
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import java.io.File
import javax.inject.Inject

/**
 * ViewModel to close the cashbook
 * communicates with [CashbookRepository] to call the necessary function
 */
@HiltViewModel
class CloseCashbookViewModel  @Inject constructor(private val cashbookRepository: CashbookRepository):ViewModel() {

    val _actionResponse=MutableLiveData<ResponseWrapper<CloseCashbookResponse>>()
    val actionResponse  :LiveData<ResponseWrapper<CloseCashbookResponse>> = _actionResponse
    var files :List<File?>  = mutableListOf()

    fun closeCashbook(date:String){
        viewModelScope.launch {
            val param = CloseCashbookParam(
                date = date,files
            )
           _actionResponse.postValue( cashbookRepository.closeCashbook(param))
        }
    }
}