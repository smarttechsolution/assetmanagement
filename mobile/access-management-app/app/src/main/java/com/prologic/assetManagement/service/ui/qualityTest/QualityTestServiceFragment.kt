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

package com.prologic.assetManagement.service.ui.qualityTest

import android.graphics.Color
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.HeaderViewListAdapter
import androidx.core.content.ContextCompat
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.ConcatAdapter
import com.prologic.assetManagement.AssetManagementApp
import com.prologic.assetManagement.R
import com.prologic.assetManagement.auth.data.LANGUAGE
import com.prologic.assetManagement.databinding.FragmentQualityTestServiceBinding
import com.prologic.assetManagement.databinding.FragmentServiceHomeBinding
import com.prologic.assetManagement.network.ResponseWrapper
import com.prologic.assetManagement.service.data.WaterQualityParameter
import com.prologic.assetManagement.util.*
import dagger.hilt.android.AndroidEntryPoint
import np.com.naveenniraula.ghadi.Pal
import np.com.naveenniraula.ghadi.data.GhadiResult
import np.com.naveenniraula.ghadi.listeners.DatePickCompleteListener
import java.util.*
import javax.xml.validation.Validator

@AndroidEntryPoint
class QualityTestServiceFragment : Fragment() {

    private var _binding: FragmentQualityTestServiceBinding? = null
    private val binding get() = _binding!!
    val viewModel: QualityTestViewModel by viewModels()

    private val waterQualityAdapter = WaterQualityParameterAdapter()
    { waterQualityParameter: WaterQualityParameter ->
        val item = viewModel.parameters.find { waterQualityParameter.id == it.id }
        item?.let {
            it.value = it.value
        } ?: viewModel.parameters.add(waterQualityParameter)
    }
    private val headerAdapter = WaterQualityHeaderAdapter(null, null) { isFrom: Boolean ->
        showDatePicker {
            setDateValues(isFrom, it)
        }
    }

    private val concatAdapter = ConcatAdapter(headerAdapter, waterQualityAdapter)

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding = FragmentQualityTestServiceBinding.inflate(inflater, container, false)
        return binding.root
    }


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.rvSupplyParams.adapter = concatAdapter


        viewModel.waterQualityParams.observe(viewLifecycleOwner, Observer {
            if (!it.isNullOrEmpty()) {
                waterQualityAdapter.submitList(it)
            }
        })

        viewModel.actionResponse.observe(viewLifecycleOwner, Observer {
            if (it != null) {
                viewModel._actionResponse.postValue(null)
                hideProgressDialog()
                when (it) {
                    is ResponseWrapper.Success -> {
                        showToast(getString(R.string.response_save_data_success))
                        resetForm()
                    }
                    is ResponseWrapper.GenericError -> {
                        showToast(it.error?.message)
                    }
                    is ResponseWrapper.NetworkError -> {
                        showToast("Error")
                    }
                    is ResponseWrapper.NoConnectionError-> requireContext().showNoConnectionErrorDialog()

                }

            }
        })

        binding.btnSaveRecord.setOnClickListener {
            val validate = viewModel.validateAddIncomeCashbook()
            if (validate.valid) {
                showProgressDialog(getString(R.string.loader_saving))
                viewModel.createWaterTestResult()
            } else {
                showToast(validate.message)
            }
        }

    }

    private fun resetForm() {
        viewModel.parameters.clear()
        viewModel.fromDate = null
        viewModel.toDate = null

        val headerViewHolder = binding.rvSupplyParams.findViewHolderForAdapterPosition(0)
        headerViewHolder?.let {
            if (it is WaterQualityHeaderAdapter.WaterQualityHeaderViewHolder) {
                it.resetForm()
            }
        }

        val items = viewModel.waterQualityParams.value
        val newItems = items?.map {
            WaterQualityParameter(
                id = it.id,
                name = it.name,
                unit = it.unit,
                standard = it.standard,
                value = null
            )
        }
        waterQualityAdapter.submitList(newItems)


    }

    private fun setDateValues(isFrom: Boolean, date: String) {
        if (isFrom) {
            headerAdapter.setStartDate(date)
            viewModel.fromDate = date
        } else {
            headerAdapter.setEndDate(date)
            viewModel.toDate = date
        }
    }


    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

}