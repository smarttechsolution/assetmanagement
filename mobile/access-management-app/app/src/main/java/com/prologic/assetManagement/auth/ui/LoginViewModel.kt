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

package com.prologic.assetManagement.auth.ui

import androidx.lifecycle.*
import com.prologic.assetManagement.auth.data.*
import com.prologic.assetManagement.network.ResponseWrapper
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.launch
import javax.inject.Inject


/**
 * ViewModel for [LoginFragment]
 *
 */

@HiltViewModel
class LoginViewModel @Inject constructor(private val authRepository: AuthRepository,private  val authStore: AuthStore) : ViewModel() {

    val _loginResponse = MutableLiveData<ResponseWrapper<LoginRes>>()
    val loginResponse: LiveData<ResponseWrapper<LoginRes>> = _loginResponse

    var _phoneNumber = MutableLiveData<String>("")
    var _password = MutableLiveData<String>("")

    val phoneNumber = _phoneNumber
    val password = _password

    var _isPhoneNumberValid = MutableLiveData<Boolean> (false)
    var isPhoneNumberValid = _isPhoneNumberValid

    var _isPasswordValid = MutableLiveData<Boolean>()
    var isPasswordValid = _isPasswordValid

    var user: LiveData<User?> = authStore.getUser().asLiveData()


    /**
     * Send the user input to [authRepository] if the [phoneNumber] and [password] are valid
     */
    fun login() {
        viewModelScope.launch {
            if (validateLoginCredential()) {
                _loginResponse.postValue(authRepository.login(LoginParam(phoneNumber.value!!, password.value!!)))
            }
        }
    }


    fun onOkPressed(){
        if(isPhoneNumberValid.value == false) {
            val phoneNumber = phoneNumber.value
            phoneNumber?.let {
                if (it.isNotEmpty() && it.length == 10)
                    _isPhoneNumberValid.postValue(true)
            }
        }else{
          val password =  password.value
            password?.let{
                if(password.isNotEmpty() && password.length > 3){
                    _isPasswordValid.postValue(true)
                }
            }

        }

    }

    /**
     * to add one character in the textview
     * @param character
     * @return
     *
     */
    fun addOneCharacter(character: String) {
        if(isPhoneNumberValid.value == true) {
            password.value?.let {
                if (it.length<10)
                    _password.postValue(password.value + character)
            }
        }
        else {
           phoneNumber.value?.let {
               if (it.length<10)
                   _phoneNumber.postValue(phoneNumber.value + character)
           }
        }
    }

    /**
     * to erase one character from textview
     */
    fun eraseOneCharacter() {
        if(isPhoneNumberValid.value == true) {
            val value = password.value
            value?.let {
                if(it.isNotEmpty())
                _password.postValue(value.substring(0,value.length - 1))
            }
        }else{
            val value = phoneNumber.value
            value?.let {
                if(it.isNotEmpty())
                _phoneNumber.postValue(value.substring(0,value.length - 1))
            }
        }
    }


    fun validateLoginCredential(): Boolean {
        return !(phoneNumber.value.isNullOrEmpty() || password.value.isNullOrEmpty())


    }
}