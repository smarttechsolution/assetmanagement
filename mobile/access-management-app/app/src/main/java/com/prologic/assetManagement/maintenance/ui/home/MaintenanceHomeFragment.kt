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

package com.prologic.assetManagement.maintenance.ui.home

import android.os.Bundle
import androidx.fragment.app.Fragment
import androidx.core.os.bundleOf
import androidx.fragment.app.viewModels
import androidx.hilt.navigation.fragment.hiltNavGraphViewModels
import androidx.lifecycle.Observer
import androidx.navigation.navGraphViewModels
import com.google.android.material.tabs.TabLayoutMediator
import com.prologic.assetManagement.R
import com.prologic.assetManagement.cashbook.data.CashbookType
import com.prologic.assetManagement.cashbook.ui.CashbookFragment
import com.prologic.assetManagement.databinding.FragmentMaintenanceHomeBinding
import com.prologic.assetManagement.maintenance.MaintenanceFragment
import com.prologic.assetManagement.maintenance.MaintenancePagerAdapter
import com.prologic.assetManagement.maintenance.data.MaintenanceType
import com.prologic.assetManagement.network.ResponseWrapper
import com.prologic.assetManagement.util.getCurrentYearOnly
import com.prologic.assetManagement.util.showNoConnectionErrorDialog
import com.prologic.assetManagement.util.showToast
import dagger.hilt.android.AndroidEntryPoint
import android.view.*

import androidx.appcompat.widget.PopupMenu
import androidx.navigation.fragment.findNavController
import com.prologic.assetManagement.NavigationMaintenanceDirections


/**
 * [MaintenanceFragment] to show the different types of [MaintenanceType] which are:
 * [MaintenanceType.REACTIVE]
 * [MaintenanceType.INSPECTION]
 * [MaintenanceType.PREVENTIVE]
 */
@AndroidEntryPoint
class MaintenanceHomeFragment : Fragment() {

    private var _binding: FragmentMaintenanceHomeBinding? = null
    private val binding get() = _binding!!
    val maintenanceHomeViewModel: MaintenanceHomeViewModel by viewModels()
    val maintenances = MaintenanceType.values()
    lateinit var fragments: List<MaintenanceFragment>

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding = FragmentMaintenanceHomeBinding.inflate(inflater, container, false)
        return binding.root
    }


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        maintenanceHomeViewModel.rangeResponse.observe(viewLifecycleOwner, Observer {
            if (it != null) {
                maintenanceHomeViewModel._rangeResponse.postValue(null)
                when (it) {
                    is ResponseWrapper.NoConnectionError -> requireContext().showNoConnectionErrorDialog()
                    is ResponseWrapper.NetworkError -> showToast(getString(R.string.error_server))
                    is ResponseWrapper.GenericError -> showToast(it.error?.message)
                    else -> {

                    }
                }
            }
        })

        binding.btnSortLogs.setOnClickListener {
            showPopupMenu(binding.btnSortLogs)
        }

        maintenanceHomeViewModel.selectedYear.observe(viewLifecycleOwner, Observer {
            if (it != null) {
                binding.btnShowYear.text =
                    getString(R.string.extra_year) + " " + it.yearNo + "(" + it.startDate + " - " + it.endDate + ")"
                if (binding.viewPagerMaintenance.adapter == null)
                    setUpViewPager(it.id)
                else {
                    val fragments: List<Fragment>? = activity?.supportFragmentManager?.fragments
                    fragments?.map { fragment ->
                        if (fragment is MaintenanceFragment) {
                            fragment.refreshData(fragment.maintenanceType, it.id, null)
                        }
                    }

                }
            }
        })

        binding.btnLeft.setOnClickListener {
            maintenanceHomeViewModel.decreaseDateRange()
        }

        binding.btnRight.setOnClickListener {
            maintenanceHomeViewModel.increaseDateRage()
        }
        binding.fabUnscheduledMaintenance.setOnClickListener {
            findNavController().navigate(NavigationMaintenanceDirections.actionShowAddNotScheduledMaintenance(rangeId = maintenanceHomeViewModel.selectedYear.value?.id?:""))
        }

    }

    private fun setUpViewPager(id: String) {
        binding.viewPagerMaintenance.offscreenPageLimit = 3
        fragments = listOf(
            getMaintenanceFragment(MaintenanceType.PREVENTIVE, id),
            getMaintenanceFragment(MaintenanceType.INSPECTION, id),
            getMaintenanceFragment(MaintenanceType.REACTIVE, id),
        )
        val adapter = MaintenancePagerAdapter(requireActivity(), fragments)
        binding.viewPagerMaintenance.adapter = adapter
        TabLayoutMediator(
            binding.tabLayoutMaintenance,
            binding.viewPagerMaintenance
        ) { tab, position ->
            when (position) {
                0 -> {
                    tab.text = getString(R.string.tab_preventive)
                }
                1 -> {
                    tab.text = getString(R.string.tab_inspections)
                }
                2 -> {
                    tab.text = getString(R.string.tab_reactive)
                }

            }

        }.attach()


    }

    /**
     * to filter the maintenance logs
     */
    fun showPopupMenu(view: View) {
        val popup = PopupMenu(requireContext(), view);
        popup.menuInflater.inflate(R.menu.menu_filter_maintenance, popup.menu)
        popup.setOnMenuItemClickListener(object : PopupMenu.OnMenuItemClickListener {
            override fun onMenuItemClick(item: MenuItem): Boolean {
                when (item.itemId) {
                    R.id.menuActionDate -> {
                        val fragments: List<Fragment>? = activity?.supportFragmentManager?.fragments
                        fragments?.map { fragment ->
                            if (fragment is MaintenanceFragment) {
                                fragment.refreshData(
                                    fragment.maintenanceType,
                                    fragment.rangeId,
                                    "next_action"
                                )
                            }
                        }

                    }
                    R.id.menuEstimatedCost -> {
                        val fragments: List<Fragment>? = activity?.supportFragmentManager?.fragments
                        fragments?.map { fragment ->
                            if (fragment is MaintenanceFragment) {
                                fragment.refreshData(
                                    fragment.maintenanceType,
                                    fragment.rangeId,
                                    "maintenance_cost"
                                )
                            }
                        }

                    }
                    R.id.menuRiskScore -> {
                        val fragments: List<Fragment>? = activity?.supportFragmentManager?.fragments
                        fragments?.map { fragment ->
                            if (fragment is MaintenanceFragment) {
                                fragment.refreshData(
                                    fragment.maintenanceType,
                                    fragment.rangeId,
                                    "resulting_risk_score"
                                )
                            }
                        }
                    }
                }
                return true
            }

        })
        popup.show();//showing popup menu
    }


    private fun getMaintenanceFragment(
        type: MaintenanceType,
        rangeId: String
    ): MaintenanceFragment {
        val maintenanceFragment = MaintenanceFragment()
        maintenanceFragment.arguments = bundleOf(
            "maintenance" to type.name,
            "rangeId" to rangeId
        )
        return maintenanceFragment
    }

}
