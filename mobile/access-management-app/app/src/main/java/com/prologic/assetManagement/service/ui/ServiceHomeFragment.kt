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

package com.prologic.assetManagement.service.ui

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.google.android.material.tabs.TabLayoutMediator
import com.prologic.assetManagement.R
import com.prologic.assetManagement.databinding.FragmentServiceHomeBinding
import com.prologic.assetManagement.service.data.ServiceType
import com.prologic.assetManagement.util.getCurrentYearOnly
import com.prologic.assetManagement.util.getMonthAndYear


/**
 * Consists of viewpager to host [ServiceType.QUALITY_TESTS] and [ServiceType.SUPPLY]
 */
class ServiceHomeFragment : Fragment() {

    private var _binding: FragmentServiceHomeBinding? = null
    private val binding get() = _binding!!



    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment

        _binding = FragmentServiceHomeBinding.inflate( inflater,container, false)
        return  binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.btnShowMonthYear.text = getMonthAndYear()
        setUpViewPager()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun setUpViewPager(){
        val services = ServiceType.values()
        binding.viewPagerService.offscreenPageLimit = 2
        val  adapter = ServicePagerAdapter(requireActivity(),services)
        binding.viewPagerService.adapter = adapter
        TabLayoutMediator(binding.tabLayoutService, binding.viewPagerService) { tab, position ->
            when (position) {
                0 -> {
                    tab.text = getString(R.string.tab_supply)
                }
                1 -> {
                    tab.text = getString(R.string.tab_quality_test)
                }

            }

        }.attach()


    }

}