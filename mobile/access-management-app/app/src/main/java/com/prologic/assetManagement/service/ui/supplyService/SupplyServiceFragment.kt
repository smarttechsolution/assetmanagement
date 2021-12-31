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

package com.prologic.assetManagement.service.ui.supplyService

import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import com.prologic.assetManagement.AssetManagementApp
import com.prologic.assetManagement.R
import com.prologic.assetManagement.auth.data.LANGUAGE
import com.prologic.assetManagement.databinding.FragmentSupplyServiceBinding
import com.prologic.assetManagement.network.ResponseWrapper
import com.prologic.assetManagement.service.data.SupplyBelt
import com.prologic.assetManagement.util.*
import dagger.hilt.android.AndroidEntryPoint
import np.com.naveenniraula.ghadi.Pal
import np.com.naveenniraula.ghadi.data.GhadiResult
import np.com.naveenniraula.ghadi.listeners.DatePickCompleteListener
import java.util.*


@AndroidEntryPoint
class SupplyServiceFragment : Fragment(), AdapterView.OnItemSelectedListener {

    private val serviceViewModel: SupplyServiceViewModel by viewModels()
    private var _binding: FragmentSupplyServiceBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentSupplyServiceBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        serviceViewModel.supplyBelts.observe(viewLifecycleOwner, Observer {
            if (it != null) {
                val belts = it.map { it.name }.toMutableList()
                belts.add(0, getString(R.string.maintenance_log_supply_belt))
                val spinnerAdapter: ArrayAdapter<String> = object : ArrayAdapter<String>(
                    requireContext(),
                    R.layout.item_simple_spinner,
                    belts
                ) {


                    override fun isEnabled(position: Int): Boolean {
                        return position != 0
                    }

                    override fun getDropDownView(
                        position: Int, convertView: View?,
                        parent: ViewGroup?
                    ): View? {
                        val view = super.getDropDownView(position, convertView, parent)
                        val tv = view as TextView
                        if (position == 0) {
                            // Set the hint text color gray
                            tv.setTextColor(Color.GRAY)
                        } else {
                            tv.setTextColor(Color.BLACK)
                        }
                        return view
                    }

                }
                binding.spinnerSupplyBelt.adapter = spinnerAdapter
                binding.spinnerSupplyBelt.onItemSelectedListener = this
            }
        })

        binding.btnShowFromDate.setOnClickListener {

            showDatePicker {
                binding.btnShowFromDate.text = it
                serviceViewModel.fromDate = it

                showProgressDialog(getString(R.string.loader_loading))
                serviceViewModel.getWaterSupplyForSelectedDate()
            }

        }
        binding.btnShowToDate.setOnClickListener {

            if (serviceViewModel.fromDate != null) {
                showDatePicker {
                    binding.btnShowToDate.text = it
                    serviceViewModel.toDate = it
                    showProgressDialog(getString(R.string.loader_loading))
                    serviceViewModel.getWaterSupplyForSelectedDate()
                }
            } else {
                showToast(getString(R.string.error_supply_from_date_empty))
            }
        }

        binding.cbToggleDates.setOnCheckedChangeListener { compoundButton, b ->
            if (b) {
                binding.btnShowToDate.show()
            } else {
                serviceViewModel.toDate = null
                binding.btnShowToDate.setText("")
                binding.btnShowToDate.hide()
            }
        }

        serviceViewModel.actionResponse.observe(viewLifecycleOwner, Observer {
            if (it != null) {
                serviceViewModel._actionResponse.postValue(null)
                hideProgressDialog()
                resetForm()
                when (it) {
                    is ResponseWrapper.Success -> {
                        if (serviceViewModel.estimatedBeneficiaries == null || serviceViewModel.estimatedHouseholds == null) {
                            binding.etEstimatedHouseholds.setText(it.value.estimatedHouseholds.toString())
                            binding.etEstimatedBeneficiaries.setText(it.value.estimatedBeneficiaries.toString())
                            binding.etTotalSupply.setText(it.value.totalSupply.toString())

                            val belts = serviceViewModel.supplyBelts.value
                            val item = belts?.find { belt -> belt.id == it.value.supplyBelts }
                            val pos = belts?.indexOf(item)
                            pos?.let {
                                binding.spinnerSupplyBelt.setSelection(it+1)
                            }

                            serviceViewModel.estimatedBeneficiaries =
                                it.value.estimatedBeneficiaries
                            serviceViewModel.estimatedHouseholds = it.value.estimatedHouseholds
                            serviceViewModel.totalSupply = it.value.totalSupply
                            serviceViewModel.selectedSupplyBelt = it.value.supplyBelts


                        } else {
                            showToast(getString(R.string.response_save_data_success))
                            serviceViewModel.fromDate = null
                            serviceViewModel.toDate = null

                            binding.btnShowToDate.setText("")
                            binding.btnShowFromDate.setText("")
                        }
                    }
                    is ResponseWrapper.GenericError -> {
                        showToast(it.error?.message)
                    }
                    is ResponseWrapper.NetworkError -> {
                        showToast("Error")
                    }
                    is ResponseWrapper.NoConnectionError -> requireContext().showNoConnectionErrorDialog()

                }
            }
        })

        binding.btnSaveRecord.setOnClickListener {
            serviceViewModel.totalSupply = binding.etTotalSupply.text.toString()
            serviceViewModel.estimatedBeneficiaries =
                binding.etEstimatedBeneficiaries.text.toString()
            serviceViewModel.estimatedHouseholds = binding.etEstimatedHouseholds.text.toString()


            val response = serviceViewModel.validateAddIncomeCashbook()
            if (response.valid) {
                serviceViewModel.createWaterSupply()
                showProgressDialog(getString(R.string.loader_saving))
            } else showToast(response.message)


        }
    }

    private fun resetForm() {
        binding.etTotalSupply.setText("")
        binding.etEstimatedBeneficiaries.setText("")
        binding.etEstimatedHouseholds.setText("")

        serviceViewModel.totalSupply = null
        serviceViewModel.estimatedBeneficiaries = null
        serviceViewModel.estimatedHouseholds = null

    }


    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onItemSelected(p0: AdapterView<*>?, p1: View?, p2: Int, p3: Long) {
        if (p2>0) {
            (p0!!.getChildAt(0) as TextView).setTextColor(Color.BLACK)
            val belts: List<SupplyBelt>? = serviceViewModel.supplyBelts.value
            val item = belts?.elementAt(p2-1)
            item?.let {
                serviceViewModel.selectedSupplyBelt = it.id
            }
        }
    }

    override fun onNothingSelected(p0: AdapterView<*>?) {
        TODO("Not yet implemented")
    }
}