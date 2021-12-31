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

import android.content.Context
import android.os.Bundle
import android.text.InputFilter
import android.text.InputFilter.LengthFilter
import android.text.InputType
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.animation.AnimationUtils
import android.view.inputmethod.InputMethodManager
import androidx.core.content.ContextCompat
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import com.prologic.assetManagement.AssetManagementApp
import com.prologic.assetManagement.R
import com.prologic.assetManagement.databinding.FragmentCashbookBinding
import com.prologic.assetManagement.databinding.FragmentLoginBinding
import com.prologic.assetManagement.network.ResponseWrapper
import com.prologic.assetManagement.util.*
import dagger.hilt.android.AndroidEntryPoint
import timber.log.Timber
import androidx.core.content.ContextCompat.getSystemService
import com.google.firebase.messaging.FirebaseMessaging
import kotlin.math.log


/**
 * Login fragment which takes the phone number and password
 * in order for the user to login
 */

@AndroidEntryPoint
class LoginFragment : Fragment() {

    private var _binding: FragmentLoginBinding? = null
    private val binding get() = _binding!!
    private val loginViewModel: LoginViewModel by viewModels()

    val storage: Storage by lazy {
        Storage(requireContext())
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding = FragmentLoginBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

      loginViewModel.user.observe(viewLifecycleOwner, Observer {
          if (it!= null ){
              loginViewModel._phoneNumber.postValue(it.number)
              loginViewModel._password.postValue("")
              loginViewModel._isPhoneNumberValid.postValue(true)
          }
      })


        val lists = listOf<String>("1", "2", "3", "4", "5", "6", "7", "8", "9", "<", "0", "OK")
        val adapter = NumberDialAdapter(lists = lists) { item ->
            when (item) {
                "OK" ->{

                    loginViewModel.onOkPressed()
                    loginViewModel._password.postValue("")

                }

                "<" -> loginViewModel.eraseOneCharacter()
                else -> loginViewModel.addOneCharacter(item)
            }
        }
        binding.rvNumDial.adapter = adapter

        loginViewModel.isPasswordValid.observe(viewLifecycleOwner, Observer {
            if (it != null) {
                loginViewModel._isPasswordValid.postValue(null)
                showProgressDialog(getString(R.string.loader_loading))
                loginViewModel.login()
            }
        })

        loginViewModel.isPhoneNumberValid.observe(viewLifecycleOwner, Observer {
            if (it != null) {
                if (!it) {
                    binding.btnEditPhoneNumber.hide()
                    binding.etShowInput.inputType = InputType.TYPE_CLASS_PHONE
                   // binding.etShowInput.filters = arrayOf<InputFilter>(LengthFilter(10))

                } else {
                    binding.btnEditPhoneNumber.show()
                     binding.etShowInput.inputType =
                        InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_VARIATION_PASSWORD
                 //   binding.etShowInput.filters = arrayOf<InputFilter>(LengthFilter(8))

                }

                binding.labelInputType.text = if (!it)
                    getString(R.string.login_label_enter_phone_number)
                else
                    getString(R.string.login_label_enter_passcode)

                binding.labelInputTypeTag.text = if (!it)
                    getString(R.string.login_label_phone_number_information)
                else
                    getString(R.string.login_label_passcode_information)
            }
        })

        binding.viewCursor.startAnimation(AnimationUtils.loadAnimation(context,R.anim.blink))

        binding.btnEditPhoneNumber.setOnClickListener {
             binding.etShowInput.text = loginViewModel.phoneNumber.value
            loginViewModel.isPhoneNumberValid.postValue(false)
        }

        loginViewModel.password.observe(viewLifecycleOwner, Observer {
            if (it != null) {
                Timber.d("the password is:"+it)
                binding.etShowInput.text = it

            }
        })

        loginViewModel.phoneNumber.observe(viewLifecycleOwner, Observer {
            if (it != null) {
                binding.etShowInput.text = it
            }
        })

        loginViewModel.loginResponse.observe(viewLifecycleOwner, Observer {
            if (it != null) {
                hideProgressDialog()
                loginViewModel._loginResponse.postValue(null)
                when (it) {
                    is ResponseWrapper.Success -> {
                        val preferredLang = LocaleUtil.getLanguageFromLangCode(it.value.loginResponse.userLang)
                        val sysLang = LocaleUtil.getLanguageFromLangCode(it.value.loginResponse.sysDateFormat)
                        storage.setPreferredLocale(preferredLang)
                        storage.setSysLocale(sysLang)
                        AssetManagementApp.sysLanguage = sysLang
                        AssetManagementApp.userPreference = preferredLang


                        FirebaseMessaging.getInstance().subscribeToTopic(it.value.loginResponse.waterSchemeSlug)
                            .addOnCompleteListener { task ->
                                if (task.isSuccessful) {
                                    Timber.d("success")
                                }
                            }

                        findNavController().navigate(R.id.action_navigate_main_from_login)
                        //  showToast("success")
                    }
                    is ResponseWrapper.GenericError -> {
                        showToast(it.error?.message)

                    }
                    is ResponseWrapper.NetworkError -> {
                        showToast("network")

                    }
                    is ResponseWrapper.NoConnectionError -> requireContext().showNoConnectionErrorDialog()

                }
            }
        })


    }



}