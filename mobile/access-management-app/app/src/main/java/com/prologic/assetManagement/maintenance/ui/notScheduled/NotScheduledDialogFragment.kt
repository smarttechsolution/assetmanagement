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

package com.prologic.assetManagement.maintenance.ui.notScheduled

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.hilt.navigation.fragment.hiltNavGraphViewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.prologic.assetManagement.NavigationMaintenanceDirections
import com.prologic.assetManagement.R
import com.prologic.assetManagement.base.BaseDialog
import com.prologic.assetManagement.databinding.FragmentMaintenanceDetailDialogBinding
import com.prologic.assetManagement.databinding.FragmentNotScheduledDialogBinding
import com.prologic.assetManagement.maintenance.MaintenanceAdapter
import com.prologic.assetManagement.maintenance.MaintenanceViewModel
import com.prologic.assetManagement.maintenance.data.Maintenance
import com.prologic.assetManagement.maintenance.data.MaintenanceComponent
import com.prologic.assetManagement.maintenance.ui.MaintenanceDetailDialogFragmentArgs
import com.prologic.assetManagement.util.hide
import com.prologic.assetManagement.util.show
import dagger.hilt.android.AndroidEntryPoint


/**
 * Display this fragment for unscheduled maintenance logs
 */
@AndroidEntryPoint
class NotScheduledDialogFragment : BaseDialog() {

    private val viewModel: NotScheduledViewModel by hiltNavGraphViewModels(R.id.navigation_maintenance)
    val args: NotScheduledDialogFragmentArgs by navArgs()


    private var _binding: FragmentNotScheduledDialogBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding = FragmentNotScheduledDialogBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)


        /*   viewModel.getNotScheduledMaintenanceLogs(args.maintenanceType, args.rangeId)

        val adapter = MaintenanceAdapter { maintenance: Maintenance ->
            findNavController().navigate(
                NavigationMaintenanceDirections.actionShowMaintenanceDetail(
                    maintenance.id, maintenance.component.name, rangeId = args.rangeId,
                    true
                )
            )
        }
        binding.rvMaintenance.adapter = adapter

        viewModel.maintenanceLogs.observe(viewLifecycleOwner, Observer {
            if (it != null) {
                binding.pbMaintenance.hide()
                if (it.isNotEmpty()) {
                    binding.tvMaintenanceError.hide()
                    adapter.submitList(it)
                } else {
                    binding.tvMaintenanceError.text =
                        getString(R.string.not_scheduled_maintenance_empty).replace(
                            "{maintenanceType}",
                            args.maintenanceType.name
                        )
                    binding.tvMaintenanceError.show()
                }
            }
        })
    }*/
    }
}