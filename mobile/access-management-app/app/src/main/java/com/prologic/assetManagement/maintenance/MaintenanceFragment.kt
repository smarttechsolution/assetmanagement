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

package com.prologic.assetManagement.maintenance

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.TimePicker
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import com.prologic.assetManagement.NavigationMaintenanceDirections
import com.prologic.assetManagement.R
import com.prologic.assetManagement.databinding.FragmentMaintenanceBinding
import com.prologic.assetManagement.maintenance.data.Maintenance
import com.prologic.assetManagement.maintenance.data.MaintenanceComponent
import com.prologic.assetManagement.maintenance.data.MaintenanceLog
import com.prologic.assetManagement.maintenance.data.MaintenanceType
import com.prologic.assetManagement.util.getCurrentYearOnly
import com.prologic.assetManagement.util.hide
import com.prologic.assetManagement.util.show
import dagger.hilt.android.AndroidEntryPoint
import timber.log.Timber

@AndroidEntryPoint
class MaintenanceFragment : Fragment() {

    private val maintenanceViewModel: MaintenanceViewModel by viewModels()
    private var _binding: FragmentMaintenanceBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!
    lateinit var maintenanceType: MaintenanceType

    lateinit var rangeId: String
    val adapter = MaintenanceAdapter { maintenance: Maintenance ->
        Timber.d("the component is:" + maintenance)
        findNavController().navigate(
            NavigationMaintenanceDirections.actionShowMaintenanceDetail(
                maintenance.id,
                maintenance.component.name,
                rangeId = rangeId,
                false
            )
        )
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentMaintenanceBinding.inflate(inflater, container, false)
        return binding.root
    }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val type = arguments?.getString("maintenance")!!
        rangeId = arguments?.getString("rangeId")!!
        maintenanceType = MaintenanceType.valueOf(type)
        maintenanceViewModel.getMaintenanceLogs(maintenanceType, rangeId = rangeId, null)
    }

    fun refreshData(maintenanceType: MaintenanceType, rangeId: String, ordering: String?) {
        this.rangeId = rangeId
        adapter.submitList(mutableListOf())
        maintenanceViewModel.getMaintenanceLogs(maintenanceType, rangeId, ordering)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)



        binding.rvMaintenance.adapter = adapter

        maintenanceViewModel.maintenanceLogs.observe(viewLifecycleOwner, Observer {
            if (it != null) {
                binding.pbMaintenance.hide()
                if (it.isNotEmpty()) {
                    binding.tvMaintenanceError.hide()
                    adapter.submitList(it)
                } else {
                    binding.tvMaintenanceError.text = getString(R.string.maintenance_empty).replace(
                        "{maintenanceType}",
                        maintenanceType.name
                    )
                    binding.tvMaintenanceError.show()
                }
            }
        })

        /*  binding.fabMaintenance.setOnClickListener {
              findNavController().navigate(
                  NavigationMaintenanceDirections.actionShowNotScheduledMaintenance(
                      maintenanceType = maintenanceType,
                      rangeId = rangeId
                  )
              )
          }
         */


    }

    override fun onDestroy() {
        super.onDestroy()
        _binding = null
    }
}