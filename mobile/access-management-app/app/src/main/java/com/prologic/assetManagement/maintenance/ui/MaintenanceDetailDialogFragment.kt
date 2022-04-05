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

package com.prologic.assetManagement.maintenance.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.hilt.navigation.fragment.hiltNavGraphViewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.prologic.assetManagement.R
import com.prologic.assetManagement.base.BaseDialog
import com.prologic.assetManagement.databinding.FragmentMaintenanceDetailDialogBinding
import com.prologic.assetManagement.maintenance.MaintenanceViewModel
import com.prologic.assetManagement.maintenance.data.MaintenanceDetailResponse
import com.prologic.assetManagement.network.ResponseWrapper
import com.prologic.assetManagement.util.*
import dagger.hilt.android.AndroidEntryPoint
import timber.log.Timber
import java.text.NumberFormat
import java.util.*

/**
 * show the detail of maintenance list
 */
@AndroidEntryPoint
class MaintenanceDetailDialogFragment : BaseDialog() {


    private val maintenanceViewModel: MaintenanceViewModel by hiltNavGraphViewModels(R.id.navigation_maintenance)
    val args: MaintenanceDetailDialogFragmentArgs by navArgs()

    private var _binding: FragmentMaintenanceDetailDialogBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding = FragmentMaintenanceDetailDialogBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        Timber.d("inside is editable is:"+args.isEditable)
        maintenanceViewModel.getMaintenanceDetail(args.componentId,args.rangeId)
        maintenanceViewModel.maintenanceDetail.observe(viewLifecycleOwner, Observer {
            if (it != null) {
                when (it) {
                    is ResponseWrapper.Success -> {
                        setUpDetailView(it.value)
                    }
                    is ResponseWrapper.GenericError -> {

                    }
                    is ResponseWrapper.NetworkError -> {

                    }
                    is ResponseWrapper.NoConnectionError-> requireContext().showNoConnectionErrorDialog()

                }
            }
        })
        binding.btnClose.setOnClickListener {
            dismiss()
        }


    }

    private fun setUpDetailView(detail: MaintenanceDetailResponse) {
        binding.tvTitle.text = args.componentName
        binding.labelMainComponent.text = args.componentName
        binding.tvRiskScore.setRiskScore(detail.riskScore)
        binding.tvActionDate.text = detail.actionDate

        if (detail.maintenanceCost > 1) {
            binding.tvEstimatedCost.setEstimatedCost(detail.maintenanceCost)
            Timber.d("inside if::"+detail.maintenanceCost)
        } else {
            Timber.d("inside elese::")
            var labourCost = detail.labourCost
            var replacementCost = detail.replacementCost
            var materialCost = detail.maintenanceCost

            var total = labourCost + replacementCost + materialCost
            Timber.d("the toal is:"+total)
            binding.tvEstimatedCost.setEstimatedCost(total)

        }





        binding.tvResponsiblePerson.text = detail.designatedPerson
        binding.tvInterval.setInterval(detail.maintenanceInterval)
        binding.tvLogEntries.text = detail.logEntry

        binding.ivPic.loadImage(detail.picture)

        binding.tvReasonFailureAndSolution.text =
            "1. " + detail.possibleFailure + "\n 2. " + detail.action


        val totalLogs =
            NumberFormat.getNumberInstance(Locale.US).parse(detail.possibleTotalLogs).toInt()
        if (totalLogs >= 1) {
            binding.btnAddLog.show()
            binding.btnAddLog.setOnClickListener {
                maintenanceViewModel.totalLogs = totalLogs
                maintenanceViewModel.getMaintenanceLogsDetail(
                    detail.logs.map { it.id },
                    totalLogs,
                    detail.id,
                    args.componentName,
                    detail.possibleFailure,
                    detail.action,
                    args.rangeId
                )
                findNavController().navigate(MaintenanceDetailDialogFragmentDirections.actionShowMaintenanceLogsDialog(args.isEditable))
            }
        }
        else
            binding.btnAddLog.hide()
    }

}